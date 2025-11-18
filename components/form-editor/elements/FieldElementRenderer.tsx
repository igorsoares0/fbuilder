"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import { FieldElement } from "@/types/form-elements"

interface FieldElementRendererProps {
  element: FieldElement
  isSelected: boolean
  onClick: () => void
}

export function FieldElementRenderer({
  element,
  isSelected,
  onClick,
}: FieldElementRendererProps) {
  if (element.type === "rating") {
    return (
      <div
        className={`cursor-pointer ${
          isSelected ? "ring-4 ring-blue-500 ring-offset-2 rounded p-2" : ""
        }`}
        onClick={onClick}
      >
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
          {Array.from({ length: element.maxRating || 5 }).map((_, idx) => (
            <Star
              key={idx}
              className="cursor-pointer transition-all"
              size={32}
              fill="transparent"
              stroke={element.starColor || "#FFD700"}
              strokeWidth={2}
            />
          ))}
        </div>
      </div>
    )
  }

  if (element.type === "multiple-choice") {
    return (
      <div
        className={`cursor-pointer ${
          isSelected ? "ring-4 ring-blue-500 ring-offset-2 rounded p-2" : ""
        }`}
        onClick={onClick}
      >
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
          {(element.options || []).map((option, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type={element.multipleChoiceType || "radio"}
                name={`${element.id}-choice`}
                disabled
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
      </div>
    )
  }

  if (element.type === "checkbox") {
    return (
      <div
        className={`flex items-center gap-3 cursor-pointer ${
          isSelected ? "ring-4 ring-blue-500 ring-offset-2 rounded p-2" : ""
        }`}
        onClick={onClick}
      >
        <Checkbox
          id={element.id}
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
          </label>
        )}
      </div>
    )
  }

  if (element.type === "long-text") {
    return (
      <div className="w-full">
        {element.label && (
          <label
            className="mb-2 block text-sm font-medium"
            style={{
              fontFamily: element.fontFamily,
              color: element.fontColor,
            }}
          >
            {element.label}
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
        <Textarea
          placeholder={element.placeholder}
          required={element.required}
          rows={element.rows || 4}
          className={`field-input-${element.id} w-full cursor-pointer px-6 py-3 resize-none transition-all ${
            isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
          }`}
          style={{
            backgroundColor: element.fillColor,
            borderColor: element.borderColor,
            borderWidth: `${element.borderWidth}px`,
            borderStyle: "solid",
            borderRadius: `${element.borderRadius}px`,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            fontSize: `${element.fontSize}px`,
            lineHeight: element.lineHeight,
            letterSpacing: `${element.letterSpacing}px`,
            textAlign: element.textAlign,
          }}
          onClick={onClick}
        />
      </div>
    )
  }

  // Default: text or email field
  return (
    <div className="w-full">
      {element.label && (
        <label
          className="mb-2 block text-sm font-medium"
          style={{
            fontFamily: element.fontFamily,
            color: element.fontColor,
          }}
        >
          {element.label}
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
        required={element.required}
        className={`field-input-${element.id} w-full cursor-pointer px-6 transition-all ${
          isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
        }`}
        style={{
          backgroundColor: element.fillColor,
          borderColor: element.borderColor,
          borderWidth: `${element.borderWidth}px`,
          borderStyle: "solid",
          borderRadius: `${element.borderRadius}px`,
          height: `${element.height}px`,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          fontSize: `${element.fontSize}px`,
          lineHeight: element.lineHeight,
          letterSpacing: `${element.letterSpacing}px`,
          textAlign: element.textAlign,
        }}
        onClick={onClick}
      />
    </div>
  )
}
