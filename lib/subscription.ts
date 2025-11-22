import { prisma } from "./prisma"
import { stripe, TRIAL_PERIOD_DAYS, getPlanLimits } from "./stripe"
import type { PlanType, BillingCycle } from "@prisma/client"

/**
 * Create a Stripe customer and trial subscription for a new user
 * Users start with BASIC plan on 14-day trial
 */
export async function createFreeSubscription(userId: string, email: string) {
  // Create Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  // Calculate trial end date (14 days from now)
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_PERIOD_DAYS)

  // Create subscription record - starts with BASIC plan on trial
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: customer.id,
      plan: "BASIC",
      billingCycle: "MONTHLY",
      status: "TRIALING",
      submissionsLimit: 1000,
      submissionsUsed: 0,
      customDomainsLimit: 1,
      customDomainsUsed: 0,
      removeBranding: true,
      trialEndsAt,
    },
  })

  return subscription
}

/**
 * Get user's subscription with all details
 */
export async function getUserSubscription(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  })
}

/**
 * Check if user has exceeded their submission quota
 */
export async function checkSubmissionQuota(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return false
  }

  // Check if we need to reset usage for new billing period
  if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
    await resetUsage(userId)
    return true
  }

  return subscription.submissionsUsed < subscription.submissionsLimit
}

/**
 * Increment submission usage
 */
export async function incrementSubmissionUsage(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      submissionsUsed: {
        increment: 1,
      },
    },
  })

  // Create usage record
  const subscription = await getUserSubscription(userId)
  if (subscription?.currentPeriodStart && subscription?.currentPeriodEnd) {
    await prisma.usageRecord.create({
      data: {
        userId,
        type: "SUBMISSION",
        count: 1,
        periodStart: subscription.currentPeriodStart,
        periodEnd: subscription.currentPeriodEnd,
      },
    })
  }
}

/**
 * Reset usage at the start of a new billing period
 */
export async function resetUsage(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      submissionsUsed: 0,
    },
  })
}

/**
 * Update subscription after successful payment
 */
export async function updateSubscription(
  userId: string,
  data: {
    plan: PlanType
    billingCycle: BillingCycle
    stripeSubscriptionId: string
    stripePriceId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
  }
) {
  const limits = getPlanLimits(data.plan, data.billingCycle)

  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: data.plan,
      billingCycle: data.billingCycle,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripePriceId: data.stripePriceId,
      status: "ACTIVE",
      submissionsLimit: limits.submissionsLimit,
      submissionsUsed: 0,
      customDomainsLimit: limits.customDomainsLimit,
      removeBranding: limits.removeBranding,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      trialEndsAt: null,
    },
  })
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  })
}

/**
 * Cancel subscription - set to CANCELED status
 * User loses access when subscription ends
 */
export async function cancelSubscriptionCompletely(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
      cancelAtPeriodEnd: true,
    },
  })
}

/**
 * Check if user can add custom domain
 */
export async function canAddCustomDomain(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return false
  }

  return subscription.customDomainsUsed < subscription.customDomainsLimit
}

/**
 * Get usage stats for dashboard
 */
export async function getUsageStats(userId: string) {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return null
  }

  const submissionPercentage = Math.round(
    (subscription.submissionsUsed / subscription.submissionsLimit) * 100
  )

  const domainPercentage = subscription.customDomainsLimit > 0
    ? Math.round(
        (subscription.customDomainsUsed / subscription.customDomainsLimit) * 100
      )
    : 0

  return {
    submissions: {
      used: subscription.submissionsUsed,
      limit: subscription.submissionsLimit,
      percentage: submissionPercentage,
    },
    domains: {
      used: subscription.customDomainsUsed,
      limit: subscription.customDomainsLimit,
      percentage: domainPercentage,
    },
    plan: subscription.plan,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
    trialEndsAt: subscription.trialEndsAt,
  }
}
