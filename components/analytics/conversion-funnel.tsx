"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, TrendingDown, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FunnelStep {
  fieldId: string
  fieldLabel: string
  fieldType: string
  position: number
  reached: number
  completed: number
  completionRate: number
  dropoffRate: number
}

interface FunnelData {
  formId: string
  formTitle: string
  totalViews: number
  totalResponses: number
  conversionRate: number
  steps: FunnelStep[]
}

interface ConversionFunnelProps {
  formId: string
}

export function ConversionFunnel({ formId }: ConversionFunnelProps) {
  const [data, setData] = useState<FunnelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (formId && formId !== "all") {
      loadData()
    }
  }, [formId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ formId })
      const response = await fetch(`/api/analytics/conversion-funnel?${params}`)
      if (!response.ok) throw new Error("Failed to fetch funnel data")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error loading conversion funnel:", error)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (formId === "all") {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="text-sm text-gray-600">Field-by-field completion analysis</p>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>Please select a specific form to view conversion funnel</p>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="text-sm text-gray-600">Field-by-field completion analysis</p>
        </div>
        <Skeleton className="h-96 w-full" />
      </Card>
    )
  }

  if (!data || data.steps.length === 0) {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="text-sm text-gray-600">Field-by-field completion analysis</p>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>No data available for this form</p>
        </div>
      </Card>
    )
  }

  // Find fields with highest dropoff
  const problemFields = data.steps
    .filter(step => step.dropoffRate > 20)
    .sort((a, b) => b.dropoffRate - a.dropoffRate)
    .slice(0, 5)

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
        <p className="text-sm text-gray-600">Field-by-field completion analysis</p>
      </div>

      {/* Overall Conversion */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Overall Conversion Rate</p>
            <p className="mt-1 text-sm text-blue-700">
              {data.totalResponses.toLocaleString()} submissions from {data.totalViews.toLocaleString()} views
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-700">{data.conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="mb-6 space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Field Completion</h4>
        {data.steps.map((step, idx) => {
          const maxWidth = data.totalResponses > 0
            ? (step.completed / data.totalResponses) * 100
            : 0

          return (
            <div key={step.fieldId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {step.position}. {step.fieldLabel}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {step.fieldType}
                  </Badge>
                  {step.dropoffRate > 20 && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      High dropoff
                    </Badge>
                  )}
                </div>
                <div className="text-gray-600">
                  {step.completed} / {step.reached} ({step.completionRate.toFixed(1)}%)
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-8 overflow-hidden rounded-lg bg-gray-100">
                <div
                  className={`h-full transition-all ${
                    step.dropoffRate > 30
                      ? "bg-red-500"
                      : step.dropoffRate > 20
                        ? "bg-orange-500"
                        : step.dropoffRate > 10
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${maxWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {step.completed} completed
                  </span>
                </div>
              </div>

              {step.dropoffRate > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingDown className="h-3 w-3" />
                  {step.dropoffRate.toFixed(1)}% dropoff at this field
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Problem Fields */}
      {problemFields.length > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h4 className="text-sm font-medium text-orange-900">Fields Needing Attention</h4>
          </div>
          <div className="space-y-2">
            {problemFields.map((field, idx) => (
              <div key={field.fieldId} className="flex items-center justify-between text-sm">
                <span className="text-orange-900">
                  {idx + 1}. {field.fieldLabel}
                </span>
                <Badge variant="destructive">{field.dropoffRate.toFixed(1)}% dropoff</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-orange-700">
            Consider making these fields optional, simplifying them, or adding helpful hints.
          </p>
        </div>
      )}

      {problemFields.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-900">
              Great! All fields have good completion rates ({"<"}20% dropoff).
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
