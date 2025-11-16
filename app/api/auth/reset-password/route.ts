import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { verifyPasswordResetToken, deletePasswordResetToken } from "@/lib/tokens"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { token, password } = validationResult.data

    // Verify token
    const tokenResult = await verifyPasswordResetToken(token)
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the used token
    await deletePasswordResetToken(token)

    // Optionally: invalidate all existing sessions for this user
    await prisma.session.deleteMany({
      where: { userId: user.id },
    })

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in with your new password." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "An error occurred during password reset" },
      { status: 500 }
    )
  }
}
