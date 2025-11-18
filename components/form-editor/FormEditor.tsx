"use client"

import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { EditorHeader } from "./EditorHeader"
import { EditorCanvas } from "./EditorCanvas"
import { PropertiesPanel } from "./PropertiesPanel"

export function FormEditor() {
  const { isLoading } = useFormEditorContext()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <PropertiesPanel />
      </div>
    </div>
  )
}
