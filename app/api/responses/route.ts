import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { submitFormSchema } from '@/lib/validations/form'
import { headers } from 'next/headers'
import { checkSubmissionQuota, incrementSubmissionUsage } from '@/lib/subscription'

// POST /api/responses - Submit a form response (PUBLIC endpoint)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = submitFormSchema.parse(body)

    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: validatedData.formId },
      include: { user: true },
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

    // Check submission quota for form owner
    const hasQuota = await checkSubmissionQuota(form.userId)

    if (!hasQuota) {
      return NextResponse.json(
        { error: 'Form owner has reached their submission limit. Please contact the form owner.' },
        { status: 402 }
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

    // Increment submission usage for form owner
    await incrementSubmissionUsage(form.userId)

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
