import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe, getPriceId } from "@/lib/stripe"
import { getUserSubscription } from "@/lib/subscription"
import { ensureUserHasSubscription } from "@/lib/ensure-subscription"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please contact support." },
        { status: 503 }
      )
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Application is not properly configured. Please contact support." },
        { status: 503 }
      )
    }

    const { plan, billingCycle } = await req.json()

    if (!plan || !billingCycle) {
      return NextResponse.json(
        { error: "Plan and billing cycle are required" },
        { status: 400 }
      )
    }

    if (plan !== "BASIC" && plan !== "PRO") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    if (billingCycle !== "MONTHLY" && billingCycle !== "YEARLY") {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      )
    }

    // Ensure user has a subscription (auto-create if needed)
    const subscription = await ensureUserHasSubscription(
      session.user.id,
      session.user.email
    )

    // Get price ID
    const priceId = getPriceId(plan, billingCycle)

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: subscription.stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        plan,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)

    // Provide more specific error messages
    let errorMessage = "Failed to create checkout session"

    if (error?.type === "StripeInvalidRequestError") {
      errorMessage = "Invalid Stripe configuration. Please contact support."
    } else if (error?.message?.includes("price")) {
      errorMessage = "Invalid price configuration. Please contact support."
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
