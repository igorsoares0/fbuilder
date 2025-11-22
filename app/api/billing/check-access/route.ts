import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { hasActiveSubscription } from "@/lib/subscription"
import { ensureUserHasSubscription } from "@/lib/ensure-subscription"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user has a subscription (auto-create if needed)
    await ensureUserHasSubscription(session.user.id, session.user.email)

    // Check if user has active subscription
    const hasAccess = await hasActiveSubscription(session.user.id)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking access:", error)
    return NextResponse.json(
      { error: "Failed to check access" },
      { status: 500 }
    )
  }
}
