import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Always return success to prevent email enumeration
    // But only send email if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user && user.password) {
      // Only send reset email for users with passwords (not OAuth-only)
      const token = await generatePasswordResetToken(email)
      await sendPasswordResetEmail(email, token)
    }

    // Return generic success message
    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we sent a password reset link.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
