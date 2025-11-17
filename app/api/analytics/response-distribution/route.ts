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
    const fieldId = searchParams.get("fieldId")

    if (!formId || formId === "all") {
      return NextResponse.json(
        { error: "Please select a specific form to view response distribution" },
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
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const elements = form.elements as any[]

    // If no fieldId specified, return list of fields to choose from
    if (!fieldId) {
      const fields = elements.map(el => ({
        id: el.id,
        label: el.label || el.placeholder || "Untitled Field",
        type: el.type,
      }))

      return NextResponse.json({
        formTitle: form.title,
        fields,
      })
    }

    // Find the specific field
    const field = elements.find(el => el.id === fieldId)
    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 })
    }

    // Get all responses for this form
    const responses = await prisma.formResponse.findMany({
      where: { formId },
      select: {
        data: true,
      },
    })

    const totalResponses = responses.length

    // Analyze based on field type
    let analysis: any = {
      fieldId,
      fieldLabel: field.label || field.placeholder || "Untitled Field",
      fieldType: field.type,
      totalResponses,
    }

    // Extract answers for this field
    const answers = responses
      .map(r => (r.data as any)[fieldId])
      .filter(answer => answer !== undefined && answer !== null && answer !== "")

    const answeredCount = answers.length
    const skipRate = totalResponses > 0
      ? ((totalResponses - answeredCount) / totalResponses) * 100
      : 0

    analysis.answeredCount = answeredCount
    analysis.skipRate = skipRate

    switch (field.type) {
      case "multipleChoice": {
        // Count occurrences of each option
        const distribution: Record<string, number> = {}
        answers.forEach(answer => {
          const answerStr = String(answer)
          distribution[answerStr] = (distribution[answerStr] || 0) + 1
        })

        const distributionArray = Object.entries(distribution)
          .map(([option, count]) => ({
            option,
            count,
            percentage: answeredCount > 0 ? (count / answeredCount) * 100 : 0,
          }))
          .sort((a, b) => b.count - a.count)

        analysis.distribution = distributionArray
        break
      }

      case "rating": {
        // Count occurrences of each rating
        const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        let sum = 0

        answers.forEach(answer => {
          const rating = Number(answer)
          if (rating >= 1 && rating <= 5) {
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1
            sum += rating
          }
        })

        const ratingDistribution = Object.entries(ratingCounts)
          .map(([rating, count]) => ({
            rating: Number(rating),
            count,
            percentage: answeredCount > 0 ? (count / answeredCount) * 100 : 0,
          }))
          .sort((a, b) => a.rating - b.rating)

        analysis.ratingDistribution = ratingDistribution
        analysis.avgRating = answeredCount > 0 ? sum / answeredCount : 0
        break
      }

      case "text":
      case "shortText": {
        // Count exact matches for short text
        const textCounts: Record<string, number> = {}
        answers.forEach(answer => {
          const text = String(answer).trim()
          if (text) {
            textCounts[text] = (textCounts[text] || 0) + 1
          }
        })

        const topAnswers = Object.entries(textCounts)
          .map(([text, count]) => ({
            text,
            count,
            percentage: answeredCount > 0 ? (count / answeredCount) * 100 : 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Top 10

        analysis.topAnswers = topAnswers
        analysis.uniqueAnswers = Object.keys(textCounts).length
        break
      }

      case "longText": {
        // For long text, just show count and some stats
        const wordCounts: Record<string, number> = {}

        answers.forEach(answer => {
          const text = String(answer).toLowerCase()
          const words = text.split(/\s+/).filter(w => w.length > 3) // Only words > 3 chars

          words.forEach(word => {
            // Remove punctuation
            const cleanWord = word.replace(/[^\w]/g, "")
            if (cleanWord) {
              wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1
            }
          })
        })

        const wordCloud = Object.entries(wordCounts)
          .map(([word, frequency]) => ({ word, frequency }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 30) // Top 30 words

        analysis.wordCloud = wordCloud
        analysis.uniqueAnswers = answers.length
        break
      }

      case "email": {
        // Just show count of unique emails
        const uniqueEmails = new Set(answers.map(a => String(a).toLowerCase()))
        analysis.uniqueEmails = uniqueEmails.size
        break
      }

      default: {
        // Generic count
        analysis.answers = answers.slice(0, 100) // First 100 answers
        break
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error fetching response distribution:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
