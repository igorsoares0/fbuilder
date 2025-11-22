import { prisma } from "../lib/prisma"
import { stripe } from "../lib/stripe"

/**
 * Migration script to add billing/subscription data to existing users
 * Run this once after deploying the billing feature
 */

async function migrateUsersToBilling() {
  console.log("🚀 Starting user migration to billing system...")

  try {
    // Get all users without a subscription
    const users = await prisma.user.findMany({
      where: {
        subscription: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    console.log(`📊 Found ${users.length} users to migrate`)

    let successCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        console.log(`\n👤 Processing user: ${user.email}`)

        // Create Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        })

        console.log(`  ✓ Created Stripe customer: ${customer.id}`)

        // Calculate trial end date (14 days from now)
        const trialEndsAt = new Date()
        trialEndsAt.setDate(trialEndsAt.getDate() + 14)

        // Create subscription record - BASIC plan with trial
        await prisma.subscription.create({
          data: {
            userId: user.id,
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

        console.log(`  ✓ Created subscription record`)
        successCount++
      } catch (error) {
        console.error(`  ✗ Error migrating user ${user.email}:`, error)
        errorCount++
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log("✅ Migration completed!")
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    console.log("=".repeat(50))
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateUsersToBilling()
  .then(() => {
    console.log("\n✨ All done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error)
    process.exit(1)
  })
