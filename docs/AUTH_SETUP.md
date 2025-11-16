# Authentication Setup Guide

This guide explains how to set up the complete authentication system for Form Builder.

## Prerequisites

1. **Mailgun Account** - For sending emails
   - Sign up at https://www.mailgun.com/
   - Verify your domain
   - Get your API key

2. **Google Cloud Console** - For Google OAuth
   - Create a project at https://console.cloud.google.com/
   - Enable Google+ API
   - Create OAuth 2.0 credentials

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output to `NEXTAUTH_SECRET` in `.env`

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth (REQUIRED)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (for Google login)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Mailgun (for email verification & password reset)
MAILGUN_API_KEY="your-api-key"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_FROM_EMAIL="noreply@your-domain.com"

# App Settings
APP_URL="http://localhost:3000"
APP_NAME="Form Builder"
```

## Database Migration

After setting up the environment, run the database migration:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name add_auth_tables

# Or for production
npx prisma migrate deploy
```

### Migration Notes

The migration will:
1. Create `users` table for user accounts
2. Create `accounts` table for OAuth providers
3. Create `sessions` table for session management
4. Create `verification_tokens` table for email verification
5. Create `password_reset_tokens` table for password resets
6. Add `userId` column to `forms` table (foreign key to users)

**Important:** Existing forms will need to be assigned to a user. The migration script should handle this by:
- Creating a default admin user
- Assigning orphaned forms to that user

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the consent screen:
   - User Type: External
   - App name: Form Builder
   - User support email: your email
   - Authorized domains: your domain
6. Create OAuth Client:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env`

## Mailgun Setup

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Add and verify your domain
3. Go to "Sending" > "Domain settings" > "SMTP credentials"
4. Get your API key from "API Security"
5. Add to `.env`:
   ```env
   MAILGUN_API_KEY="your-api-key"
   MAILGUN_DOMAIN="mg.your-domain.com"
   MAILGUN_FROM_EMAIL="noreply@your-domain.com"
   ```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Security
- Email verification tokens expire in 24 hours
- Password reset tokens expire in 1 hour
- Tokens are cryptographically secure (256-bit)
- Single-use tokens (deleted after use)

### Session Management
- JWT-based sessions with database adapter
- Automatic session refresh
- Secure cookie settings (HttpOnly, SameSite)

### Rate Limiting (Recommended)
Consider adding rate limiting to:
- `/api/auth/register` - Prevent mass registration
- `/api/auth/forgot-password` - Prevent email flooding
- `/api/auth/[...nextauth]` - Prevent brute force attacks

## Authentication Flow

### Registration
1. User submits name, email, password
2. Password is hashed with bcrypt (12 rounds)
3. User record created (unverified)
4. Verification token generated
5. Verification email sent via Mailgun
6. User clicks link in email
7. Email marked as verified
8. Welcome email sent
9. User can now log in

### Login (Email/Password)
1. User enters email and password
2. System checks email verification status
3. Password compared with bcrypt
4. JWT token created
5. Session established
6. User redirected to dashboard

### Login (Google OAuth)
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Google returns authorization code
4. System exchanges code for tokens
5. User profile retrieved from Google
6. Account linked or created (auto-verified)
7. Session established
8. User redirected to dashboard

### Password Reset
1. User requests password reset
2. System generates secure token
3. Reset email sent (generic response for security)
4. User clicks link in email
5. User enters new password
6. Password updated, token deleted
7. All existing sessions invalidated
8. User can log in with new password

## File Structure

```
app/
├── (auth)/                    # Auth pages group
│   ├── layout.tsx            # Clean auth layout
│   ├── login/page.tsx        # Login form
│   ├── signup/page.tsx       # Registration form
│   ├── verify/page.tsx       # Email verification
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── api/auth/
│   ├── [...nextauth]/route.ts  # NextAuth handler
│   ├── register/route.ts       # Registration endpoint
│   ├── verify/route.ts         # Email verification
│   ├── forgot-password/route.ts
│   └── reset-password/route.ts

lib/
├── auth.ts                   # NextAuth configuration
├── email.ts                  # Mailgun email service
├── tokens.ts                 # Token generation/verification
├── validations/auth.ts       # Zod schemas

middleware.ts                 # Route protection

components/providers/
└── session-provider.tsx      # Client-side session provider

types/
└── next-auth.d.ts           # TypeScript declarations
```

## Testing the Setup

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Test Registration:**
   - Go to `/signup`
   - Create an account
   - Check email for verification link
   - Click link to verify

3. **Test Login:**
   - Go to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`

4. **Test Google OAuth:**
   - Go to `/login`
   - Click "Continue with Google"
   - Complete OAuth flow
   - Should redirect to `/dashboard`

5. **Test Password Reset:**
   - Go to `/forgot-password`
   - Enter email
   - Check email for reset link
   - Set new password
   - Log in with new password

6. **Test Protected Routes:**
   - Try accessing `/dashboard` without auth
   - Should redirect to `/login`
   - After login, should have access

## Production Checklist

- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set `APP_URL` to production domain
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Update Google OAuth redirect URIs
- [ ] Verify Mailgun domain for production
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring for auth failures
- [ ] Test all auth flows in production
- [ ] Review security headers (CSP, HSTS, etc.)

## Troubleshooting

### "Invalid email or password"
- Check if email is verified
- Verify password meets requirements
- Check database connection

### Emails not sending
- Verify Mailgun API key
- Check domain is verified
- Review Mailgun logs
- Test in sandbox mode first

### Google OAuth not working
- Check redirect URIs match exactly
- Verify client ID and secret
- Ensure consent screen is configured
- Check for JavaScript errors

### Session issues
- Clear cookies and try again
- Check `NEXTAUTH_SECRET` is consistent
- Verify database connection
- Check browser console for errors

## Support

For issues:
1. Check the troubleshooting section
2. Review server logs
3. Check browser console
4. Verify environment variables
5. Test database connection
