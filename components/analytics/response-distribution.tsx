"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, PieChart as PieChartIcon, Star } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface Field {
  id: string
  label: string
  type: string
}

interface ResponseDistributionProps {
  formId: string
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#f97316", "#14b8a6"]

export function ResponseDistribution({ formId }: ResponseDistributionProps) {
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState<string>("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (formId && formId !== "all") {
      loadFields()
    }
  }, [formId])

  useEffect(() => {
    if (selectedField && formId !== "all") {
      loadAnalysis()
    }
  }, [selectedField, formId])

  const loadFields = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ formId })
      const response = await fetch(`/api/analytics/response-distribution?${params}`)
      if (!response.ok) throw new Error("Failed to fetch fields")
      const data = await response.json()
      setFields(data.fields || [])
      if (data.fields && data.fields.length > 0) {
        setSelectedField(data.fields[0].id)
      }
    } catch (error) {
      console.error("Error loading fields:", error)
      setFields([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadAnalysis = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ formId, fieldId: selectedField })
      const response = await fetch(`/api/analytics/response-distribution?${params}`)
      if (!response.ok) throw new Error("Failed to fetch analysis")
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Error loading analysis:", error)
      setAnalysis(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (formId === "all") {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Response Distribution</h3>
          <p className="text-sm text-gray-600">Analyze field responses</p>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>Please select a specific form to view response distribution</p>
        </div>
      </Card>
    )
  }

  if (isLoading && fields.length === 0) {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Response Distribution</h3>
          <p className="text-sm text-gray-600">Analyze field responses</p>
        </div>
        <Skeleton className="h-64 w-full" />
      </Card>
    )
  }

  if (fields.length === 0) {
    return (
      <Card className="border-0 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Response Distribution</h3>
          <p className="text-sm text-gray-600">Analyze field responses</p>
        </div>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>No fields found in this form</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Response Distribution</h3>
          <p className="text-sm text-gray-600">Analyze field responses</p>
        </div>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label} ({field.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : analysis ? (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-sm text-gray-600">Total Responses</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.totalResponses}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Answered</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.answeredCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Skip Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.skipRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Visualization based on field type */}
          {analysis.fieldType === "multipleChoice" && analysis.distribution && (
            <div>
              <h4 className="mb-4 text-sm font-medium text-gray-700">Choice Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysis.distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="option" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analysis.fieldType === "rating" && analysis.ratingDistribution && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Rating Distribution</h4>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{analysis.avgRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">average</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysis.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="rating"
                    stroke="#9ca3af"
                    fontSize={12}
                    label={{ value: "Rating", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {(analysis.fieldType === "text" || analysis.fieldType === "shortText") &&
            analysis.topAnswers && (
              <div>
                <h4 className="mb-4 text-sm font-medium text-gray-700">
                  Top 10 Responses ({analysis.uniqueAnswers} unique)
                </h4>
                <div className="space-y-2">
                  {analysis.topAnswers.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 text-sm text-gray-500">#{idx + 1}</div>
                      <div className="flex-1 rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-900">{item.text}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-700">{item.count}x</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {analysis.fieldType === "longText" && analysis.wordCloud && (
            <div>
              <h4 className="mb-4 text-sm font-medium text-gray-700">
                Top 30 Words (from {analysis.uniqueAnswers} responses)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.wordCloud.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-full bg-blue-50 px-3 py-1"
                    style={{
                      fontSize: `${Math.min(12 + item.frequency * 2, 24)}px`,
                    }}
                  >
                    <span className="font-medium text-blue-700">{item.word}</span>
                    <span className="ml-1 text-xs text-blue-500">({item.frequency})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.fieldType === "email" && (
            <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
              <div className="text-center">
                <p className="text-3xl font-semibold text-gray-900">{analysis.uniqueEmails}</p>
                <p className="mt-1 text-sm text-gray-600">unique email addresses</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>No data available</p>
        </div>
      )}
    </Card>
  )
}
