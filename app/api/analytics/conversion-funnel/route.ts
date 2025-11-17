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
    const formId = searchParams.get("formId")

    if (!formId || formId === "all") {
      return NextResponse.json(
        { error: "Please select a specific form to view conversion funnel" },
        { status: 400 }
      )
    }

    // Get the form and verify ownership
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: {
        id: true,
        userId: true,
        title: true,
        elements: true,
        views: true,
        submissions: true,
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const elements = form.elements as any[]

    // Get all responses for this form
    const responses = await prisma.formResponse.findMany({
      where: { formId },
      select: {
        data: true,
      },
    })

    const totalResponses = responses.length

    // Build funnel steps based on form elements
    const steps = elements.map((element, index) => {
      // Count how many responses have this field filled
      const completedCount = responses.filter(response => {
        const data = response.data as any
        const value = data[element.id]
        // Check if field is filled (not null, undefined, or empty string)
        return value !== undefined && value !== null && value !== ""
      }).length

      // Calculate reached count (how many people got to this field)
      // For simplicity, we assume if they filled it, they reached it
      // If they skipped it but filled later fields, they still reached it
      let reachedCount = completedCount

      // Check if they filled any field AFTER this one
      const laterFieldIds = elements.slice(index + 1).map(el => el.id)
      responses.forEach(response => {
        const data = response.data as any
        const currentFieldFilled = data[element.id] !== undefined &&
                                   data[element.id] !== null &&
                                   data[element.id] !== ""

        // If current field is not filled but they filled a later field, they still "reached" it
        if (!currentFieldFilled) {
          const filledLaterField = laterFieldIds.some(fieldId => {
            const val = data[fieldId]
            return val !== undefined && val !== null && val !== ""
          })
          if (filledLaterField) {
            reachedCount++
          }
        }
      })

      // Completion rate for this field
      const completionRate = reachedCount > 0
        ? (completedCount / reachedCount) * 100
        : 0

      // Dropoff rate
      const dropoffRate = 100 - completionRate

      return {
        fieldId: element.id,
        fieldLabel: element.label || element.placeholder || "Untitled Field",
        fieldType: element.type,
        position: index + 1,
        reached: reachedCount,
        completed: completedCount,
        completionRate,
        dropoffRate,
      }
    })

    // Calculate overall funnel metrics
    const conversionRate = form.views > 0
      ? (totalResponses / form.views) * 100
      : 0

    return NextResponse.json({
      formId: form.id,
      formTitle: form.title,
      totalViews: form.views,
      totalResponses,
      conversionRate,
      steps,
    })
  } catch (error) {
    console.error("Error fetching conversion funnel:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
