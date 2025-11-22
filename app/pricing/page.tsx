"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const plans = [
  {
    name: "Basic",
    description: "For growing businesses",
    price: { monthly: 19, yearly: 199 },
    savings: "Save $29/year",
    features: [
      "1,000 submissions/month",
      "12,000 submissions/year",
      "1 custom domain",
      "Remove branding",
      "Advanced analytics",
      "14-day free trial",
    ],
    cta: "Start with Basic",
    plan: "BASIC",
    popular: true,
  },
  {
    name: "Pro",
    description: "For power users",
    price: { monthly: 47, yearly: 470 },
    savings: "Save $94/year",
    features: [
      "7,000 submissions/month",
      "84,000 submissions/year",
      "5 custom domains",
      "Remove branding",
      "Priority support",
      "Advanced analytics",
      "14-day free trial",
    ],
    cta: "Start with Pro",
    plan: "PRO",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (plan: string, billingCycle: "MONTHLY" | "YEARLY") => {
    setLoading(plan)

    try {
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error response
        alert(data.error || "Failed to create checkout session. Please try again later.")
        setLoading(null)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to create checkout session. Please contact support.")
        setLoading(null)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An unexpected error occurred. Please try again later.")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : ""}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : ""}>
              Yearly
              <span className="ml-2 text-sm text-green-600">Save up to 17%</span>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.popular
                  ? "border-2 border-black shadow-lg scale-105"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-600">
                      /{isYearly ? "year" : "month"}
                    </span>
                  )}
                </div>
                {isYearly && plan.savings && (
                  <p className="text-green-600 text-sm mt-2 font-semibold">
                    {plan.savings}
                  </p>
                )}
              </div>

              <Button
                className="w-full mb-8"
                variant={plan.popular ? "default" : "outline"}
                onClick={() =>
                  handleSubscribe(
                    plan.plan,
                    isYearly ? "YEARLY" : "MONTHLY"
                  )
                }
                disabled={loading === plan.plan}
              >
                {loading === plan.plan ? "Loading..." : plan.cta}
              </Button>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Trial Notice */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All paid plans include a <span className="font-semibold">14-day free trial</span>.
            <br />
            Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}
