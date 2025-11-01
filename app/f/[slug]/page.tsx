"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface FormElement {
  id: string
  elementType: "text" | "button" | "field" | "image"
  [key: string]: any
}

interface FormData {
  id: string
  title: string
  description: string | null
  elements: FormElement[]
  background: {
    type: "color" | "gradient" | "image"
    color?: string
    gradientFrom?: string
    gradientTo?: string
    gradientDirection?: string
    imageUrl?: string
  }
}

export default function PublicFormPage() {
  const params = useParams()
  const slug = params.slug as string

  const [form, setForm] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadForm()
  }, [slug])

  const loadForm = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/forms/slug/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          alert('Form not found')
        } else if (response.status === 403) {
          alert('This form is not published')
        } else {
          alert('Failed to load form')
        }
        return
      }

      const data = await response.json()
      setForm(data)
    } catch (error) {
      console.error('Error loading form:', error)
      alert('Failed to load form')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    // Validate required fields
    const newErrors: Record<string, string> = {}
    const fieldElements = form.elements.filter(el => el.elementType === 'field')

    fieldElements.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.id,
          data: formData,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">Form not found</p>
          <p className="mt-2 text-sm text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md text-center">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
          <p className="mt-2 text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  // Get background style
  const getBackgroundStyle = () => {
    if (form.background.type === 'color') {
      return { backgroundColor: form.background.color }
    } else if (form.background.type === 'gradient') {
      return {
        background: `linear-gradient(${form.background.gradientDirection}, ${form.background.gradientFrom}, ${form.background.gradientTo})`,
      }
    } else if (form.background.type === 'image' && form.background.imageUrl) {
      return {
        backgroundImage: `url(${form.background.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return { backgroundColor: '#EDE8E3' }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={getBackgroundStyle()}
    >
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.elements.map((element) => (
            <div key={element.id}>
              {element.elementType === 'text' && (
                <div>
                  <p
                    style={{
                      fontFamily: element.fontFamily,
                      fontWeight: element.fontWeight,
                      fontSize: `${element.fontSize}px`,
                      color: element.fontColor,
                      lineHeight: element.lineHeight,
                      letterSpacing: `${element.letterSpacing}px`,
                      textAlign: element.textAlign,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {element.content}
                  </p>
                </div>
              )}

              {element.elementType === 'field' && (
                <div>
                  {element.type === 'checkbox' ? (
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={element.id}
                        checked={formData[element.id] || false}
                        onCheckedChange={(checked) => handleFieldChange(element.id, checked)}
                        style={{
                          borderColor: element.borderColor,
                          borderWidth: `${element.borderWidth}px`,
                        }}
                      />
                      {element.label && (
                        <label
                          htmlFor={element.id}
                          className="text-sm font-medium cursor-pointer"
                          style={{
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            fontSize: `${element.fontSize}px`,
                            color: element.fontColor,
                          }}
                        >
                          {element.label}
                          {element.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      )}
                    </div>
                  ) : (
                    <>
                      {element.label && (
                        <label
                          className="mb-2 block text-sm font-medium"
                          style={{
                            fontFamily: element.fontFamily,
                            color: element.fontColor,
                          }}
                        >
                          {element.label}
                          {element.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      )}
                      <style dangerouslySetInnerHTML={{__html: `
                        .field-input-${element.id} {
                          color: ${element.fontColor} !important;
                        }
                        .field-input-${element.id}::placeholder {
                          color: ${element.fontColor} !important;
                          opacity: 0.5;
                        }
                      `}} />
                      <Input
                        type={element.type}
                        placeholder={element.placeholder}
                        value={formData[element.id] || ''}
                        onChange={(e) => handleFieldChange(element.id, e.target.value)}
                        required={element.required}
                        className={`field-input-${element.id} w-full px-6`}
                        style={{
                          backgroundColor: element.fillColor,
                          borderColor: errors[element.id] ? '#ef4444' : element.borderColor,
                          borderWidth: `${element.borderWidth}px`,
                          borderStyle: 'solid',
                          borderRadius: `${element.borderRadius}px`,
                          height: `${element.height}px`,
                          fontFamily: element.fontFamily,
                          fontWeight: element.fontWeight,
                          fontSize: `${element.fontSize}px`,
                          lineHeight: element.lineHeight,
                          letterSpacing: `${element.letterSpacing}px`,
                          textAlign: element.textAlign,
                        }}
                      />
                      {errors[element.id] && (
                        <p className="mt-1 text-sm text-red-500">{errors[element.id]}</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {element.elementType === 'button' && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="transition-all"
                  style={{
                    backgroundColor: element.fillColor,
                    borderColor: element.borderColor,
                    borderWidth: `${element.borderWidth}px`,
                    borderStyle: element.borderWidth !== "0" ? "solid" : "none",
                    borderRadius: `${element.borderRadius}px`,
                    height: `${element.height}px`,
                    width: `${element.width}%`,
                    fontFamily: element.fontFamily,
                    fontWeight: element.fontWeight,
                    fontSize: `${element.fontSize}px`,
                    color: element.fontColor,
                    lineHeight: element.lineHeight,
                    letterSpacing: `${element.letterSpacing}px`,
                    textAlign: element.textAlign,
                  }}
                >
                  {isSubmitting ? 'Submitting...' : element.label}
                </Button>
              )}

              {element.elementType === 'image' && (
                <div
                  className="overflow-hidden"
                  style={{
                    width: element.position === 'inline' ? '100%' : `${element.width}%`,
                  }}
                >
                  <img
                    src={element.url}
                    alt={element.alt}
                    className="w-full object-cover"
                    style={{
                      height: `${element.height}px`,
                      borderRadius: `${element.borderRadius}px`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}
