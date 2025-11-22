"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Calendar, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UsageStats {
  submissions: {
    used: number
    limit: number
    percentage: number
  }
  domains: {
    used: number
    limit: number
    percentage: number
  }
  plan: "FREE" | "BASIC" | "PRO"
  status: string
  currentPeriodEnd: string | null
  trialEndsAt: string | null
}

export default function BillingPage() {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
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
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch("/api/billing/create-portal", {
        method: "POST",
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error opening portal:", error)
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading billing info...</p>
        </div>
      </div>
    )
  }

  if (!usage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Failed to load billing information</p>
      </div>
    )
  }

  const isTrialing = usage.status === "TRIALING"
  const isPastDue = usage.status === "PAST_DUE"
  const isCanceled = usage.status === "CANCELED"

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billing & Usage
          </h1>
          <p className="text-gray-600">
            Manage your subscription and monitor your usage
          </p>
        </div>

        {/* Alerts */}
        {isTrialing && usage.trialEndsAt && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Your free trial ends on{" "}
              {new Date(usage.trialEndsAt).toLocaleDateString()}. Add a payment
              method to continue using premium features.
            </AlertDescription>
          </Alert>
        )}

        {isPastDue && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              Your payment failed. Please update your payment method to avoid
              service interruption.
            </AlertDescription>
          </Alert>
        )}

        {isCanceled && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              Your subscription has been canceled. Reactivate your subscription to continue using the service.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Plan
                <Badge
                  variant={
                    usage.plan === "PRO"
                      ? "default"
                      : usage.plan === "BASIC"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {usage.plan}
                </Badge>
              </CardTitle>
              <CardDescription>
                {isTrialing
                  ? "14-day free trial - Add payment method before trial ends"
                  : isCanceled
                  ? "Subscription canceled"
                  : "Active subscription"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {usage.currentPeriodEnd && !isCanceled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next billing date:</span>
                  <span className="font-semibold">
                    {new Date(usage.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {isCanceled ? (
                  <Button
                    className="w-full"
                    onClick={() => router.push("/pricing")}
                  >
                    Reactivate Subscription
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={openCustomerPortal}
                    disabled={portalLoading}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {portalLoading ? "Loading..." : "Manage Subscription"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Overview of your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={
                    usage.status === "ACTIVE"
                      ? "default"
                      : usage.status === "TRIALING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {usage.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Custom domains:</span>
                <span className="font-semibold">
                  {usage.domains.used} / {usage.domains.limit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remove branding:</span>
                <span className="font-semibold">Yes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage This Period
            </CardTitle>
            <CardDescription>
              Track your form submission usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Submissions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Form Submissions</span>
                <span className="text-gray-600">
                  {usage.submissions.used.toLocaleString()} /{" "}
                  {usage.submissions.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={usage.submissions.percentage} />
              {usage.submissions.percentage > 80 && (
                <p className="text-xs text-amber-600">
                  You've used {usage.submissions.percentage}% of your quota
                  {usage.submissions.percentage >= 100 && (
                    <span className="font-semibold">
                      {" "}
                      - Limit reached! Upgrade to accept more submissions.
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Domains */}
            {usage.domains.limit > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Custom Domains</span>
                  <span className="text-gray-600">
                    {usage.domains.used} / {usage.domains.limit}
                  </span>
                </div>
                <Progress value={usage.domains.percentage} />
              </div>
            )}

            {isCanceled && (
              <Alert>
                <AlertDescription>
                  Your subscription has been canceled. Reactivate to continue creating forms and accepting submissions.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
