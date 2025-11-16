import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/forms/[id]/responses - Get all responses for a form
export async function GET(
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

    // Check if form exists and belongs to user
    const form = await prisma.form.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        elements: true,
        userId: true,
      },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (form.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all responses
    const responses = await prisma.formResponse.findMany({
      where: { formId: id },
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        elements: form.elements,
      },
      responses,
      total: responses.length,
    })
  } catch (error) {
    console.error('Error fetching form responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
