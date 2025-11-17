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
        startDate = new Date(0)
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
      },
    })

    const formIds = forms.map(f => f.id)

    if (formIds.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Get all responses in the period
    const responses = await prisma.formResponse.findMany({
      where: {
        formId: {
          in: formIds,
        },
        submittedAt: {
          gte: startDate,
        },
      },
      select: {
        submittedAt: true,
      },
      orderBy: {
        submittedAt: "asc",
      },
    })

    // Group responses by date
    const dateMap = new Map<string, number>()

    responses.forEach(response => {
      const date = response.submittedAt.toISOString().split("T")[0]
      dateMap.set(date, (dateMap.get(date) || 0) + 1)
    })

    // Fill in missing dates with 0 responses
    const data = []
    const currentDate = new Date(startDate)

    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0]
      data.push({
        date: dateStr,
        responses: dateMap.get(dateStr) || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching timeline analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
