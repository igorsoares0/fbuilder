"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Type, MousePointer, Image as ImageIcon } from "lucide-react"
import { FormElement } from "@/types/form-elements"

interface AddElementMenuProps {
  open: boolean
  onClose: () => void
  onAddElement: (element: FormElement) => void
}

export function AddElementMenu({ open, onClose, onAddElement }: AddElementMenuProps) {
  const handleAddElement = (type: "text" | "button" | "field" | "image") => {
    const newId = `${type}-${Date.now()}`
    let newElement: FormElement

    if (type === "text") {
      newElement = {
        id: newId,
        elementType: "text",
        content: "New text element",
        fontFamily: "Arial",
        fontWeight: "400",
        fontSize: "16",
        fontColor: "#000000",
        lineHeight: "1.5",
        letterSpacing: "0",
        textAlign: "left",
      }
    } else if (type === "button") {
      newElement = {
        id: newId,
        elementType: "button",
        label: "CLICK ME",
        fillColor: "#000000",
        borderColor: "transparent",
        borderWidth: "0",
        borderRadius: "8",
        height: "48",
        width: "100",
        fontFamily: "Arial",
        fontWeight: "500",
        fontSize: "14",
        fontColor: "#FFFFFF",
        lineHeight: "1",
        letterSpacing: "0",
        textAlign: "center",
      }
    } else if (type === "image") {
      newElement = {
        id: newId,
        elementType: "image",
        url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop",
        alt: "Placeholder image",
        width: "100",
        height: "200",
        borderRadius: "8",
        position: "inline",
        opacity: "100",
      }
    } else {
      newElement = {
        id: newId,
        elementType: "field",
        type: "text",
        placeholder: "NEW FIELD",
        label: "NEW FIELD",
        required: false,
        fillColor: "transparent",
        borderColor: "#1F2937",
        borderWidth: "2",
        borderRadius: "8",
        height: "48",
        fontFamily: "Arial",
        fontWeight: "400",
        fontSize: "14",
        fontColor: "#1F2937",
        lineHeight: "1",
        letterSpacing: "0",
        textAlign: "left",
      }
    }

    onAddElement(newElement)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Element</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <button
            onClick={() => handleAddElement("text")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Type className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Text</div>
              <div className="text-sm text-gray-500">Add a text element</div>
            </div>
          </button>
          <button
            onClick={() => handleAddElement("button")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <MousePointer className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Button</div>
              <div className="text-sm text-gray-500">Add a button element</div>
            </div>
          </button>
          <button
            onClick={() => handleAddElement("field")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Type className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">Field</div>
              <div className="text-sm text-gray-500">Add an input field</div>
            </div>
          </button>
          <button
            onClick={() => handleAddElement("image")}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <ImageIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="font-medium">Image</div>
              <div className="text-sm text-gray-500">Add an image element</div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
