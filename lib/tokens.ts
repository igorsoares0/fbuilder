import crypto from "crypto"
import { prisma } from "./prisma"

export async function generateVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(
    Date.now() + (Number(process.env.EMAIL_VERIFICATION_EXPIRES) || 86400) * 1000
  )

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

export async function verifyVerificationToken(token: string) {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  })

  if (!verificationToken) {
    return { valid: false, error: "Invalid token" }
  }

  if (verificationToken.expires < new Date()) {
    // Clean up expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })
    return { valid: false, error: "Token has expired" }
  }

  return { valid: true, email: verificationToken.identifier }
}

export async function deleteVerificationToken(email: string, token: string) {
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })
}

export async function generatePasswordResetToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(
    Date.now() + (Number(process.env.PASSWORD_RESET_EXPIRES) || 3600) * 1000
  )

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return token
}

export async function verifyPasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return { valid: false, error: "Invalid token" }
  }

  if (resetToken.expires < new Date()) {
    // Clean up expired token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })
    return { valid: false, error: "Token has expired" }
  }

  return { valid: true, email: resetToken.email }
}

export async function deletePasswordResetToken(token: string) {
  await prisma.passwordResetToken.delete({
    where: { token },
  })
}
