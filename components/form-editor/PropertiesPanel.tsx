"use client"

import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { ColorPickerButton } from "@/components/color-picker-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlignLeft, AlignCenter, AlignRight, Upload, Trash2 } from "lucide-react"
import { TextElement, ButtonElement, FieldElement, ImageElement } from "@/types/form-elements"

export function PropertiesPanel() {
  const ctx = useFormEditorContext()
  const currentElement = ctx.formElements.find((el) => el.id === ctx.selectedElementId)

  return (
    <div className="w-80 border-l border-gray-200 bg-white p-6 pb-96 overflow-y-auto">
      {/* Form Settings Panel */}
      {ctx.showFormSettings && (
        <>
          <h2 className="mb-8 text-lg font-semibold">Form Background</h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Background Type</label>
              <Select
                value={ctx.formBackground.type}
                onValueChange={(value: "color" | "gradient" | "image") =>
                  ctx.setFormBackground({ ...ctx.formBackground, type: value })
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

            {ctx.formBackground.type === "color" && (
              <ColorPickerButton
                label="Background Color"
                color={ctx.formBackground.color}
                onChange={(color) => ctx.setFormBackground({ ...ctx.formBackground, color })}
              />
            )}

            {ctx.formBackground.type === "gradient" && (
              <>
                <ColorPickerButton
                  label="Gradient From"
                  color={ctx.formBackground.gradientFrom}
                  onChange={(color) => ctx.setFormBackground({ ...ctx.formBackground, gradientFrom: color })}
                />
                <ColorPickerButton
                  label="Gradient To"
                  color={ctx.formBackground.gradientTo}
                  onChange={(color) => ctx.setFormBackground({ ...ctx.formBackground, gradientTo: color })}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Direction</label>
                  <Select
                    value={ctx.formBackground.gradientDirection}
                    onValueChange={(value: any) =>
                      ctx.setFormBackground({ ...ctx.formBackground, gradientDirection: value })
                    }
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

            {ctx.formBackground.type === "image" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image URL</label>
                  <Input
                    type="text"
                    value={ctx.formBackground.imageUrl}
                    onChange={(e) => ctx.setFormBackground({ ...ctx.formBackground, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Upload Image</label>
                  <label
                    htmlFor="bg-image-upload"
                    className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
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
                          ctx.setFormBackground({ ...ctx.formBackground, imageUrl: reader.result as string })
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
      {ctx.selectedElement === "text" && currentElement?.elementType === "text" && (
        <>
          <h2 className="mb-8 text-lg font-semibold">Font</h2>
          <div className="space-y-6">
            {/* Font Color */}
            <ColorPickerButton
              label="Font Color"
              color={(currentElement as TextElement).fontColor}
              onChange={(color) => ctx.updateElement(currentElement.id, { fontColor: color })}
            />

            {/* Font Family and Weight */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
              <div className="flex gap-2">
                <Select
                  value={(currentElement as TextElement).fontFamily}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { fontFamily: value })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Manrope">Manrope</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    <SelectItem value="Merriweather">Merriweather</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Bebas Neue">Bebas Neue</SelectItem>
                    <SelectItem value="Abril Fatface">Abril Fatface</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={(currentElement as TextElement).fontWeight}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { fontWeight: value })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="400">Regular</SelectItem>
                    <SelectItem value="600">Semi Bold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
              <Select
                value={(currentElement as TextElement).fontSize}
                onValueChange={(value) => ctx.updateElement(currentElement.id, { fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                  <SelectItem value="72">72</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alignment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
              <div className="flex gap-2">
                <button
                  className={`flex h-10 flex-1 items-center justify-center rounded border ${
                    (currentElement as TextElement).textAlign === "left"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => ctx.updateElement(currentElement.id, { textAlign: "left" })}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  className={`flex h-10 flex-1 items-center justify-center rounded border ${
                    (currentElement as TextElement).textAlign === "center"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => ctx.updateElement(currentElement.id, { textAlign: "center" })}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  className={`flex h-10 flex-1 items-center justify-center rounded border ${
                    (currentElement as TextElement).textAlign === "right"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => ctx.updateElement(currentElement.id, { textAlign: "right" })}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-600">Line height</label>
                  <Select
                    value={(currentElement as TextElement).lineHeight}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { lineHeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.2">1.2</SelectItem>
                      <SelectItem value="1.33">1.33</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="1.75">1.75</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                  <Select
                    value={(currentElement as TextElement).letterSpacing}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { letterSpacing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">-1</SelectItem>
                      <SelectItem value="-0.5">-0.5</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="0.5">0.5</SelectItem>
                      <SelectItem value="0.7">0.7</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Button Element Panel */}
      {ctx.selectedElement === "button" && currentElement?.elementType === "button" && (
        <>
          <div className="mb-6 flex gap-4 border-b border-gray-200">
            <button
              className={`pb-3 text-sm font-medium ${
                ctx.activeTab === "style" ? "border-b-2 border-black text-black" : "text-gray-400"
              }`}
              onClick={() => ctx.setActiveTab("style")}
            >
              Style
            </button>
            <button
              className={`pb-3 text-sm font-medium ${
                ctx.activeTab === "font" ? "border-b-2 border-black text-black" : "text-gray-400"
              }`}
              onClick={() => ctx.setActiveTab("font")}
            >
              Font
            </button>
          </div>

          {ctx.activeTab === "style" && (
            <div className="space-y-6">
              {/* Fill Color */}
              <ColorPickerButton
                label="Fill color"
                color={(currentElement as ButtonElement).fillColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { fillColor: color })}
              />

              {/* Border Color */}
              <ColorPickerButton
                label="Border color"
                color={(currentElement as ButtonElement).borderColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { borderColor: color })}
              />

              {/* Border Width */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Border width</label>
                <Select
                  value={(currentElement as ButtonElement).borderWidth}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { borderWidth: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
                <Select
                  value={(currentElement as ButtonElement).borderRadius}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { borderRadius: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="999">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button Sizing */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Button sizing</label>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Height (px)</label>
                    <Select
                      value={(currentElement as ButtonElement).height}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { height: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="32">32</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                        <SelectItem value="56">56</SelectItem>
                        <SelectItem value="64">64</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Width (%)</label>
                    <Select
                      value={(currentElement as ButtonElement).width}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { width: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="60">60%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {ctx.activeTab === "font" && (
            <div className="space-y-6">
              {/* Font Family and Weight */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                <div className="flex gap-2">
                  <Select
                    value={(currentElement as ButtonElement).fontFamily}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { fontFamily: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Manrope">Manrope</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                      <SelectItem value="Bebas Neue">Bebas Neue</SelectItem>
                      <SelectItem value="Abril Fatface">Abril Fatface</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={(currentElement as ButtonElement).fontWeight}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { fontWeight: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
                <Select
                  value={(currentElement as ButtonElement).fontSize}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Color */}
              <ColorPickerButton
                label="Font Color"
                color={(currentElement as ButtonElement).fontColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { fontColor: color })}
              />

              {/* Alignment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
                <div className="flex gap-2">
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as ButtonElement).textAlign === "left"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "left" })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as ButtonElement).textAlign === "center"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "center" })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as ButtonElement).textAlign === "right"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "right" })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Line height</label>
                    <Select
                      value={(currentElement as ButtonElement).lineHeight}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { lineHeight: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.2">1.2</SelectItem>
                        <SelectItem value="1.33">1.33</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="1.75">1.75</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                    <Select
                      value={(currentElement as ButtonElement).letterSpacing}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { letterSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1">-1</SelectItem>
                        <SelectItem value="-0.5">-0.5</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Field Element Panel */}
      {ctx.selectedElement === "field" && currentElement?.elementType === "field" && (
        <>
          <div className="mb-6 flex gap-4 border-b border-gray-200">
            <button
              className={`pb-3 text-sm font-medium ${
                ctx.activeTab === "fields" ? "border-b-2 border-black text-black" : "text-gray-400"
              }`}
              onClick={() => ctx.setActiveTab("fields")}
            >
              Fields
            </button>
            <button
              className={`pb-3 text-sm font-medium ${
                ctx.activeTab === "style" ? "border-b-2 border-black text-black" : "text-gray-400"
              }`}
              onClick={() => ctx.setActiveTab("style")}
            >
              Style
            </button>
            <button
              className={`pb-3 text-sm font-medium ${
                ctx.activeTab === "font" ? "border-b-2 border-black text-black" : "text-gray-400"
              }`}
              onClick={() => ctx.setActiveTab("font")}
            >
              Font
            </button>
          </div>

          {ctx.activeTab === "fields" && (
            <div className="space-y-6">
              {/* Field Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Field type</label>
                <Select
                  value={(currentElement as FieldElement).type}
                  onValueChange={(value: "text" | "email" | "checkbox" | "multiple-choice" | "rating" | "long-text") => {
                    if (value === "multiple-choice") {
                      ctx.updateElement(currentElement.id, {
                        type: value,
                        multipleChoiceType: "radio",
                        options: ["Option 1", "Option 2", "Option 3"]
                      })
                    } else if (value === "rating") {
                      ctx.updateElement(currentElement.id, {
                        type: value,
                        maxRating: 5,
                        starColor: "#FFD700"
                      })
                    } else if (value === "long-text") {
                      ctx.updateElement(currentElement.id, {
                        type: value,
                        rows: 4,
                        height: "120"
                      })
                    } else {
                      ctx.updateElement(currentElement.id, { type: value })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="long-text">Long Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="rating">Rating (Stars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Label</label>
                <Input
                  value={(currentElement as FieldElement).label}
                  onChange={(e) => ctx.updateElement(currentElement.id, { label: e.target.value })}
                  placeholder="Field label"
                  className="text-sm"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Placeholder</label>
                <Input
                  value={(currentElement as FieldElement).placeholder}
                  onChange={(e) => ctx.updateElement(currentElement.id, { placeholder: e.target.value })}
                  placeholder="Field placeholder"
                  className="text-sm"
                />
              </div>

              {/* Required */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="required"
                  checked={(currentElement as FieldElement).required}
                  onCheckedChange={(checked) => ctx.updateElement(currentElement.id, { required: checked as boolean })}
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  Required field
                </label>
              </div>

              {/* Multiple Choice Options */}
              {(currentElement as FieldElement).type === "multiple-choice" && (
                <>
                  {/* Choice Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Choice type</label>
                    <Select
                      value={(currentElement as FieldElement).multipleChoiceType || "radio"}
                      onValueChange={(value: "radio" | "checkbox") => ctx.updateElement(currentElement.id, { multipleChoiceType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="radio">Single Choice (Radio)</SelectItem>
                        <SelectItem value="checkbox">Multiple Choice (Checkbox)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Options</label>
                    <div className="space-y-2">
                      {((currentElement as FieldElement).options || []).map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...((currentElement as FieldElement).options || [])]
                              newOptions[index] = e.target.value
                              ctx.updateElement(currentElement.id, { options: newOptions })
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="text-sm flex-1"
                          />
                          <button
                            onClick={() => {
                              const newOptions = [...((currentElement as FieldElement).options || [])]
                              newOptions.splice(index, 1)
                              ctx.updateElement(currentElement.id, { options: newOptions })
                            }}
                            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newOptions = [...((currentElement as FieldElement).options || []), `Option ${((currentElement as FieldElement).options || []).length + 1}`]
                          ctx.updateElement(currentElement.id, { options: newOptions })
                        }}
                        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Rating Options */}
              {(currentElement as FieldElement).type === "rating" && (
                <>
                  {/* Max Rating */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Number of stars</label>
                    <Select
                      value={String((currentElement as FieldElement).maxRating || 5)}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { maxRating: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="10">10 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Star Color */}
                  <ColorPickerButton
                    label="Star color"
                    color={(currentElement as FieldElement).starColor || "#FFD700"}
                    onChange={(color) => ctx.updateElement(currentElement.id, { starColor: color })}
                  />
                </>
              )}

              {/* Long Text Options */}
              {(currentElement as FieldElement).type === "long-text" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Number of rows</label>
                  <Select
                    value={String((currentElement as FieldElement).rows || 4)}
                    onValueChange={(value) => {
                      const rows = parseInt(value)
                      ctx.updateElement(currentElement.id, {
                        rows: rows,
                        height: String(rows * 30)
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 rows</SelectItem>
                      <SelectItem value="4">4 rows</SelectItem>
                      <SelectItem value="5">5 rows</SelectItem>
                      <SelectItem value="6">6 rows</SelectItem>
                      <SelectItem value="8">8 rows</SelectItem>
                      <SelectItem value="10">10 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {ctx.activeTab === "style" && (
            <div className="space-y-6">
              {/* Fill Color */}
              <ColorPickerButton
                label="Fill color"
                color={(currentElement as FieldElement).fillColor === "transparent" ? "#ffffff" : (currentElement as FieldElement).fillColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { fillColor: color })}
              />

              {/* Border Color */}
              <ColorPickerButton
                label="Border color"
                color={(currentElement as FieldElement).borderColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { borderColor: color })}
              />

              {/* Border Width */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Border width</label>
                <Select
                  value={(currentElement as FieldElement).borderWidth}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { borderWidth: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
                <Select
                  value={(currentElement as FieldElement).borderRadius}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { borderRadius: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="999">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field Height */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Height (px)</label>
                <Select
                  value={(currentElement as FieldElement).height}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { height: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32">32</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="56">56</SelectItem>
                    <SelectItem value="64">64</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {ctx.activeTab === "font" && (
            <div className="space-y-6">
              {/* Font Color */}
              <ColorPickerButton
                label="Font Color"
                color={(currentElement as FieldElement).fontColor}
                onChange={(color) => ctx.updateElement(currentElement.id, { fontColor: color })}
              />

              {/* Font Family and Weight */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                <div className="flex gap-2">
                  <Select
                    value={(currentElement as FieldElement).fontFamily}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { fontFamily: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Manrope">Manrope</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                      <SelectItem value="Bebas Neue">Bebas Neue</SelectItem>
                      <SelectItem value="Abril Fatface">Abril Fatface</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={(currentElement as FieldElement).fontWeight}
                    onValueChange={(value) => ctx.updateElement(currentElement.id, { fontWeight: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
                <Select
                  value={(currentElement as FieldElement).fontSize}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alignment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
                <div className="flex gap-2">
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as FieldElement).textAlign === "left"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "left" })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as FieldElement).textAlign === "center"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "center" })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    className={`flex h-10 flex-1 items-center justify-center rounded border ${
                      (currentElement as FieldElement).textAlign === "right"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => ctx.updateElement(currentElement.id, { textAlign: "right" })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Line height</label>
                    <Select
                      value={(currentElement as FieldElement).lineHeight}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { lineHeight: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.2">1.2</SelectItem>
                        <SelectItem value="1.33">1.33</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="1.75">1.75</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                    <Select
                      value={(currentElement as FieldElement).letterSpacing}
                      onValueChange={(value) => ctx.updateElement(currentElement.id, { letterSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1">-1</SelectItem>
                        <SelectItem value="-0.5">-0.5</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* Image Element Panel */}
      {ctx.selectedElement === "image" && currentElement?.elementType === "image" && (
        <>
          <h2 className="mb-8 text-lg font-semibold">Image</h2>
          <div className="space-y-6">
            {/* Upload Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Add image from...</label>
              <label
                htmlFor="image-upload"
                className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                <div className="text-center">
                  <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload image</p>
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      ctx.updateElement(currentElement.id, { url: reader.result as string })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Image URL</label>
              <Input
                type="text"
                value={(currentElement as ImageElement).url}
                onChange={(e) => ctx.updateElement(currentElement.id, { url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="text-sm"
              />
            </div>

            {/* Alt Text */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Alt text</label>
              <Input
                type="text"
                value={(currentElement as ImageElement).alt}
                onChange={(e) => ctx.updateElement(currentElement.id, { alt: e.target.value })}
                placeholder="Description of image"
                className="text-sm"
              />
            </div>

            {/* Image Height - Only for inline position */}
            {((currentElement as ImageElement).position === "inline" || (currentElement as ImageElement).position === "none") && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Height (px)</label>
                <Select
                  value={(currentElement as ImageElement).height}
                  onValueChange={(value) => ctx.updateElement(currentElement.id, { height: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="150">150</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Border Radius */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
              <Select
                value={(currentElement as ImageElement).borderRadius}
                onValueChange={(value) => ctx.updateElement(currentElement.id, { borderRadius: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="999">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Position */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Image position</label>
              <Select
                value={(currentElement as ImageElement).position}
                onValueChange={(value: "left" | "right" | "top" | "bottom" | "background" | "none" | "inline") =>
                  ctx.updateElement(currentElement.id, { position: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                  <SelectItem value="none">No Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Sizing - Only show for non-inline positions */}
            {(currentElement as ImageElement).position !== "inline" && (currentElement as ImageElement).position !== "none" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  {(currentElement as ImageElement).position === "background" ? "Opacity" : "Image sizing"}
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      {(currentElement as ImageElement).position === "background"
                        ? "Opacity (%)"
                        : (currentElement as ImageElement).position === "top" || (currentElement as ImageElement).position === "bottom"
                        ? "Height (%)"
                        : "Width (%)"}
                    </label>
                    <Select
                      value={
                        (currentElement as ImageElement).position === "background"
                          ? (currentElement as ImageElement).opacity || "100"
                          : (currentElement as ImageElement).position === "top" || (currentElement as ImageElement).position === "bottom"
                          ? (currentElement as ImageElement).height || "50"
                          : (currentElement as ImageElement).width || "100"
                      }
                      onValueChange={(value) => {
                        if ((currentElement as ImageElement).position === "background") {
                          ctx.updateElement(currentElement.id, { opacity: value })
                        } else if ((currentElement as ImageElement).position === "top" || (currentElement as ImageElement).position === "bottom") {
                          ctx.updateElement(currentElement.id, { height: value })
                        } else {
                          ctx.updateElement(currentElement.id, { width: value })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="60">60%</SelectItem>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
