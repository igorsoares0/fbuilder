"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

interface TimelineData {
  date: string
  responses: number
}

interface TimelineChartProps {
  period: "7d" | "30d" | "90d" | "all"
  formId: string
}

export function TimelineChart({ period, formId }: TimelineChartProps) {
  const [data, setData] = useState<TimelineData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [period, formId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ period, formId })
      const response = await fetch(`/api/analytics/timeline?${params}`)
      if (!response.ok) throw new Error("Failed to fetch timeline data")
      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error("Error loading timeline:", error)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Responses Over Time</h3>
          <p className="text-sm text-gray-600">Track submission trends</p>
        </div>
        <Skeleton className="h-80 w-full" />
      </Card>
    )
  }

  const totalResponses = data.reduce((sum, d) => sum + d.responses, 0)
  const avgPerDay = data.length > 0 ? totalResponses / data.length : 0

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Responses Over Time</h3>
          <p className="text-sm text-gray-600">Track submission trends</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>
              {totalResponses} total responses
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            ~{avgPerDay.toFixed(1)} per day
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-gray-400">
          <p>No data available for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                if (period === "7d") {
                  return format(date, "EEE") // Mon, Tue, etc
                }
                return format(date, "MMM d") // Jan 1, etc
              }}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelFormatter={(value) => {
                const date = new Date(value)
                return format(date, "MMM d, yyyy")
              }}
              formatter={(value: any) => [value, "Responses"]}
            />
            <Line
              type="monotone"
              dataKey="responses"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
