"use client"

import { useRouter } from "next/navigation"
import { useFormEditorContext } from "@/contexts/FormEditorContext"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Undo, Redo, Monitor, Smartphone } from "lucide-react"
import { formatRelativeTime } from "@/lib/form-utils"

export function EditorHeader() {
  const router = useRouter()
  const {
    formTitle,
    setFormTitle,
    previewMode,
    setPreviewMode,
    showFormSettings,
    setShowFormSettings,
    setSelectedElement,
    canUndo,
    canRedo,
    undo,
    redo,
    isSaving,
    lastSaved,
    saveForm,
  } = useFormEditorContext()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="text-sm font-bold tracking-wide bg-transparent border-none outline-none focus:ring-0 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
          placeholder="Form Title"
        />
      </div>

      <div className="flex items-center gap-8">
        <button className="text-sm font-medium text-gray-900">Design</button>
        <button className="text-sm font-medium text-gray-400">Thank you</button>
        <button
          onClick={() => {
            setShowFormSettings(true)
            setSelectedElement(null)
          }}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            showFormSettings ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Settings className="h-4 w-4" />
          Form Settings
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`rounded p-2 ${
            !canUndo ? "cursor-not-allowed opacity-30" : "hover:bg-gray-100"
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4 text-gray-400" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`rounded p-2 ${
            !canRedo ? "cursor-not-allowed opacity-30" : "hover:bg-gray-100"
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4 text-gray-400" />
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={() => setPreviewMode("desktop")}
          className={`rounded p-2 ${
            previewMode === "desktop" ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-100"
          }`}
          title="Desktop preview"
        >
          <Monitor className={`h-4 w-4 ${previewMode === "desktop" ? "text-blue-500" : "text-gray-400"}`} />
        </button>
        <button
          onClick={() => setPreviewMode("mobile")}
          className={`rounded p-2 ${
            previewMode === "mobile" ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-100"
          }`}
          title="Mobile preview"
        >
          <Smartphone className={`h-4 w-4 ${previewMode === "mobile" ? "text-blue-500" : "text-gray-400"}`} />
        </button>
        <Button
          onClick={saveForm}
          disabled={isSaving}
          className="bg-black px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : lastSaved ? `Saved ${formatRelativeTime(lastSaved)}` : "SAVE"}
        </Button>
      </div>
    </header>
  )
}
