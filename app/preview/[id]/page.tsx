"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface FormElement {
  id: string
  elementType: "text" | "button" | "field" | "image"
  [key: string]: any
}

interface FormData {
  id: string
  title: string
  description: string | null
  status: string
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

export default function PreviewFormPage() {
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadForm()
  }, [id])

  const loadForm = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/forms/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          alert('Form not found')
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">Form not found</p>
          <p className="mt-2 text-sm text-gray-600">The form you're looking for doesn't exist.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-yellow-800 text-center">
            <span className="font-semibold">Preview Mode</span> - This is how your form will look to visitors
            {form.status !== 'PUBLISHED' && (
              <span className="ml-2 text-yellow-700">
                (Form is currently in {form.status.toLowerCase()} status)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Form Preview */}
      <div
        className="flex min-h-[calc(100vh-60px)] items-center justify-center p-6"
        style={getBackgroundStyle()}
      >
        <div className="w-full max-w-md">
          <div className="space-y-6">
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
                        <input
                          type="checkbox"
                          id={element.id}
                          disabled
                          className="cursor-not-allowed"
                          style={{
                            borderColor: element.borderColor,
                            borderWidth: `${element.borderWidth}px`,
                          }}
                        />
                        {element.label && (
                          <label
                            htmlFor={element.id}
                            className="text-sm font-medium"
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
                        <input
                          type={element.type}
                          placeholder={element.placeholder}
                          disabled
                          className="w-full px-6 cursor-not-allowed"
                          style={{
                            backgroundColor: element.fillColor,
                            borderColor: element.borderColor,
                            borderWidth: `${element.borderWidth}px`,
                            borderStyle: 'solid',
                            borderRadius: `${element.borderRadius}px`,
                            height: `${element.height}px`,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            fontSize: `${element.fontSize}px`,
                            color: element.fontColor,
                            lineHeight: element.lineHeight,
                            letterSpacing: `${element.letterSpacing}px`,
                            textAlign: element.textAlign,
                          }}
                        />
                      </>
                    )}
                  </div>
                )}

                {element.elementType === 'button' && (
                  <button
                    disabled
                    className="transition-all cursor-not-allowed"
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
                      opacity: 0.8,
                    }}
                  >
                    {element.label}
                  </button>
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
          </div>
        </div>
      </div>
    </div>
  )
}
