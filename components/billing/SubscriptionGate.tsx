"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CreditCard, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SubscriptionGateProps {
  children: React.ReactNode
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const response = await fetch("/api/billing/check-access")
      if (response.ok) {
        const data = await response.json()
        setHasAccess(data.hasAccess)
      } else {
        setHasAccess(false)
      }
    } catch (error) {
      console.error("Error checking access:", error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Checking subscription...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-3xl">Subscription Required</CardTitle>
            <CardDescription className="text-base mt-2">
              Your free trial has ended or your subscription is inactive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                To continue using FormBuilder, please choose a plan and add your payment information.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Basic Plan */}
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-bold">Basic</h3>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    1,000 submissions/month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    1 custom domain
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    No branding
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                >
                  Choose Basic
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-black rounded-lg p-6 relative bg-gradient-to-b from-gray-50 to-white">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-xl font-bold">Pro</h3>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$47</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    7,000 submissions/month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    5 custom domains
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Priority support
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => router.push("/pricing")}
                >
                  Choose Pro
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push("/billing")}
                className="text-sm"
              >
                View billing details →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
