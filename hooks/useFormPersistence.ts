import { useState, useEffect } from "react"
import { FormElement, FormBackground } from "@/types/form-elements"

interface UseFormPersistenceProps {
  formId: string | null
  formElements: FormElement[]
  formBackground: FormBackground
  formTitle: string
  isLoading: boolean
}

export function useFormPersistence({
  formId,
  formElements,
  formBackground,
  formTitle,
  isLoading,
}: UseFormPersistenceProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Autosave - debounced save after changes
  useEffect(() => {
    if (!formId || isLoading) return

    const timer = setTimeout(async () => {
      await saveForm()
    }, 2000) // 2 second debounce

    return () => clearTimeout(timer)
  }, [formElements, formBackground, formTitle, formId, isLoading])

  const saveForm = async () => {
    if (!formId) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          elements: formElements,
          background: formBackground,
        }),
      })

      if (!response.ok) throw new Error('Failed to save form')

      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving form:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, lastSaved, saveForm }
}
