import { prisma } from "./prisma"
import { createFreeSubscription } from "./subscription"

/**
 * Ensures a user has a subscription, creating one if needed
 * This is useful for existing users who were created before billing was implemented
 */
export async function ensureUserHasSubscription(userId: string, email: string) {
  try {
    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (existingSubscription) {
      return existingSubscription
    }

    // User doesn't have a subscription, create one
    console.log(`Creating subscription for existing user: ${email}`)

    const subscription = await createFreeSubscription(userId, email)

    console.log(`✅ Subscription created for user: ${email}`)

    return subscription
  } catch (error) {
    console.error("Error ensuring subscription:", error)
    throw error
  }
}
