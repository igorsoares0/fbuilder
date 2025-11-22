"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import { SubscriptionGate } from "@/components/billing/SubscriptionGate"

interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  ipAddress: string | null
  userAgent: string | null
  submittedAt: string
}

interface FormData {
  id: string
  title: string
  elements: any[]
}

interface ResponsesData {
  form: FormData
  responses: FormResponse[]
  total: number
}

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [data, setData] = useState<ResponsesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResponses()
  }, [formId])

  const loadResponses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/forms/${formId}/responses`)

      if (!response.ok) {
        throw new Error('Failed to load responses')
      }

      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Error loading responses:', error)
      alert('Failed to load responses')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!data) return

    // Get all field IDs from form elements
    const fieldElements = data.form.elements.filter(el => el.elementType === 'field')
    const headers = ['Submitted At', 'IP Address', ...fieldElements.map(el => el.label || el.placeholder || el.id)]

    // Build CSV rows
    const rows = data.responses.map(response => {
      const row = [
        new Date(response.submittedAt).toLocaleString(),
        response.ipAddress || 'N/A',
        ...fieldElements.map(el => {
          const value = response.data[el.id]
          if (typeof value === 'boolean') return value ? 'Yes' : 'No'
          return value || ''
        })
      ]
      return row.map(cell => `"${cell}"`).join(',')
    })

    // Combine headers and rows
    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n')

    // Download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.form.title.toLowerCase().replace(/\s+/g, '-')}-responses.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">Failed to load responses</p>
        </div>
      </div>
    )
  }

  const fieldElements = data.form.elements.filter(el => el.elementType === 'field')

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{data.form.title}</h1>
                <p className="text-sm text-gray-500">{data.total} {data.total === 1 ? 'response' : 'responses'}</p>
              </div>
            </div>

            {data.total > 0 && (
              <Button
                onClick={exportToCSV}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {data.total === 0 ? (
          <Card className="border-0 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No responses yet</h3>
            <p className="text-sm text-gray-600">
              Responses will appear here once people start submitting your form.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.responses.map((response, index) => (
              <Card key={response.id} className="border-0 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Response #{data.total - index}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(response.submittedAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  {response.ipAddress && (
                    <p className="text-xs text-gray-500">IP: {response.ipAddress}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {fieldElements.map((field) => {
                    const value = response.data[field.id]
                    const label = field.label || field.placeholder || field.id

                    return (
                      <div key={field.id}>
                        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                        <p className="text-sm text-gray-900 bg-gray-50 rounded px-3 py-2">
                          {field.type === 'checkbox'
                            ? value ? '✓ Yes' : '✗ No'
                            : value || '(empty)'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </SubscriptionGate>
  )
}
