"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: "submissions" | "domains" | "branding"
}

const plans = [
  {
    name: "Basic",
    price: "$19/mo",
    yearlyPrice: "$199/yr",
    plan: "BASIC",
    features: [
      "1,000 submissions/month",
      "1 custom domain",
      "Remove branding",
      "Advanced analytics",
    ],
  },
  {
    name: "Pro",
    price: "$47/mo",
    yearlyPrice: "$470/yr",
    plan: "PRO",
    popular: true,
    features: [
      "7,000 submissions/month",
      "5 custom domains",
      "Remove branding",
      "Priority support",
      "Advanced analytics",
    ],
  },
]

export function UpgradeModal({ open, onOpenChange, reason }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const getMessage = () => {
    switch (reason) {
      case "submissions":
        return "You've reached your submission limit. Upgrade to accept more responses."
      case "domains":
        return "Upgrade to add custom domains to your forms."
      case "branding":
        return "Upgrade to remove branding from your forms."
      default:
        return "Unlock more features with a paid plan."
    }
  }

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    try {
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle: "MONTHLY" }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(null)
      }
    } catch (error) {
      console.error("Error:", error)
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-yellow-500" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription className="text-base">
            {getMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border rounded-lg p-6 ${
                plan.popular ? "border-black border-2" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500">or {plan.yearlyPrice}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.plan)}
                disabled={loading === plan.plan}
              >
                {loading === plan.plan ? "Loading..." : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
          <Button
            variant="link"
            className="text-xs"
            onClick={() => router.push("/pricing")}
          >
            View all pricing options
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
