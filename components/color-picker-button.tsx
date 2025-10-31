"use client"

import { ColorPicker } from "@/components/color-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerButtonProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPickerButton({ color, onChange, label }: ColorPickerButtonProps) {
  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-gray-900">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors">
            <div
              className="h-6 w-6 shrink-0 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 text-left text-sm font-mono uppercase">
              {color}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <ColorPicker color={color} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
