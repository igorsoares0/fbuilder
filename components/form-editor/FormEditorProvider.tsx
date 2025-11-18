"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { FormEditorContext } from "@/contexts/FormEditorContext"
import { FormElement, ElementType, FormBackground, ActiveTab, ImageElement } from "@/types/form-elements"
import { useFormHistory } from "@/hooks/useFormHistory"
import { useFormPersistence } from "@/hooks/useFormPersistence"
import { getInitialElements } from "@/lib/form-templates"

interface FormEditorProviderProps {
  children: ReactNode
  formId: string | null
  template: string
}

export function FormEditorProvider({ children, formId, template }: FormEditorProviderProps) {
  const router = useRouter()
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [selectedElement, setSelectedElement] = useState<ElementType>("text")
  const [selectedElementId, setSelectedElementId] = useState<string>("heading")
  const [activeTab, setActiveTab] = useState<ActiveTab>("font")
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showFormSettings, setShowFormSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formTitle, setFormTitle] = useState("Untitled Form")

  const [formBackground, setFormBackground] = useState<FormBackground>({
    type: "color",
    color: "#EDE8E3",
    gradientFrom: "#EDE8E3",
    gradientTo: "#D4CFC8",
    gradientDirection: "to bottom",
    imageUrl: "",
    imageOpacity: "100",
  })

  // History management
  const { undo: undoHistory, redo: redoHistory, canUndo, canRedo } = useFormHistory(formElements)

  // Persistence management
  const { isSaving, lastSaved, saveForm } = useFormPersistence({
    formId,
    formElements,
    formBackground,
    formTitle,
    isLoading,
  })

  // Load form data on mount
  useEffect(() => {
    const loadForm = async () => {
      if (formId) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/forms/${formId}`)
          if (!response.ok) throw new Error('Failed to load form')
          const form = await response.json()
          setFormTitle(form.title)
          setFormElements(form.elements)
          setFormBackground(form.background)
        } catch (error) {
          console.error('Error loading form:', error)
          alert('Failed to load form. Redirecting to dashboard...')
          router.push('/dashboard')
        } finally {
          setIsLoading(false)
        }
      } else {
        setFormElements(getInitialElements(template))
        setIsLoading(false)
      }
    }
    loadForm()
  }, [formId, template, router])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierKey = e.ctrlKey || e.metaKey
      if (isModifierKey && e.key === "z") {
        e.preventDefault()
        undo()
      } else if (isModifierKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canUndo, canRedo])

  const updateElement = (id: string, updates: Partial<FormElement>) => {
    const hasPosition = 'position' in updates

    if (hasPosition && updates.position === "none") {
      const currentElement = formElements.find(el => el.id === id)
      if (currentElement?.elementType === "image") {
        setFormElements(formElements.filter((el) => el.id !== id))
        setSelectedElement("text")
        setSelectedElementId(formElements.find(el => el.elementType === "text")?.id || "")
        return
      }
    }

    if (hasPosition && updates.position && updates.position !== "inline" && updates.position !== "none") {
      const currentElement = formElements.find(el => el.id === id)
      if (currentElement?.elementType === "image") {
        setFormElements(
          formElements.map((el) => {
            if (el.id === id) {
              return { ...el, ...updates } as FormElement
            } else if (el.elementType === "image" && (el as ImageElement).position !== "inline") {
              return { ...el, position: "inline" } as FormElement
            }
            return el
          })
        )
        return
      }
    }

    setFormElements(formElements.map((el) => (el.id === id ? { ...el, ...updates } as FormElement : el)))
  }

  const addElement = (element: FormElement, afterIndex: number) => {
    const newElements = [...formElements]
    newElements.splice(afterIndex + 1, 0, element)
    setFormElements(newElements)
  }

  const deleteElement = (id: string) => {
    if (!confirm('Are you sure you want to delete this element?')) return

    setFormElements(formElements.filter((el) => el.id !== id))

    if (selectedElementId === id) {
      const remainingElements = formElements.filter((el) => el.id !== id)
      if (remainingElements.length > 0) {
        const firstElement = remainingElements[0]
        setSelectedElement(firstElement.elementType)
        setSelectedElementId(firstElement.id)
      } else {
        setSelectedElement(null)
        setSelectedElementId("")
      }
    }
  }

  const moveElementUp = (index: number) => {
    if (index === 0) return
    const newElements = [...formElements]
    const temp = newElements[index]
    newElements[index] = newElements[index - 1]
    newElements[index - 1] = temp
    setFormElements(newElements)
  }

  const moveElementDown = (index: number) => {
    if (index === formElements.length - 1) return
    const newElements = [...formElements]
    const temp = newElements[index]
    newElements[index] = newElements[index + 1]
    newElements[index + 1] = temp
    setFormElements(newElements)
  }

  const selectElement = (type: ElementType, id: string) => {
    if (selectedElementId === id && (type === "text" || type === "button")) {
      setEditingElementId(id)
      return
    }
    setSelectedElement(type)
    setSelectedElementId(id)
    setEditingElementId(null)
    setShowFormSettings(false)
    if (type === "text") setActiveTab("font")
    if (type === "button") setActiveTab("style")
    if (type === "field") setActiveTab("fields")
    if (type === "image") setActiveTab("style")
  }

  const undo = () => {
    const previousState = undoHistory()
    if (previousState) {
      setFormElements(previousState)
    }
  }

  const redo = () => {
    const nextState = redoHistory()
    if (nextState) {
      setFormElements(nextState)
    }
  }

  const value = {
    formElements,
    selectedElement,
    selectedElementId,
    activeTab,
    editingElementId,
    previewMode,
    formBackground,
    formTitle,
    showFormSettings,
    isLoading,
    isSaving,
    lastSaved,
    canUndo,
    canRedo,
    setFormElements,
    setSelectedElement,
    setSelectedElementId,
    setActiveTab,
    setEditingElementId,
    setPreviewMode,
    setFormBackground,
    setFormTitle,
    setShowFormSettings,
    updateElement,
    addElement,
    deleteElement,
    moveElementUp,
    moveElementDown,
    selectElement,
    undo,
    redo,
    saveForm,
  }

  return <FormEditorContext.Provider value={value}>{children}</FormEditorContext.Provider>
}
