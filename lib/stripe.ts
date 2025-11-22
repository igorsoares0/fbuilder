import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

// Plan configurations
export const PLANS = {
  BASIC: {
    name: "Basic",
    monthly: {
      price: 19,
      priceId: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID!,
      submissionsLimit: 1000,
    },
    yearly: {
      price: 199,
      priceId: process.env.STRIPE_BASIC_YEARLY_PRICE_ID!,
      submissionsLimit: 12000,
    },
    customDomainsLimit: 1,
    removeBranding: true,
    features: [
      "1,000 submissions/month",
      "12,000 submissions/year",
      "1 custom domain",
      "Remove branding",
      "Advanced analytics",
    ],
  },
  PRO: {
    name: "Pro",
    monthly: {
      price: 47,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      submissionsLimit: 7000,
    },
    yearly: {
      price: 470,
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
      submissionsLimit: 84000,
    },
    customDomainsLimit: 5,
    removeBranding: true,
    features: [
      "7,000 submissions/month",
      "84,000 submissions/year",
      "5 custom domains",
      "Remove branding",
      "Priority support",
      "Advanced analytics",
    ],
  },
} as const

export const TRIAL_PERIOD_DAYS = 14

// Helper to get plan limits based on plan and billing cycle
export function getPlanLimits(
  plan: "BASIC" | "PRO",
  billingCycle: "MONTHLY" | "YEARLY"
) {
  const planConfig = PLANS[plan]
  const cycleConfig =
    billingCycle === "YEARLY" ? planConfig.yearly : planConfig.monthly

  return {
    submissionsLimit: cycleConfig.submissionsLimit,
    customDomainsLimit: planConfig.customDomainsLimit,
    removeBranding: planConfig.removeBranding,
  }
}

// Helper to get price ID
export function getPriceId(
  plan: "BASIC" | "PRO",
  billingCycle: "MONTHLY" | "YEARLY"
): string {
  const planConfig = PLANS[plan]
  return billingCycle === "YEARLY"
    ? planConfig.yearly.priceId
    : planConfig.monthly.priceId
}
