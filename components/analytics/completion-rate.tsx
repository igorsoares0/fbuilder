"use client"

import { Card } from "@/components/ui/card"
import { Target, TrendingUp, AlertTriangle } from "lucide-react"

interface CompletionRateProps {
  totalViews: number
  totalResponses: number
  avgCompletionRate: number
}

export function CompletionRate({
  totalViews,
  totalResponses,
  avgCompletionRate,
}: CompletionRateProps) {
  // Calculate the stroke offset for the circular progress
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (avgCompletionRate / 100) * circumference

  // Determine color based on completion rate
  const getColor = () => {
    if (avgCompletionRate >= 70) return { ring: "#10b981", bg: "#d1fae5", text: "text-green-600" }
    if (avgCompletionRate >= 50) return { ring: "#f59e0b", bg: "#fef3c7", text: "text-orange-600" }
    return { ring: "#ef4444", bg: "#fee2e2", text: "text-red-600" }
  }

  const color = getColor()
  const abandonmentRate = 100 - avgCompletionRate

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
        <p className="text-sm text-gray-600">Overall form completion performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={color.ring}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.5s ease",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-bold ${color.text}`}>
                {avgCompletionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">completion</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{totalResponses.toLocaleString()}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalViews.toLocaleString()}</span> completed
            </p>
          </div>
        </div>

        {/* Stats and Insights */}
        <div className="space-y-4">
          {/* Total Completions */}
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Total Completions</p>
                <p className="mt-1 text-2xl font-semibold text-green-700">
                  {totalResponses.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* Abandonments */}
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Abandonments</p>
                <p className="mt-1 text-2xl font-semibold text-red-700">
                  {(totalViews - totalResponses).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-red-600">{abandonmentRate.toFixed(1)}% drop-off</p>
              </div>
              <div className="rounded-lg bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {avgCompletionRate >= 70 && (
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Excellent completion rate! Your forms are performing well.</span>
                </li>
              )}
              {avgCompletionRate >= 50 && avgCompletionRate < 70 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-orange-600" />
                  <span>Good completion rate, but there's room for improvement.</span>
                </li>
              )}
              {avgCompletionRate < 50 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
                  <span>
                    Consider simplifying your forms or reducing the number of required fields.
                  </span>
                </li>
              )}
              {abandonmentRate > 50 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-orange-600" />
                  <span>High abandonment detected. Check the conversion funnel for problem areas.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}
