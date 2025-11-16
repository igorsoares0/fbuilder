/**
 * Migration script to handle existing forms after adding authentication
 *
 * This script:
 * 1. Creates a default admin user
 * 2. Assigns all orphaned forms to the admin user
 *
 * Run with: npx ts-node scripts/migrate-auth.ts
 * Or: npx tsx scripts/migrate-auth.ts
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting auth migration...")

  // Check if there are any forms without userId
  const orphanedForms = await prisma.form.findMany({
    where: {
      userId: null as unknown as string,
    },
  })

  if (orphanedForms.length === 0) {
    console.log("No orphaned forms found. Migration complete.")
    return
  }

  console.log(`Found ${orphanedForms.length} orphaned forms.`)

  // Create or find admin user
  let adminUser = await prisma.user.findFirst({
    where: { email: "admin@formbuilder.local" },
  })

  if (!adminUser) {
    console.log("Creating admin user...")

    // Generate a secure random password
    const tempPassword = require("crypto").randomBytes(16).toString("hex")
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@formbuilder.local",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    console.log(`Admin user created with email: admin@formbuilder.local`)
    console.log(`Temporary password: ${tempPassword}`)
    console.log("IMPORTANT: Change this password immediately!")
  } else {
    console.log("Admin user already exists.")
  }

  // Assign orphaned forms to admin user
  console.log("Assigning orphaned forms to admin user...")

  const updateResult = await prisma.form.updateMany({
    where: {
      userId: null as unknown as string,
    },
    data: {
      userId: adminUser.id,
    },
  })

  console.log(`Updated ${updateResult.count} forms.`)
  console.log("Migration complete!")
}

main()
  .catch((e) => {
    console.error("Migration failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
