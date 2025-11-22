"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface UsageStats {
  submissions: {
    used: number
    limit: number
    percentage: number
  }
  plan: string
}

export function UsageWidget() {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/billing/usage")
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error("Error fetching usage:", error)
    }
  }

  if (!usage) return null

  const isNearLimit = usage.submissions.percentage >= 80
  const isOverLimit = usage.submissions.percentage >= 100

  return (
    <Card className={isOverLimit ? "border-red-300" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Usage This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Submissions</span>
            <span className="font-semibold">
              {usage.submissions.used.toLocaleString()} /{" "}
              {usage.submissions.limit.toLocaleString()}
            </span>
          </div>
          <Progress
            value={Math.min(usage.submissions.percentage, 100)}
            className={isOverLimit ? "bg-red-100" : ""}
          />
        </div>

        {isNearLimit && (
          <div className="flex items-start gap-2 text-xs text-amber-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {isOverLimit
                ? "Limit reached! Upgrade to accept more submissions."
                : `You've used ${usage.submissions.percentage}% of your quota.`}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => router.push("/billing")}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
