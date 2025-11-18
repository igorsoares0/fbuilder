"use client"

import { TextElement } from "@/types/form-elements"
import { ColorPickerButton } from "@/components/color-picker-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface TextPropertiesPanelProps {
  element: TextElement
  onUpdate: (updates: Partial<TextElement>) => void
}

export function TextPropertiesPanel({ element, onUpdate }: TextPropertiesPanelProps) {
  return (
    <>
      <h2 className="mb-8 text-lg font-semibold">Font</h2>

      <div className="space-y-6">
        <ColorPickerButton
          label="Font Color"
          color={element.fontColor}
          onChange={(color) => onUpdate({ fontColor: color })}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
          <div className="flex gap-2">
            <Select value={element.fontFamily} onValueChange={(value) => onUpdate({ fontFamily: value })}>
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
            <Select value={element.fontWeight} onValueChange={(value) => onUpdate({ fontWeight: value })}>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
          <Select value={element.fontSize} onValueChange={(value) => onUpdate({ fontSize: value })}>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
          <div className="flex gap-2">
            <button
              className={`flex h-10 flex-1 items-center justify-center rounded border ${
                element.textAlign === "left" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onUpdate({ textAlign: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              className={`flex h-10 flex-1 items-center justify-center rounded border ${
                element.textAlign === "center" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onUpdate({ textAlign: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              className={`flex h-10 flex-1 items-center justify-center rounded border ${
                element.textAlign === "right" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onUpdate({ textAlign: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-gray-600">Line height</label>
              <Select value={element.lineHeight} onValueChange={(value) => onUpdate({ lineHeight: value })}>
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
              <Select value={element.letterSpacing} onValueChange={(value) => onUpdate({ letterSpacing: value })}>
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
  )
}
