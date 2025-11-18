"use client"

import { Button } from "@/components/ui/button"
import { ButtonElement } from "@/types/form-elements"

interface ButtonElementRendererProps {
  element: ButtonElement
  isSelected: boolean
  isEditing: boolean
  onClick: () => void
  onLabelChange: (label: string) => void
  onFinishEditing: () => void
}

export function ButtonElementRenderer({
  element,
  isSelected,
  isEditing,
  onClick,
  onLabelChange,
  onFinishEditing,
}: ButtonElementRendererProps) {
  return (
    <Button
      className={`transition-all relative ${
        isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
      }`}
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
      onClick={onClick}
    >
      {isEditing ? (
        <input
          autoFocus
          value={element.label}
          onChange={(e) => onLabelChange(e.target.value)}
          onBlur={onFinishEditing}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onFinishEditing()
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full border-none bg-transparent text-center outline-none"
          style={{
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            fontSize: `${element.fontSize}px`,
            color: element.fontColor,
            lineHeight: element.lineHeight,
            letterSpacing: `${element.letterSpacing}px`,
            textAlign: element.textAlign,
          }}
        />
      ) : (
        element.label
      )}
    </Button>
  )
}
