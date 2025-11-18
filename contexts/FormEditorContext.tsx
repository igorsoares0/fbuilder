"use client"

import { createContext, useContext, ReactNode } from "react"
import { FormElement, ElementType, FormBackground, ActiveTab } from "@/types/form-elements"

interface FormEditorContextType {
  // State
  formElements: FormElement[]
  selectedElement: ElementType
  selectedElementId: string
  activeTab: ActiveTab
  editingElementId: string | null
  previewMode: "desktop" | "mobile"
  formBackground: FormBackground
  formTitle: string
  showFormSettings: boolean
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null

  // History
  canUndo: boolean
  canRedo: boolean

  // Actions
  setFormElements: (elements: FormElement[]) => void
  setSelectedElement: (type: ElementType) => void
  setSelectedElementId: (id: string) => void
  setActiveTab: (tab: ActiveTab) => void
  setEditingElementId: (id: string | null) => void
  setPreviewMode: (mode: "desktop" | "mobile") => void
  setFormBackground: (background: FormBackground) => void
  setFormTitle: (title: string) => void
  setShowFormSettings: (show: boolean) => void

  // Element operations
  updateElement: (id: string, updates: Partial<FormElement>) => void
  addElement: (element: FormElement, afterIndex: number) => void
  deleteElement: (id: string) => void
  moveElementUp: (index: number) => void
  moveElementDown: (index: number) => void
  selectElement: (type: ElementType, id: string) => void

  // History operations
  undo: () => void
  redo: () => void

  // Persistence
  saveForm: () => Promise<void>
}

const FormEditorContext = createContext<FormEditorContextType | undefined>(undefined)

export function useFormEditorContext() {
  const context = useContext(FormEditorContext)
  if (!context) {
    throw new Error("useFormEditorContext must be used within FormEditorProvider")
  }
  return context
}

export { FormEditorContext }
export type { FormEditorContextType }
