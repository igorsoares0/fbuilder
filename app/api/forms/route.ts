import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createFormSchema } from '@/lib/validations/form'
import { getDefaultTemplate, getBlankTemplate, getDefaultBackground } from '@/lib/helpers/form-templates'

// GET /api/forms - List all forms
export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        status: true,
        views: true,
        submissions: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        _count: {
          select: { responses: true },
        },
      },
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}

// POST /api/forms - Create a new form
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createFormSchema.parse(body)

    // Get template elements based on type
    const elements = validatedData.template === 'blank'
      ? getBlankTemplate()
      : getDefaultTemplate()

    const background = getDefaultBackground()

    const form = await prisma.form.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        elements,
        background,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
}
