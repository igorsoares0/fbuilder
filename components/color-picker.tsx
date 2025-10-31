"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hue, setHue] = useState(240)
  const [selectedColor, setSelectedColor] = useState(color)
  const [hexValue, setHexValue] = useState(color)
  const [isDraggingHue, setIsDraggingHue] = useState(false)

  const hueRef = useRef<HTMLDivElement>(null)

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

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }

  // Generate color from hue
  const getColorFromHue = (h: number) => {
    return hslToHex(h, 70, 65)
  }

  // Initialize from prop color
  useEffect(() => {
    if (color && color !== selectedColor) {
      setSelectedColor(color)
      setHexValue(color)
    }
  }, [color])

  // Handle hue slider
  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingHue(true)
    updateHue(e)
  }

  const updateHue = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return

    const rect = hueRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const newHue = (x / rect.width) * 360

    setHue(newHue)
    const newColor = getColorFromHue(newHue)
    setSelectedColor(newColor)
    setHexValue(newColor)
    onChange(newColor)
  }

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHue) {
        updateHue(e as any)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingHue(false)
    }

    if (isDraggingHue) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDraggingHue])

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
    setSelectedColor(color)
    setHexValue(color)
    onChange(color)
  }

  return (
    <div className="w-full space-y-4 p-1">
      {/* Color Palette Grid */}
      <div className="grid grid-cols-5 gap-2">
        {colorPalette.map((paletteColor, index) => (
          <button
            key={index}
            className="h-10 w-full rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ backgroundColor: paletteColor }}
            onClick={() => handleColorSelect(paletteColor)}
            title={paletteColor}
          />
        ))}
      </div>

      {/* Hue Slider */}
      <div
        ref={hueRef}
        className="relative h-6 w-full cursor-pointer rounded-full"
        style={{
          background:
            "linear-gradient(to right, #1E3A8A 0%, #7C3AED 16.67%, #EC4899 33.33%, #EF4444 50%, #F59E0B 66.67%, #10B981 83.33%, #1E3A8A 100%)",
        }}
        onMouseDown={handleHueMouseDown}
      >
        {/* Hue Slider Thumb */}
        <div
          className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-white shadow-lg"
          style={{
            left: `${(hue / 360) * 100}%`,
            backgroundColor: getColorFromHue(hue),
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
