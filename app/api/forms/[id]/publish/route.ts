import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishFormSchema } from '@/lib/validations/form'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'

// POST /api/forms/[id]/publish - Publish or unpublish a form
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = publishFormSchema.parse(body)

    // Check if form exists and belongs to user
    const existingForm = await prisma.form.findUnique({
      where: { id },
    })

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingForm.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // If publishing and slug is provided, check if it's unique
    if (validatedData.status === 'PUBLISHED' && validatedData.slug) {
      const existingSlug = await prisma.form.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      })

      if (existingSlug) {
        return NextResponse.json(
          { error: 'This slug is already in use' },
          { status: 409 }
        )
      }
    }

    const form = await prisma.form.update({
      where: { id },
      data: {
        status: validatedData.status,
        slug: validatedData.slug,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error publishing form:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'This slug is already in use' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to publish form' },
      { status: 500 }
    )
  }
}
