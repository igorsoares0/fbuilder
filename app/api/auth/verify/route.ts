import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyEmailSchema } from "@/lib/validations/auth"
import { verifyVerificationToken, deleteVerificationToken } from "@/lib/tokens"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { token } = validationResult.data

    // Verify token
    const tokenResult = await verifyVerificationToken(token)
    if (!tokenResult.valid || !tokenResult.email) {
      return NextResponse.json(
        { error: tokenResult.error || "Invalid or expired token" },
        { status: 400 }
      )
    }

    const email = tokenResult.email

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete the used token
    await deleteVerificationToken(email, token)

    // Send welcome email
    await sendWelcomeEmail(email, user.name || undefined)

    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    )
  }
}
