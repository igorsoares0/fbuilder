import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import {
  updateSubscription,
  cancelSubscription,
  cancelSubscriptionCompletely,
  resetUsage,
} from "@/lib/subscription"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Get subscription details
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // Find user by customer ID
        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: session.customer as string },
        })

        if (!userSubscription) {
          console.error("User subscription not found for customer:", session.customer)
          break
        }

        // Determine plan and billing cycle from price ID
        const priceId = subscription.items.data[0].price.id
        let plan: "BASIC" | "PRO" = "BASIC"
        let billingCycle: "MONTHLY" | "YEARLY" = "MONTHLY"

        if (priceId === process.env.STRIPE_BASIC_MONTHLY_PRICE_ID) {
          plan = "BASIC"
          billingCycle = "MONTHLY"
        } else if (priceId === process.env.STRIPE_BASIC_YEARLY_PRICE_ID) {
          plan = "BASIC"
          billingCycle = "YEARLY"
        } else if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) {
          plan = "PRO"
          billingCycle = "MONTHLY"
        } else if (priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID) {
          plan = "PRO"
          billingCycle = "YEARLY"
        }

        // Update subscription
        await updateSubscription(userSubscription.userId, {
          plan,
          billingCycle,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })

        console.log("✅ Subscription activated:", userSubscription.userId, plan)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (!userSubscription) {
          console.error("User subscription not found for subscription:", subscription.id)
          break
        }

        // Update status and period dates
        const status = subscription.status === "active"
          ? "ACTIVE"
          : subscription.status === "past_due"
          ? "PAST_DUE"
          : subscription.status === "canceled"
          ? "CANCELED"
          : subscription.status === "trialing"
          ? "TRIALING"
          : "ACTIVE"

        await prisma.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })

        console.log("✅ Subscription updated:", userSubscription.userId, status)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (!userSubscription) {
          console.error("User subscription not found for subscription:", subscription.id)
          break
        }

        // Mark subscription as CANCELED - user loses access
        await cancelSubscriptionCompletely(userSubscription.userId)

        console.log("✅ Subscription canceled completely:", userSubscription.userId)
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice

        // Find user by customer ID
        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        })

        if (!userSubscription) {
          console.error("User subscription not found for customer:", invoice.customer)
          break
        }

        // Save invoice
        await prisma.invoice.create({
          data: {
            userId: userSubscription.userId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status || "paid",
            hostedInvoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf,
          },
        })

        // Reset usage for new billing period
        await resetUsage(userSubscription.userId)

        console.log("✅ Invoice paid and usage reset:", userSubscription.userId)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        })

        if (!userSubscription) {
          console.error("User subscription not found for customer:", invoice.customer)
          break
        }

        // Mark as past due
        await prisma.subscription.update({
          where: { userId: userSubscription.userId },
          data: {
            status: "PAST_DUE",
          },
        })

        console.log("⚠️ Payment failed, marked as past due:", userSubscription.userId)
        // TODO: Send email notification
        break
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (!userSubscription) {
          console.error("User subscription not found for customer:", subscription.customer)
          break
        }

        console.log("⏰ Trial ending soon:", userSubscription.userId)
        // TODO: Send email notification 3 days before trial ends
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
