"use client"

import { FormElement } from "@/types/form-elements"
import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { TextElementRenderer } from "./elements/TextElementRenderer"
import { ButtonElementRenderer } from "./elements/ButtonElementRenderer"
import { FieldElementRenderer } from "./elements/FieldElementRenderer"
import { ImageElementRenderer } from "./elements/ImageElementRenderer"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"

interface ElementWithActionsProps {
  element: FormElement
  index: number
  totalElements: number
  onOpenAddMenu: (index: number) => void
}

export function ElementWithActions({ element, index, totalElements, onOpenAddMenu }: ElementWithActionsProps) {
  const {
    selectedElement,
    selectedElementId,
    editingElementId,
    selectElement,
    updateElement,
    deleteElement,
    moveElementUp,
    moveElementDown,
    setEditingElementId,
  } = useFormEditorContext()

  const isSelected = selectedElementId === element.id
  const isEditing = editingElementId === element.id

  return (
    <div className="group relative">
      {/* Render element based on type */}
      {element.elementType === "text" && (
        <TextElementRenderer
          element={element}
          isSelected={isSelected && selectedElement === "text"}
          isEditing={isEditing}
          onClick={() => selectElement("text", element.id)}
          onContentChange={(content) => updateElement(element.id, { content })}
          onFinishEditing={() => setEditingElementId(null)}
        />
      )}

      {element.elementType === "button" && (
        <ButtonElementRenderer
          element={element}
          isSelected={isSelected && selectedElement === "button"}
          isEditing={isEditing}
          onClick={() => selectElement("button", element.id)}
          onLabelChange={(label) => updateElement(element.id, { label })}
          onFinishEditing={() => setEditingElementId(null)}
        />
      )}

      {element.elementType === "field" && (
        <FieldElementRenderer
          element={element}
          isSelected={isSelected && selectedElement === "field"}
          onClick={() => selectElement("field", element.id)}
        />
      )}

      {element.elementType === "image" && element.position === "inline" && (
        <ImageElementRenderer
          element={element}
          isSelected={isSelected && selectedElement === "image"}
          onClick={() => selectElement("image", element.id)}
        />
      )}

      {/* Action buttons */}
      <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
        <button
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
          onClick={() => onOpenAddMenu(index)}
          title="Add element"
        >
          <Plus className="h-3 w-3 text-gray-600" />
        </button>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-full border border-red-300 bg-white hover:bg-red-50 shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            deleteElement(element.id)
          }}
          title="Delete element"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </button>
      </div>

      {/* Move buttons */}
      <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
        <button
          className={`flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white shadow-sm ${
            index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            moveElementUp(index)
          }}
          disabled={index === 0}
          title="Move up"
        >
          <ChevronUp className="h-4 w-4 text-gray-600" />
        </button>
        <button
          className={`flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white shadow-sm ${
            index === totalElements - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            moveElementDown(index)
          }}
          disabled={index === totalElements - 1}
          title="Move down"
        >
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
