import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/forms/slug/[slug] - Get form by slug (PUBLIC endpoint)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const form = await prisma.form.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        elements: true,
        background: true,
        status: true,
        createdAt: true,
        publishedAt: true,
      },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    if (form.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'This form is not published' },
        { status: 403 }
      )
    }

    // Increment view count
    await prisma.form.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}
