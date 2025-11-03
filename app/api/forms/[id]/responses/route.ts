import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/forms/[id]/responses - Get all responses for a form
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if form exists
    const form = await prisma.form.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        elements: true,
      },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Get all responses
    const responses = await prisma.formResponse.findMany({
      where: { formId: id },
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json({
      form,
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
