"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FormEditorProvider } from "@/components/form-editor/FormEditorProvider"
import { FormEditor } from "@/components/form-editor/FormEditor"

function FormBuilderContent() {
  const searchParams = useSearchParams()
  const template = searchParams.get("template") || "default"
  const formId = searchParams.get("id")

  return (
    <FormEditorProvider formId={formId} template={template}>
      <FormEditor />
    </FormEditorProvider>
  )
}

export default function FormBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-sm font-bold tracking-wide text-gray-400">FORM BUILDER</div>
          <div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gray-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <FormBuilderContent />
    </Suspense>
  )
}
