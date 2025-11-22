"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FormEditorProvider } from "@/components/form-editor/FormEditorProvider"
import { FormEditor } from "@/components/form-editor/FormEditor"
import { SubscriptionGate } from "@/components/billing/SubscriptionGate"

function EditorContent() {
  const searchParams = useSearchParams()
  const template = searchParams.get("template") || "default"
  const formId = searchParams.get("id")

  return (
    <FormEditorProvider formId={formId} template={template}>
      <FormEditor />
    </FormEditorProvider>
  )
}

export default function EditorPage() {
  return (
    <SubscriptionGate>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading editor...</p>
          </div>
        </div>
      }>
        <EditorContent />
      </Suspense>
    </SubscriptionGate>
  )
}
