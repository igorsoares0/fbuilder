import { useState, useEffect, useRef } from "react"
import { FormElement } from "@/types/form-elements"

export function useFormHistory(formElements: FormElement[]) {
  const [history, setHistory] = useState<FormElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoAction = useRef(false)

  // Track changes to formElements for undo/redo
  useEffect(() => {
    // Skip if this is an undo/redo action
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    // Add current state to history
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1)
      // Add current state
      newHistory.push(JSON.parse(JSON.stringify(formElements)))
      // Limit history to 50 states
      return newHistory.slice(-50)
    })
    setHistoryIndex(prev => Math.min(prev + 1, 49))
  }, [formElements, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true
      const previousState = history[historyIndex - 1]
      setHistoryIndex(prev => prev - 1)
      return JSON.parse(JSON.stringify(previousState)) as FormElement[]
    }
    return null
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true
      const nextState = history[historyIndex + 1]
      setHistoryIndex(prev => prev + 1)
      return JSON.parse(JSON.stringify(nextState)) as FormElement[]
    }
    return null
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return { undo, redo, canUndo, canRedo }
}
