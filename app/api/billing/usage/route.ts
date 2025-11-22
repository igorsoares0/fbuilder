import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUsageStats } from "@/lib/subscription"
import { ensureUserHasSubscription } from "@/lib/ensure-subscription"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user has a subscription (auto-create if needed)
    await ensureUserHasSubscription(session.user.id, session.user.email)

    const usage = await getUsageStats(session.user.id)

    if (!usage) {
      return NextResponse.json({ error: "Usage not found" }, { status: 404 })
    }

    return NextResponse.json(usage)
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    )
  }
}
