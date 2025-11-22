import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getUserSubscription } from "@/lib/subscription"
import { ensureUserHasSubscription } from "@/lib/ensure-subscription"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Stripe is configured
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set NEXT_PUBLIC_APP_URL in your environment variables." },
        { status: 503 }
      )
    }

    // Ensure user has a subscription (auto-create if needed)
    const subscription = await ensureUserHasSubscription(
      session.user.id,
      session.user.email
    )

    // Create Stripe Customer Portal Session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json(
      { error: "Failed to create portal session. Please check your Stripe configuration." },
      { status: 500 }
    )
  }
}
