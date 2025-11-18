"use client"

import { ImageElement } from "@/types/form-elements"

interface ImageElementRendererProps {
  element: ImageElement
  isSelected: boolean
  onClick: () => void
}

export function ImageElementRenderer({
  element,
  isSelected,
  onClick,
}: ImageElementRendererProps) {
  return (
    <div
      className={`cursor-pointer rounded overflow-hidden ${
        isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
      }`}
      onClick={onClick}
      style={{
        width: element.position === "inline" ? "100%" : `${element.width}%`,
      }}
    >
      <img
        src={element.url}
        alt={element.alt}
        className="w-full object-cover"
        style={{
          height: `${element.height}px`,
          borderRadius: `${element.borderRadius}px`,
          opacity: element.position === "background" ? parseInt(element.opacity || "100") / 100 : 1,
        }}
      />
    </div>
  )
}
