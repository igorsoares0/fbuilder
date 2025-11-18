"use client"

import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { ColorPickerButton } from "@/components/color-picker-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlignLeft, AlignCenter, AlignRight, Upload, Trash2 } from "lucide-react"
import { TextElement, ButtonElement, FieldElement, ImageElement } from "@/types/form-elements"

export function PropertiesPanel() {
  const {
    formElements,
    selectedElement,
    selectedElementId,
    showFormSettings,
    updateElement,
    formBackground,
    setFormBackground,
    activeTab,
    setActiveTab,
  } = useFormEditorContext()

  const getCurrentElement = () => {
    return formElements.find((el) => el.id === selectedElementId)
  }

  const currentElement = getCurrentElement()

  return (
    <div className="w-80 border-l border-gray-200 bg-white p-6 pb-96 overflow-y-auto">
      {/* Form Settings Panel */}
      {showFormSettings && (
        <>
          <h2 className="mb-8 text-lg font-semibold">Form Background</h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Background Type</label>
              <Select
                value={formBackground.type}
                onValueChange={(value: "color" | "gradient" | "image") =>
                  setFormBackground({ ...formBackground, type: value })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formBackground.type === "color" && (
              <ColorPickerButton
                label="Background Color"
                color={formBackground.color}
                onChange={(color) => setFormBackground({ ...formBackground, color })}
              />
            )}

            {formBackground.type === "gradient" && (
              <>
                <ColorPickerButton
                  label="Gradient From"
                  color={formBackground.gradientFrom}
                  onChange={(color) => setFormBackground({ ...formBackground, gradientFrom: color })}
                />
                <ColorPickerButton
                  label="Gradient To"
                  color={formBackground.gradientTo}
                  onChange={(color) => setFormBackground({ ...formBackground, gradientTo: color })}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Direction</label>
                  <Select
                    value={formBackground.gradientDirection}
                    onValueChange={(value: any) => setFormBackground({ ...formBackground, gradientDirection: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to bottom">Top to Bottom</SelectItem>
                      <SelectItem value="to top">Bottom to Top</SelectItem>
                      <SelectItem value="to right">Left to Right</SelectItem>
                      <SelectItem value="to left">Right to Left</SelectItem>
                      <SelectItem value="to bottom right">Diagonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formBackground.type === "image" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image URL</label>
                  <Input
                    type="text"
                    value={formBackground.imageUrl}
                    onChange={(e) => setFormBackground({ ...formBackground, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Upload Image</label>
                  <label htmlFor="bg-image-upload" className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload background image</p>
                    </div>
                  </label>
                  <input
                    id="bg-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFormBackground({ ...formBackground, imageUrl: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Text Element Panel */}
      {selectedElement === "text" && currentElement?.elementType === "text" && (
        <>
          <h2 className="mb-8 text-lg font-semibold">Font</h2>
          <div className="space-y-6">
            <ColorPickerButton
              label="Font Color"
              color={(currentElement as TextElement).fontColor}
              onChange={(color) => updateElement(currentElement.id, { fontColor: color })}
            />
            {/* Add remaining text properties here - abbreviated for space */}
          </div>
        </>
      )}

      {/* Placeholder for other panels */}
      {selectedElement === "button" && <div>Button Properties - To implement</div>}
      {selectedElement === "field" && <div>Field Properties - To implement</div>}
      {selectedElement === "image" && <div>Image Properties - To implement</div>}
    </div>
  )
}
