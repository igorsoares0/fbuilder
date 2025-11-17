"use client"

import { Card } from "@/components/ui/card"
import { Clock, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CompletionTimeProps {
  formId: string
  totalFields: number
}

export function CompletionTime({ formId, totalFields }: CompletionTimeProps) {
  // Since we don't have actual timing data yet, we'll show estimated times
  // based on field count and industry averages (~30 seconds per field)

  const estimatedTimePerField = 30 // seconds
  const estimatedTotalTime = totalFields * estimatedTimePerField

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  // Estimate time ranges based on complexity
  const fastTime = Math.floor(estimatedTotalTime * 0.6)
  const avgTime = estimatedTotalTime
  const slowTime = Math.floor(estimatedTotalTime * 1.5)

  if (formId === "all") {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Average Completion Time</h3>
          <p className="text-sm text-gray-600">Form completion duration analysis</p>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>Please select a specific form to view completion time</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Average Completion Time</h3>
        <p className="text-sm text-gray-600">Estimated form completion duration</p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Estimated Times</p>
            <p className="mt-1 text-blue-700">
              Real-time tracking is not yet implemented. These are estimated times based on field
              count (~30s per field). Enable event tracking for accurate data.
            </p>
          </div>
        </div>
      </div>

      {/* Time Estimates */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {/* Fast Completion */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">Fast</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-700">{formatTime(fastTime)}</p>
          <p className="mt-1 text-xs text-green-600">Power users</p>
        </div>

        {/* Average Completion */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">Average</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-700">{formatTime(avgTime)}</p>
          <p className="mt-1 text-xs text-blue-600">Most users</p>
        </div>

        {/* Slow Completion */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <p className="text-sm font-medium text-orange-900">Slow</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-orange-700">{formatTime(slowTime)}</p>
          <p className="mt-1 text-xs text-orange-600">Careful readers</p>
        </div>
      </div>

      {/* Field Count Info */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Total Fields</p>
            <p className="mt-1 text-xs text-gray-600">
              Based on {totalFields} field{totalFields !== 1 ? "s" : ""} in this form
            </p>
          </div>
          <Badge variant="secondary" className="text-lg">
            {totalFields}
          </Badge>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Optimization Tips</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {estimatedTotalTime > 300 && (
            <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3">
              <Info className="h-4 w-4 flex-shrink-0 text-orange-600" />
              <p>
                Your form takes ~{formatTime(avgTime)} to complete. Consider breaking it into
                multiple pages or reducing required fields.
              </p>
            </div>
          )}
          {estimatedTotalTime > 180 && estimatedTotalTime <= 300 && (
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
              <Info className="h-4 w-4 flex-shrink-0 text-blue-600" />
              <p>
                Your form length is moderate (~{formatTime(avgTime)}). This is acceptable for most
                use cases.
              </p>
            </div>
          )}
          {estimatedTotalTime <= 180 && (
            <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3">
              <Info className="h-4 w-4 flex-shrink-0 text-green-600" />
              <p>
                Great! Your form is quick to complete (~{formatTime(avgTime)}). This should
                encourage high completion rates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Future Feature Note */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-600">
          <span className="font-medium text-gray-900">Coming Soon:</span> Real-time field-by-field
          timing, heatmaps showing where users spend the most time, and per-device completion time
          analysis.
        </p>
      </div>
    </Card>
  )
}
