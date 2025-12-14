"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { BrandingBadge } from "@/components/billing/BrandingBadge"

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
  userId: string
  showBranding?: boolean
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

  // Find positioned image (any image with position !== "inline")
  const positionedImage = form.elements.find(el => el.elementType === "image" && el.position !== "inline")
  const position = positionedImage?.position || "none"

  return (
    <div className={position === "left" || position === "right" || position === "top" || position === "bottom" ? "min-h-screen md:h-screen overflow-auto" : "min-h-screen overflow-auto"}>
      {(() => {
        // Filter elements: remove positioned image from regular flow
        const inlineElements = form.elements.filter(el => !(el.elementType === "image" && el.position !== "inline"))

        // Compute background style
        const backgroundStyle = form.background.type === "color" ? {
          backgroundColor: form.background.color,
        } : form.background.type === "gradient" ? {
          background: `linear-gradient(${form.background.gradientDirection}, ${form.background.gradientFrom}, ${form.background.gradientTo})`,
        } : form.background.type === "image" && form.background.imageUrl ? {
          backgroundImage: `url(${form.background.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        } : {
          backgroundColor: form.background.color,
        }

        return (
          <div
            className={`${
              position === "background" || position === "none" ? "relative min-h-screen" : "flex min-h-full"
            } w-full ${
              position === "top"
                ? "flex-col"
                : position === "bottom"
                ? "flex-col-reverse"
                : position === "right"
                ? "flex-col md:flex-row-reverse"
                : position === "left"
                ? "flex-col md:flex-row"
                : position === "background" || position === "none"
                ? ""
                : "flex-row"
            }`}
            style={backgroundStyle}
          >
            {/* Positioned Image Section */}
            {position === "background" && positionedImage ? (
              <div className="absolute inset-0">
                <img
                  src={positionedImage.url}
                  alt={positionedImage.alt}
                  className="h-full w-full object-cover"
                  style={{ opacity: parseInt(positionedImage.opacity || "100") / 100 }}
                />
              </div>
            ) : position !== "none" && position !== "inline" && positionedImage ? (
              <>
                <style dangerouslySetInnerHTML={{__html: `
                  .positioned-image-container-${positionedImage.id} {
                    height: ${position === "top" || position === "bottom" ? `${positionedImage.height}%` : position === "left" || position === "right" ? "40vh" : "auto"};
                    width: 100%;
                    flex-shrink: 0;
                  }
                  @media (min-width: 768px) {
                    .positioned-image-container-${positionedImage.id} {
                      height: ${position === "top" || position === "bottom" ? `${positionedImage.height}%` : position === "left" || position === "right" ? "100%" : "auto"};
                      width: ${position === "left" || position === "right" ? `${positionedImage.width}%` : "100%"};
                    }
                  }
                `}} />
                <div
                  className={`relative positioned-image-container-${positionedImage.id} bg-[#C9B896]`}
                >
                  <img
                    src={positionedImage.url}
                    alt={positionedImage.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
            ) : null}

            {/* Form Section */}
            {(position === "left" || position === "right") && positionedImage && (
              <style dangerouslySetInnerHTML={{__html: `
                @media (min-width: 768px) {
                  .form-section-${positionedImage.id} {
                    width: ${100 - parseInt(positionedImage.width || "50")}% !important;
                  }
                }
              `}} />
            )}
            <div
              className={`flex items-center justify-center px-8 py-12 flex-1 ${
                (position === "left" || position === "right") && positionedImage ? `form-section-${positionedImage.id} md:self-stretch` : ""
              }`}
              style={{
                width: '100%',
                ...(position === "background" ? { position: 'relative', zIndex: 10 } : {}),
              }}
            >
              <div className="w-full space-y-6 py-8" style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {inlineElements.map((element) => (
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
                          {element.type === 'rating' ? (
                            <div>
                              {element.label && (
                                <label
                                  className="mb-3 block text-sm font-medium"
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
                              <div className="flex gap-2">
                                {Array.from({ length: element.maxRating || 5 }).map((_, idx) => {
                                  const rating = idx + 1
                                  const currentRating = formData[element.id] || 0
                                  return (
                                    <svg
                                      key={idx}
                                      className="cursor-pointer transition-all hover:scale-110"
                                      width="32"
                                      height="32"
                                      viewBox="0 0 24 24"
                                      fill={rating <= currentRating ? element.starColor || '#FFD700' : 'transparent'}
                                      stroke={element.starColor || '#FFD700'}
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      onClick={() => handleFieldChange(element.id, rating)}
                                      onMouseEnter={(e) => {
                                        const stars = e.currentTarget.parentElement?.querySelectorAll('svg')
                                        stars?.forEach((star, i) => {
                                          if (i < rating) {
                                            star.setAttribute('fill', element.starColor || '#FFD700')
                                          }
                                        })
                                      }}
                                      onMouseLeave={(e) => {
                                        const stars = e.currentTarget.parentElement?.querySelectorAll('svg')
                                        stars?.forEach((star, i) => {
                                          if (i + 1 <= currentRating) {
                                            star.setAttribute('fill', element.starColor || '#FFD700')
                                          } else {
                                            star.setAttribute('fill', 'transparent')
                                          }
                                        })
                                      }}
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                  )
                                })}
                              </div>
                              {errors[element.id] && (
                                <p className="mt-1 text-sm text-red-500">{errors[element.id]}</p>
                              )}
                            </div>
                          ) : element.type === 'multiple-choice' ? (
                            <div>
                              {element.label && (
                                <label
                                  className="mb-3 block text-sm font-medium"
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
                              <div className="space-y-2">
                                {(element.options || []).map((option: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <input
                                      type={element.multipleChoiceType || 'radio'}
                                      name={`${element.id}-choice`}
                                      value={option}
                                      checked={
                                        element.multipleChoiceType === 'checkbox'
                                          ? Array.isArray(formData[element.id]) && formData[element.id].includes(option)
                                          : formData[element.id] === option
                                      }
                                      onChange={(e) => {
                                        if (element.multipleChoiceType === 'checkbox') {
                                          const current = Array.isArray(formData[element.id]) ? formData[element.id] : []
                                          if (e.target.checked) {
                                            handleFieldChange(element.id, [...current, option])
                                          } else {
                                            handleFieldChange(element.id, current.filter((v: string) => v !== option))
                                          }
                                        } else {
                                          handleFieldChange(element.id, option)
                                        }
                                      }}
                                      required={element.required && !formData[element.id]}
                                      className="cursor-pointer"
                                      style={{
                                        accentColor: element.fontColor,
                                      }}
                                    />
                                    <label
                                      className="text-sm cursor-pointer"
                                      style={{
                                        fontFamily: element.fontFamily,
                                        fontWeight: element.fontWeight,
                                        fontSize: `${element.fontSize}px`,
                                        color: element.fontColor,
                                      }}
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              {errors[element.id] && (
                                <p className="mt-1 text-sm text-red-500">{errors[element.id]}</p>
                              )}
                            </div>
                          ) : element.type === 'checkbox' ? (
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
                          ) : element.type === 'long-text' ? (
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
                              <textarea
                                placeholder={element.placeholder}
                                value={formData[element.id] || ''}
                                onChange={(e) => handleFieldChange(element.id, e.target.value)}
                                required={element.required}
                                rows={element.rows || 4}
                                className={`field-input-${element.id} w-full px-6 py-3 resize-none`}
                                style={{
                                  backgroundColor: element.fillColor,
                                  borderColor: errors[element.id] ? '#ef4444' : element.borderColor,
                                  borderWidth: `${element.borderWidth}px`,
                                  borderStyle: 'solid',
                                  borderRadius: `${element.borderRadius}px`,
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
                          className="transition-all hover:opacity-90"
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

                      {element.elementType === 'image' && element.position === 'inline' && (
                        <div
                          className="overflow-hidden"
                          style={{
                            width: '100%',
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
          </div>
        )
      })()}

      {/* Branding Badge */}
      <BrandingBadge showBranding={form.showBranding ?? true} />
    </div>
  )
}
