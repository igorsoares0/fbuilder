-- First, update any existing FREE subscriptions to BASIC
UPDATE "subscriptions"
SET
  "plan" = 'BASIC',
  "billingCycle" = 'MONTHLY',
  "submissionsLimit" = 1000,
  "customDomainsLimit" = 1,
  "removeBranding" = true
WHERE "plan" = 'FREE';

-- Remove FREE from enum
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'PRO');

-- Update the subscriptions table to use new enum
ALTER TABLE "subscriptions"
  ALTER COLUMN "plan" DROP DEFAULT,
  ALTER COLUMN "plan" TYPE "PlanType" USING ("plan"::text::"PlanType"),
  ALTER COLUMN "plan" SET DEFAULT 'BASIC';

-- Update billingCycle to be non-nullable with default
ALTER TABLE "subscriptions"
  ALTER COLUMN "billingCycle" SET DEFAULT 'MONTHLY',
  ALTER COLUMN "billingCycle" TYPE "BillingCycle" USING (COALESCE("billingCycle", 'MONTHLY'));

ALTER TABLE "subscriptions"
  ALTER COLUMN "billingCycle" SET NOT NULL;

-- Update defaults for trial
ALTER TABLE "subscriptions"
  ALTER COLUMN "submissionsLimit" SET DEFAULT 1000,
  ALTER COLUMN "customDomainsLimit" SET DEFAULT 1,
  ALTER COLUMN "removeBranding" SET DEFAULT true;

-- Drop old enum
DROP TYPE "PlanType_old";
