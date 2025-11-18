"use client"

import { useState } from "react"
import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { ElementWithActions } from "./ElementWithActions"
import { AddElementMenu } from "./AddElementMenu"
import { ImageElement } from "@/types/form-elements"

export function EditorCanvas() {
  const { formElements, previewMode, formBackground, addElement, selectElement, selectedElement, selectedElementId } = useFormEditorContext()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [addMenuPosition, setAddMenuPosition] = useState<number | null>(null)

  const handleOpenAddMenu = (afterIndex: number) => {
    setAddMenuPosition(afterIndex)
    setShowAddMenu(true)
  }

  const handleCloseAddMenu = () => {
    setShowAddMenu(false)
    setAddMenuPosition(null)
  }

  // Find positioned image
  const positionedImage = formElements.find(
    el => el.elementType === "image" && (el as ImageElement).position !== "inline"
  ) as ImageElement | undefined
  const position = positionedImage?.position || "none"

  // Filter inline elements
  const inlineElements = formElements.filter(
    el => !(el.elementType === "image" && (el as ImageElement).position !== "inline")
  )

  return (
    <>
      <div className="flex flex-1 items-stretch justify-center bg-gray-50 overflow-y-auto">
        <div
          className={`${
            position === "background" || position === "none" ? "relative" : "flex"
          } w-full min-h-full my-8 transition-all duration-300 ${
            previewMode === "desktop" ? "max-w-6xl" : "max-w-md"
          } ${
            position === "top" ? "flex-col" :
            position === "bottom" ? "flex-col-reverse" :
            position === "right" ? (previewMode === "mobile" ? "flex-col" : "flex-row-reverse") :
            position === "left" ? (previewMode === "mobile" ? "flex-col" : "flex-row") :
            ""
          }`}
        >
          {/* Positioned Image */}
          {position === "background" && positionedImage ? (
            <div
              className={`absolute inset-0 cursor-pointer ${
                selectedElement === "image" && selectedElementId === positionedImage.id ? "ring-4 ring-blue-500 ring-inset" : ""
              }`}
              onClick={() => selectElement("image", positionedImage.id)}
            >
              <img
                src={positionedImage.url}
                alt={positionedImage.alt}
                className="h-full w-full object-cover"
                style={{ opacity: parseInt(positionedImage.opacity || "100") / 100 }}
              />
            </div>
          ) : position !== "none" && position !== "inline" && positionedImage ? (
            <div
              className={`relative cursor-pointer bg-[#C9B896] self-stretch ${
                selectedElement === "image" && selectedElementId === positionedImage.id ? "ring-4 ring-blue-500 ring-inset" : ""
              }`}
              style={{
                height: (position === "top" || position === "bottom") ? `${positionedImage.height}%` :
                        (position === "left" || position === "right") && previewMode === "mobile" ? `${positionedImage.width}%` : undefined,
                width: (position === "left" || position === "right") && previewMode === "desktop" ? `${positionedImage.width}%` : "100%",
              }}
              onClick={() => selectElement("image", positionedImage.id)}
            >
              <img
                src={positionedImage.url}
                alt={positionedImage.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {/* Form Section */}
          <div
            className={`flex items-center justify-center ${
              previewMode === "mobile" ? "px-8 py-12" : "px-16 py-20"
            } ${
              position === "background" ? "relative z-10 min-h-full w-full" :
              position === "none" ? "relative min-h-full w-full" :
              position !== "inline" && positionedImage ? "flex-1" :
              "relative min-h-full w-full"
            }`}
            style={{
              ...(formBackground.type === "color" ? {
                backgroundColor: formBackground.color,
              } : formBackground.type === "gradient" ? {
                background: `linear-gradient(${formBackground.gradientDirection}, ${formBackground.gradientFrom}, ${formBackground.gradientTo})`,
              } : formBackground.type === "image" && formBackground.imageUrl ? {
                backgroundImage: `url(${formBackground.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              } : {
                backgroundColor: formBackground.color,
              }),
            }}
          >
            <div className="w-full max-w-md space-y-6">
              {inlineElements.map((element, idx) => (
                <ElementWithActions
                  key={element.id}
                  element={element}
                  index={formElements.findIndex(el => el.id === element.id)}
                  totalElements={formElements.length}
                  onOpenAddMenu={handleOpenAddMenu}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddElementMenu
        open={showAddMenu}
        onClose={handleCloseAddMenu}
        onAddElement={(element) => {
          if (addMenuPosition !== null) {
            addElement(element, addMenuPosition)
          }
        }}
      />
    </>
  )
}
