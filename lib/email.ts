import Mailgun from "mailgun.js"
import FormData from "form-data"

const mailgun = new Mailgun(FormData)

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

const domain = process.env.MAILGUN_DOMAIN || ""
const fromEmail = process.env.MAILGUN_FROM_EMAIL || "noreply@example.com"
const fromName = process.env.MAILGUN_FROM_NAME || "Form Builder"
const appUrl = process.env.APP_URL || "http://localhost:3000"
const appName = process.env.APP_NAME || "Form Builder"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.warn("Mailgun not configured. Email not sent:", { to, subject })
    return { success: false, error: "Email service not configured" }
  }

  try {
    const result = await mg.messages.create(domain, {
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    })

    return { success: true, id: result.id }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${appUrl}/verify?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>

        <p>Thank you for signing up! Please click the button below to verify your email address and activate your account.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Verify Email Address
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:
          <br>
          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
        </p>

        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Verify your email for ${appName}`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>

        <p>We received a request to reset your password. Click the button below to create a new password.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:
          <br>
          <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
        </p>

        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>

        <div style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 12px; border-radius: 6px; margin-top: 20px;">
          <strong>Security Notice:</strong> Never share this link with anyone. ${appName} will never ask for your password via email.
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Reset your password for ${appName}`,
    html,
  })
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const loginUrl = `${appUrl}/login`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${appName}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Welcome${name ? `, ${name}` : ""}!</h2>

        <p>Your email has been verified and your account is now active. You can start creating beautiful forms right away!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <h3 style="color: #333;">What you can do:</h3>
        <ul style="color: #666;">
          <li>Create unlimited forms with our drag-and-drop builder</li>
          <li>Customize colors, fonts, and themes</li>
          <li>Share forms with unique URLs</li>
          <li>Track responses and analytics</li>
        </ul>

        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Welcome to ${appName}!`,
    html,
  })
}
