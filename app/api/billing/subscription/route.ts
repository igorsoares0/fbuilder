import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserSubscription } from "@/lib/subscription"
import { ensureUserHasSubscription } from "@/lib/ensure-subscription"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user has a subscription (auto-create if needed)
    const subscription = await ensureUserHasSubscription(
      session.user.id,
      session.user.email
    )

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}
