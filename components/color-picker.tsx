"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [selectedBaseColor, setSelectedBaseColor] = useState("#3B82F6") // Cor base selecionada da paleta
  const [lightness, setLightness] = useState(50) // Intensidade/claridade (0-100)
  const [selectedColor, setSelectedColor] = useState(color)
  const [hexValue, setHexValue] = useState(color)
  const [isDraggingLightness, setIsDraggingLightness] = useState(false)

  const lightnessRef = useRef<HTMLDivElement>(null)

  // Color palette - 7 rows x 5 columns = 35 colors
  const colorPalette = [
    // Row 1
    "#1E3A8A", "#EA580C", "#A3B577", "#D1D5DB", "#374151",
    // Row 2
    "#000000", "#5F9EA0", "#C84B8A", "#D4C5B9", "#FBBF87",
    // Row 3
    "#9F7E7E", "#E9D5FF", "#F5E6D3", "#FF69B4", "#B8C5D6",
    // Row 4
    "#FEF08A", "#A5F3FC", "#93C5FD", "#F0B27A", "#FB923C",
    // Row 5
    "#A1AED4", "#EAB308", "#78350F", "#D84B8A", "#6B8CAE",
    // Row 6
    "#7DD3FC", "#FB7185", "#B8860B", "#B8D4C8", "#16A34A",
    // Row 7
    "#D7ABA2", "#5F9EA0", "#991B1B", "#E8A87C", "#FDE047",
  ]

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join("").toUpperCase()
  }

  // Apply lightness to base color
  const applyLightness = (baseColor: string, lightnessValue: number) => {
    const rgb = hexToRgb(baseColor)

    // lightnessValue: 0 = branco, 50 = cor original, 100 = preto (invertido)
    let r, g, b

    if (lightnessValue < 50) {
      // Clarear (interpolar com branco)
      const factor = lightnessValue / 50
      r = 255 - (255 - rgb.r) * factor
      g = 255 - (255 - rgb.g) * factor
      b = 255 - (255 - rgb.b) * factor
    } else {
      // Escurecer (interpolar com preto)
      const factor = (lightnessValue - 50) / 50
      r = rgb.r * (1 - factor)
      g = rgb.g * (1 - factor)
      b = rgb.b * (1 - factor)
    }

    return rgbToHex(r, g, b)
  }

  // Initialize from prop color
  useEffect(() => {
    if (color && color !== selectedColor) {
      setSelectedColor(color)
      setHexValue(color)
    }
  }, [color])

  // Handle lightness slider
  const handleLightnessMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingLightness(true)
    updateLightness(e)
  }

  const updateLightness = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lightnessRef.current) return

    const rect = lightnessRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const newLightness = (x / rect.width) * 100

    setLightness(newLightness)
    const newColor = applyLightness(selectedBaseColor, newLightness)
    setSelectedColor(newColor)
    setHexValue(newColor)
    onChange(newColor)
  }

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLightness) {
        updateLightness(e as any)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLightness(false)
    }

    if (isDraggingLightness) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDraggingLightness, selectedBaseColor])

  // Handle hex input
  const handleHexChange = (value: string) => {
    setHexValue(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setSelectedColor(value)
      onChange(value)
    }
  }

  // Handle color selection from palette
  const handleColorSelect = (color: string) => {
    setSelectedBaseColor(color)
    setLightness(50) // Reset lightness to middle (cor original)
    setSelectedColor(color)
    setHexValue(color)
    onChange(color)
  }

  return (
    <div className="w-full space-y-4 p-1">
      {/* Color Palette Grid */}
      <div className="grid grid-cols-5 gap-2 justify-items-center">
        {colorPalette.map((paletteColor, index) => (
          <button
            key={index}
            className="h-6 w-6 rounded-full transition-all hover:scale-125 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            style={{ backgroundColor: paletteColor }}
            onClick={() => handleColorSelect(paletteColor)}
            title={paletteColor}
          />
        ))}
      </div>

      {/* Lightness Slider */}
      <div
        ref={lightnessRef}
        className="relative h-6 w-full cursor-pointer rounded-full"
        style={{
          background: `linear-gradient(to right, #FFFFFF 0%, ${selectedBaseColor} 50%, #000000 100%)`,
        }}
        onMouseDown={handleLightnessMouseDown}
      >
        {/* Lightness Slider Thumb */}
        <div
          className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-white shadow-lg"
          style={{
            left: `${lightness}%`,
            backgroundColor: selectedColor,
          }}
        />
      </div>

      {/* Hex Input with Preview */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div
          className="h-10 w-10 shrink-0 rounded-full border border-gray-300"
          style={{ backgroundColor: selectedColor }}
        />
        <Input
          type="text"
          value={hexValue}
          onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
          className="flex-1 border-0 bg-transparent font-mono text-base font-medium uppercase focus-visible:ring-0"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  )
}
