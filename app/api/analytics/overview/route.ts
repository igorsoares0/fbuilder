import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "30d"
    const formId = searchParams.get("formId") || "all"

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "all":
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Build where clause for forms
    const formWhere: any = {
      userId: session.user.id,
    }

    if (formId !== "all") {
      formWhere.id = formId
    }

    // Get all forms for the user (or specific form)
    const forms = await prisma.form.findMany({
      where: formWhere,
      select: {
        id: true,
        views: true,
        submissions: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })

    // Calculate totals
    const totalForms = forms.length
    const totalViews = forms.reduce((sum, form) => sum + form.views, 0)
    const totalResponses = forms.reduce((sum, form) => sum + form.submissions, 0)

    // Calculate average completion rate
    const avgCompletionRate = totalViews > 0
      ? (totalResponses / totalViews) * 100
      : 0

    // Get responses for the current period
    const currentPeriodResponses = await prisma.formResponse.count({
      where: {
        formId: {
          in: forms.map(f => f.id),
        },
        submittedAt: {
          gte: startDate,
        },
      },
    })

    // Calculate previous period for comparison
    let previousStartDate = new Date(startDate)
    let previousEndDate = new Date(startDate)

    switch (period) {
      case "7d":
        previousStartDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        previousStartDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        previousStartDate.setDate(startDate.getDate() - 90)
        break
      case "all":
        // For "all", we can't compare, so set to 0
        previousStartDate = new Date(0)
        previousEndDate = new Date(0)
        break
      default:
        previousStartDate.setDate(startDate.getDate() - 30)
    }

    const previousPeriodResponses = period !== "all"
      ? await prisma.formResponse.count({
          where: {
            formId: {
              in: forms.map(f => f.id),
            },
            submittedAt: {
              gte: previousStartDate,
              lt: previousEndDate,
            },
          },
        })
      : 0

    // Calculate growth percentage
    const growth = previousPeriodResponses > 0
      ? ((currentPeriodResponses - previousPeriodResponses) / previousPeriodResponses) * 100
      : currentPeriodResponses > 0
        ? 100
        : 0

    return NextResponse.json({
      totalForms,
      totalViews,
      totalResponses,
      avgCompletionRate,
      periodComparison: {
        current: currentPeriodResponses,
        previous: previousPeriodResponses,
        growth,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics overview:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
