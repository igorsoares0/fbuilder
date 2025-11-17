"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Target,
} from "lucide-react"
import { TimelineChart } from "@/components/analytics/timeline-chart"
import { ResponseDistribution } from "@/components/analytics/response-distribution"
import { CompletionRate } from "@/components/analytics/completion-rate"
import { ConversionFunnel } from "@/components/analytics/conversion-funnel"
import { CompletionTime } from "@/components/analytics/completion-time"

interface AnalyticsOverview {
  totalForms: number
  totalResponses: number
  totalViews: number
  avgCompletionRate: number
  periodComparison: {
    current: number
    previous: number
    growth: number
  }
}

interface Form {
  id: string
  title: string
  elements: any[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [forms, setForms] = useState<Form[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [selectedFormId, setSelectedFormId] = useState<string>("all")
  const [selectedFormData, setSelectedFormData] = useState<Form | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      loadForms()
    }
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      loadOverview()
    }
  }, [status, selectedPeriod, selectedFormId])

  useEffect(() => {
    if (selectedFormId !== "all") {
      const form = forms.find(f => f.id === selectedFormId)
      setSelectedFormData(form || null)
    } else {
      setSelectedFormData(null)
    }
  }, [selectedFormId, forms])

  const loadForms = async () => {
    try {
      const response = await fetch('/api/forms')
      if (!response.ok) throw new Error('Failed to fetch forms')
      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error('Error loading forms:', error)
    }
  }

  const loadOverview = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        period: selectedPeriod,
        formId: selectedFormId,
      })
      const response = await fetch(`/api/analytics/overview?${params}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setOverview(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold">Analytics</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Form Filter */}
              <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {forms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Period Filter */}
              <Select value={selectedPeriod} onValueChange={(val) => setSelectedPeriod(val as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Overview KPI Cards */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Overview</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Forms */}
              {isLoading ? (
                <Card className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ) : (
                <Card className="border-0 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Forms</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {overview?.totalForms || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Total Views */}
              {isLoading ? (
                <Card className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ) : (
                <Card className="border-0 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {overview?.totalViews.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3">
                      <Eye className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Total Responses */}
              {isLoading ? (
                <Card className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ) : (
                <Card className="border-0 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Responses</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {overview?.totalResponses.toLocaleString() || 0}
                      </p>
                      {overview && overview.periodComparison.growth !== 0 && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <TrendingUp
                            className={`h-4 w-4 ${
                              overview.periodComparison.growth > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          />
                          <span
                            className={
                              overview.periodComparison.growth > 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {overview.periodComparison.growth > 0 ? "+" : ""}
                            {overview.periodComparison.growth.toFixed(1)}%
                          </span>
                          <span className="text-gray-500">vs previous period</span>
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Avg Completion Rate */}
              {isLoading ? (
                <Card className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ) : (
                <Card className="border-0 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {overview?.avgCompletionRate.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-3">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Analytics Sections */}
          <div className="space-y-6">
            {/* Completion Rate - Analytics #5 */}
            {!isLoading && overview && (
              <CompletionRate
                totalViews={overview.totalViews}
                totalResponses={overview.totalResponses}
                avgCompletionRate={overview.avgCompletionRate}
              />
            )}

            {/* Timeline Chart - Analytics #2 */}
            <TimelineChart period={selectedPeriod} formId={selectedFormId} />

            {/* Conversion Funnel - Analytics #1 */}
            <ConversionFunnel formId={selectedFormId} />

            {/* Response Distribution - Analytics #4 */}
            <ResponseDistribution formId={selectedFormId} />

            {/* Completion Time - Analytics #3 */}
            <CompletionTime
              formId={selectedFormId}
              totalFields={selectedFormData?.elements?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
