import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { submitFormSchema } from '@/lib/validations/form'
import { headers } from 'next/headers'

// POST /api/responses - Submit a form response (PUBLIC endpoint)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = submitFormSchema.parse(body)

    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: validatedData.formId },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    if (form.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'This form is not accepting responses' },
        { status: 403 }
      )
    }

    // Get IP address and user agent from headers
    const headersList = await headers()
    const ipAddress = validatedData.ipAddress ||
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown'
    const userAgent = validatedData.userAgent ||
      headersList.get('user-agent') ||
      'unknown'

    // Create response and increment form submissions count
    const [response] = await prisma.$transaction([
      prisma.formResponse.create({
        data: {
          formId: validatedData.formId,
          data: validatedData.data,
          ipAddress,
          userAgent,
        },
      }),
      prisma.form.update({
        where: { id: validatedData.formId },
        data: {
          submissions: { increment: 1 },
        },
      }),
    ])

    return NextResponse.json(
      { success: true, responseId: response.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting form response:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}
