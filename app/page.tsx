"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Monitor, Smartphone, AlignLeft, AlignCenter, AlignRight, Upload, Plus, Type, MousePointer, Image as ImageIcon } from "lucide-react"

type ElementType = "text" | "button" | "field" | "image" | null

interface TextElement {
  id: string
  elementType: "text"
  content: string
  fontFamily: string
  fontWeight: string
  fontSize: string
  fontColor: string
  lineHeight: string
  letterSpacing: string
  textAlign: "left" | "center" | "right"
}

interface ButtonElement {
  id: string
  elementType: "button"
  label: string
  fillColor: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  height: string
  width: string
  fontFamily: string
  fontWeight: string
  fontSize: string
  fontColor: string
  lineHeight: string
  letterSpacing: string
  textAlign: "left" | "center" | "right"
}

interface FieldElement {
  id: string
  elementType: "field"
  type: "text" | "email"
  placeholder: string
  label: string
  required: boolean
  fillColor: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  height: string
  fontFamily: string
  fontWeight: string
  fontSize: string
  fontColor: string
  lineHeight: string
  letterSpacing: string
  textAlign: "left" | "center" | "right"
}

interface ImageElement {
  id: string
  elementType: "image"
  url: string
  alt: string
  width: string
  height: string
  borderRadius: string
  position: "inline" | "left" | "right" | "top" | "bottom" | "background" | "none"
  opacity?: string // Used when position is "background"
}

type FormElement = TextElement | ButtonElement | FieldElement | ImageElement

interface FormField {
  id: string
  type: "text" | "email"
  placeholder: string
  label: string
  required: boolean
  // Style properties
  fillColor: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  height: string
  // Font properties
  fontFamily: string
  fontWeight: string
  fontSize: string
  fontColor: string
  lineHeight: string
  letterSpacing: string
  textAlign: "left" | "center" | "right"
}

export default function FormBuilderPage() {
  const [selectedElement, setSelectedElement] = useState<ElementType>("text")
  const [selectedElementId, setSelectedElementId] = useState<string>("heading")
  const [activeTab, setActiveTab] = useState<"fields" | "style" | "font">("font")
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [addMenuPosition, setAddMenuPosition] = useState<number | null>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
  const [formElements, setFormElements] = useState<FormElement[]>([
    {
      id: "main-image",
      elementType: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/text-editor-q4PVzyjDcuig9i4hLmgvReaMzJ8hhm.png",
      alt: "Decorative image",
      width: "50",
      height: "100",
      borderRadius: "0",
      position: "left",
      opacity: "100",
    },
    {
      id: "heading",
      elementType: "text",
      content: "Unleash your genius",
      fontFamily: "Georgia",
      fontWeight: "400",
      fontSize: "48",
      fontColor: "#494D3E",
      lineHeight: "1.2",
      letterSpacing: "0",
      textAlign: "left",
    },
    {
      id: "description",
      elementType: "text",
      content: "Wondering how to take your creative talent and turn it into a scalable business? You're in good hands, friend. Sign up below to receive my 100% free step-by-step guide on how to launch and grow a creative business that celebrates your genius.",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#6B7280",
      lineHeight: "1.5",
      letterSpacing: "0",
      textAlign: "left",
    },
    {
      id: "field-1",
      elementType: "field",
      type: "text",
      placeholder: "FIRST NAME",
      label: "FIRST NAME",
      required: false,
      fillColor: "transparent",
      borderColor: "#1F2937",
      borderWidth: "2",
      borderRadius: "999",
      height: "48",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#1F2937",
      lineHeight: "1",
      letterSpacing: "0",
      textAlign: "left",
    },
    {
      id: "field-2",
      elementType: "field",
      type: "email",
      placeholder: "EMAIL ADDRESS",
      label: "EMAIL ADDRESS",
      required: false,
      fillColor: "transparent",
      borderColor: "#1F2937",
      borderWidth: "2",
      borderRadius: "999",
      height: "48",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#1F2937",
      lineHeight: "1",
      letterSpacing: "0",
      textAlign: "left",
    },
    {
      id: "download-button",
      elementType: "button",
      label: "DOWNLOAD",
      fillColor: "#494D3E",
      borderColor: "transparent",
      borderWidth: "0",
      borderRadius: "999",
      height: "48",
      width: "100",
      fontFamily: "Arial",
      fontWeight: "500",
      fontSize: "14",
      fontColor: "#FFFFFF",
      lineHeight: "1",
      letterSpacing: "1",
      textAlign: "center",
    },
  ])

  // Text properties - separate states for heading and description
  const [headingStyles, setHeadingStyles] = useState({
    fontFamily: "Georgia",
    fontWeight: "400",
    fontSize: "48",
    fontColor: "#494D3E",
    lineHeight: "1.2",
    letterSpacing: "0",
    textAlign: "left" as "left" | "center" | "right",
  })

  const [descriptionStyles, setDescriptionStyles] = useState({
    fontFamily: "Arial",
    fontWeight: "400",
    fontSize: "14",
    fontColor: "#6B7280",
    lineHeight: "1.5",
    letterSpacing: "0",
    textAlign: "left" as "left" | "center" | "right",
  })

  // Current active text element styles
  const getCurrentTextStyles = () => {
    return selectedElementId === "heading" ? headingStyles : descriptionStyles
  }

  const updateCurrentTextStyles = (updates: Partial<typeof headingStyles>) => {
    if (selectedElementId === "heading") {
      setHeadingStyles({ ...headingStyles, ...updates })
    } else {
      setDescriptionStyles({ ...descriptionStyles, ...updates })
    }
  }

  const [buttonStyles, setButtonStyles] = useState({
    // Style properties
    fillColor: "#494D3E",
    borderColor: "transparent",
    borderWidth: "0",
    borderRadius: "999",
    height: "48",
    width: "100",
    // Font properties
    fontFamily: "Arial",
    fontWeight: "500",
    fontSize: "14",
    fontColor: "#FFFFFF",
    lineHeight: "1",
    letterSpacing: "1",
    textAlign: "center" as "left" | "center" | "right",
  })

  const updateButtonStyles = (updates: Partial<typeof buttonStyles>) => {
    setButtonStyles({ ...buttonStyles, ...updates })
  }

  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "field-1",
      type: "text",
      placeholder: "FIRST NAME",
      label: "FIRST NAME",
      required: false,
      fillColor: "transparent",
      borderColor: "#1F2937",
      borderWidth: "2",
      borderRadius: "999",
      height: "48",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#1F2937",
      lineHeight: "1",
      letterSpacing: "0",
      textAlign: "left",
    },
    {
      id: "field-2",
      type: "email",
      placeholder: "EMAIL ADDRESS",
      label: "EMAIL ADDRESS",
      required: false,
      fillColor: "transparent",
      borderColor: "#1F2937",
      borderWidth: "2",
      borderRadius: "999",
      height: "48",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#1F2937",
      lineHeight: "1",
      letterSpacing: "0",
      textAlign: "left",
    },
  ])

  const getCurrentElement = () => {
    return formElements.find((el) => el.id === selectedElementId)
  }

  const updateCurrentElement = (updates: Partial<FormElement>) => {
    // Se estamos mudando o position de uma imagem para "none", deletar a imagem
    if (updates.position === "none") {
      const currentElement = formElements.find(el => el.id === selectedElementId)
      if (currentElement?.elementType === "image") {
        setFormElements(formElements.filter((el) => el.id !== selectedElementId))
        // Resetar seleção
        setSelectedElement("text")
        setSelectedElementId(formElements.find(el => el.elementType === "text")?.id || "")
        return
      }
    }

    // Se estamos mudando o position de uma imagem para não-inline,
    // resetar outras imagens para inline
    if (updates.position && updates.position !== "inline" && updates.position !== "none") {
      const currentElement = formElements.find(el => el.id === selectedElementId)
      if (currentElement?.elementType === "image") {
        setFormElements(
          formElements.map((el) => {
            if (el.id === selectedElementId) {
              return { ...el, ...updates } as FormElement
            } else if (el.elementType === "image" && (el as ImageElement).position !== "inline") {
              // Resetar outras imagens para inline
              return { ...el, position: "inline" } as FormElement
            }
            return el
          })
        )
        return
      }
    }

    setFormElements(
      formElements.map((el) => (el.id === selectedElementId ? { ...el, ...updates } as FormElement : el))
    )
  }

  const getCurrentField = () => {
    return formFields.find((field) => field.id === selectedElementId)
  }

  const updateCurrentField = (updates: Partial<FormField>) => {
    setFormFields(
      formFields.map((field) => (field.id === selectedElementId ? { ...field, ...updates } : field))
    )
  }

  const handleSelectElement = (type: ElementType, id: string) => {
    // Se já está selecionado, entra em modo de edição
    if (selectedElementId === id && (type === "text" || type === "button")) {
      setEditingElementId(id)
      return
    }

    setSelectedElement(type)
    setSelectedElementId(id)
    setEditingElementId(null)
    if (type === "text") setActiveTab("font")
    if (type === "button") setActiveTab("style")
    if (type === "field") setActiveTab("fields")
    if (type === "image") setActiveTab("style")
  }

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${formFields.length + 1}`,
      type: "text",
      placeholder: "NEW FIELD",
      label: "NEW FIELD",
      required: false,
      fillColor: "transparent",
      borderColor: "#1F2937",
      borderWidth: "2",
      borderRadius: "999",
      height: "48",
      fontFamily: "Arial",
      fontWeight: "400",
      fontSize: "14",
      fontColor: "#1F2937",
      lineHeight: "1",
      letterSpacing: "0",
      textAlign: "left",
    }
    setFormFields([...formFields, newField])
  }

  const handleOpenAddMenu = (afterIndex: number) => {
    setAddMenuPosition(afterIndex)
    setShowAddMenu(true)
  }

  const handleCloseAddMenu = () => {
    setShowAddMenu(false)
    setAddMenuPosition(null)
  }

  const handleAddElement = (type: "text" | "button" | "field" | "image") => {
    if (addMenuPosition === null) return

    const newId = `${type}-${Date.now()}`
    let newElement: FormElement

    if (type === "text") {
      newElement = {
        id: newId,
        elementType: "text",
        content: "New text element",
        fontFamily: "Arial",
        fontWeight: "400",
        fontSize: "16",
        fontColor: "#000000",
        lineHeight: "1.5",
        letterSpacing: "0",
        textAlign: "left",
      }
    } else if (type === "button") {
      newElement = {
        id: newId,
        elementType: "button",
        label: "CLICK ME",
        fillColor: "#000000",
        borderColor: "transparent",
        borderWidth: "0",
        borderRadius: "8",
        height: "48",
        width: "100",
        fontFamily: "Arial",
        fontWeight: "500",
        fontSize: "14",
        fontColor: "#FFFFFF",
        lineHeight: "1",
        letterSpacing: "0",
        textAlign: "center",
      }
    } else if (type === "image") {
      newElement = {
        id: newId,
        elementType: "image",
        url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop",
        alt: "Placeholder image",
        width: "100",
        height: "200",
        borderRadius: "8",
        position: "inline",
        opacity: "100",
      }
    } else {
      newElement = {
        id: newId,
        elementType: "field",
        type: "text",
        placeholder: "NEW FIELD",
        label: "NEW FIELD",
        required: false,
        fillColor: "transparent",
        borderColor: "#1F2937",
        borderWidth: "2",
        borderRadius: "8",
        height: "48",
        fontFamily: "Arial",
        fontWeight: "400",
        fontSize: "14",
        fontColor: "#1F2937",
        lineHeight: "1",
        letterSpacing: "0",
        textAlign: "left",
      }
    }

    const newElements = [...formElements]
    newElements.splice(addMenuPosition + 1, 0, newElement)
    setFormElements(newElements)
    handleCloseAddMenu()
  }

  const handleFinishEditing = () => {
    setEditingElementId(null)
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="text-sm font-bold tracking-wide">FORM BUILDER</div>

        <div className="flex items-center gap-8">
          <button className="text-sm font-medium text-gray-900">Design</button>
          <button className="text-sm font-medium text-gray-400">Thank you</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded p-2 hover:bg-gray-100">
            <Monitor className="h-4 w-4 text-gray-400" />
          </button>
          <button className="rounded p-2 hover:bg-gray-100">
            <Smartphone className="h-4 w-4 text-gray-400" />
          </button>
          <Button className="bg-black px-8 py-2 text-sm font-medium text-white hover:bg-gray-900">SAVE</Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex flex-1 items-center justify-center bg-gray-50">
          {(() => {
            // Find positioned image (any image with position !== "inline")
            const positionedImage = formElements.find(el => el.elementType === "image" && (el as ImageElement).position !== "inline") as ImageElement | undefined
            const position = positionedImage?.position || "none"

            // Filter elements: remove positioned image from regular flow
            const inlineElements = formElements.filter(el => !(el.elementType === "image" && (el as ImageElement).position !== "inline"))

            return (
              <div
                className={`${
                  position === "background" || position === "none" ? "relative" : "flex"
                } h-full w-full max-w-6xl ${
                  position === "top"
                    ? "flex-col"
                    : position === "bottom"
                    ? "flex-col-reverse"
                    : position === "right"
                    ? "flex-row-reverse"
                    : position === "background" || position === "none"
                    ? ""
                    : "flex-row"
                }`}
              >
                {/* Positioned Image Section */}
                {position === "background" && positionedImage ? (
                  <div
                    className={`absolute inset-0 cursor-pointer ${
                      selectedElement === "image" && selectedElementId === positionedImage.id ? "ring-4 ring-blue-500 ring-inset" : ""
                    }`}
                    onClick={() => handleSelectElement("image", positionedImage.id)}
                  >
                    <img
                      src={positionedImage.url}
                      alt={positionedImage.alt}
                      className="h-full w-full object-cover"
                      style={{ opacity: parseInt(positionedImage.opacity || "100") / 100 }}
                    />
                  </div>
                ) : position !== "none" && position !== "inline" && positionedImage ? (
                  <div
                    className={`relative cursor-pointer bg-[#C9B896] flex items-center justify-center ${
                      selectedElement === "image" && selectedElementId === positionedImage.id ? "ring-4 ring-blue-500 ring-inset" : ""
                    }`}
                    style={{
                      height:
                        position === "top" || position === "bottom"
                          ? `${positionedImage.height}%`
                          : "100%",
                      width:
                        position === "left" || position === "right"
                          ? `${positionedImage.width}%`
                          : "100%",
                    }}
                    onClick={() => handleSelectElement("image", positionedImage.id)}
                  >
                    <img
                      src={positionedImage.url}
                      alt={positionedImage.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Form Section */}
                <div
                  className={`flex items-center justify-center px-16 py-20 ${
                    position === "background"
                      ? "relative z-10 h-full w-full"
                      : position === "none"
                      ? "relative h-full w-full bg-[#EDE8E3]"
                      : position !== "inline" && positionedImage
                      ? "flex-1 bg-[#EDE8E3]"
                      : "relative h-full w-full bg-[#EDE8E3]"
                  }`}
                  style={
                    position === "background" || position === "none" || position === "inline"
                      ? {}
                      : {
                          height:
                            position === "top" || position === "bottom"
                              ? `${100 - parseInt(positionedImage?.height || "50")}%`
                              : "100%",
                          width:
                            position === "left" || position === "right"
                              ? `${100 - parseInt(positionedImage?.width || "50")}%`
                              : "100%",
                        }
                  }
                >
                  <div className="w-full max-w-md space-y-6">
                    {inlineElements.map((element, index) => (
                  <div key={element.id} className="group relative">
                    {/* Render based on element type */}
                    {element.elementType === "text" && (
                      <div
                        className={`cursor-pointer rounded border-2 p-4 ${
                          selectedElement === "text" && selectedElementId === element.id
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        onClick={() => handleSelectElement("text", element.id)}
                      >
                        {editingElementId === element.id ? (
                          <textarea
                            autoFocus
                            value={element.content}
                            onChange={(e) => {
                              updateCurrentElement({ content: e.target.value })
                              // Auto-resize textarea
                              e.target.style.height = 'auto'
                              e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                            onBlur={handleFinishEditing}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                handleFinishEditing()
                              }
                            }}
                            className="w-full resize-none border-none bg-transparent outline-none overflow-hidden"
                            style={{
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              fontSize: `${element.fontSize}px`,
                              color: element.fontColor,
                              lineHeight: element.lineHeight,
                              letterSpacing: `${element.letterSpacing}px`,
                              textAlign: element.textAlign,
                              height: 'auto',
                            }}
                            ref={(textarea) => {
                              if (textarea) {
                                textarea.style.height = 'auto'
                                textarea.style.height = textarea.scrollHeight + 'px'
                              }
                            }}
                          />
                        ) : (
                          <p
                            style={{
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              fontSize: `${element.fontSize}px`,
                              color: element.fontColor,
                              lineHeight: element.lineHeight,
                              letterSpacing: `${element.letterSpacing}px`,
                              textAlign: element.textAlign,
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {element.content}
                          </p>
                        )}
                      </div>
                    )}

                    {element.elementType === "field" && (
                      <Input
                        type={element.type}
                        placeholder={element.placeholder}
                        required={element.required}
                        className={`w-full cursor-pointer px-6 transition-all ${
                          selectedElement === "field" && selectedElementId === element.id
                            ? "ring-4 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor: element.fillColor,
                          borderColor: element.borderColor,
                          borderWidth: `${element.borderWidth}px`,
                          borderStyle: "solid",
                          borderRadius: `${element.borderRadius}px`,
                          height: `${element.height}px`,
                          fontFamily: element.fontFamily,
                          fontWeight: element.fontWeight,
                          fontSize: `${element.fontSize}px`,
                          color: element.fontColor,
                          lineHeight: element.lineHeight,
                          letterSpacing: `${element.letterSpacing}px`,
                          textAlign: element.textAlign,
                        }}
                        onClick={() => handleSelectElement("field", element.id)}
                      />
                    )}

                    {element.elementType === "button" && (
                      <Button
                        className={`transition-all relative ${
                          selectedElement === "button" && selectedElementId === element.id
                            ? "ring-4 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor: element.fillColor,
                          borderColor: element.borderColor,
                          borderWidth: `${element.borderWidth}px`,
                          borderStyle: element.borderWidth !== "0" ? "solid" : "none",
                          borderRadius: `${element.borderRadius}px`,
                          height: `${element.height}px`,
                          width: `${element.width}%`,
                          fontFamily: element.fontFamily,
                          fontWeight: element.fontWeight,
                          fontSize: `${element.fontSize}px`,
                          color: element.fontColor,
                          lineHeight: element.lineHeight,
                          letterSpacing: `${element.letterSpacing}px`,
                          textAlign: element.textAlign,
                        }}
                        onClick={() => handleSelectElement("button", element.id)}
                      >
                        {editingElementId === element.id ? (
                          <input
                            autoFocus
                            value={element.label}
                            onChange={(e) => updateCurrentElement({ label: e.target.value })}
                            onBlur={handleFinishEditing}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                handleFinishEditing()
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full border-none bg-transparent text-center outline-none"
                            style={{
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              fontSize: `${element.fontSize}px`,
                              color: element.fontColor,
                              lineHeight: element.lineHeight,
                              letterSpacing: `${element.letterSpacing}px`,
                              textAlign: element.textAlign,
                            }}
                          />
                        ) : (
                          element.label
                        )}
                      </Button>
                    )}

                    {element.elementType === "image" && (
                      <div
                        className={`cursor-pointer rounded overflow-hidden ${
                          selectedElement === "image" && selectedElementId === element.id
                            ? "ring-4 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        onClick={() => handleSelectElement("image", element.id)}
                        style={{
                          width: element.position === "inline" ? "100%" : `${element.width}%`,
                        }}
                      >
                        <img
                          src={element.url}
                          alt={element.alt}
                          className="w-full object-cover"
                          style={{
                            height: `${element.height}px`,
                            borderRadius: `${element.borderRadius}px`,
                            opacity: element.position === "background" ? parseInt(element.opacity || "100") / 100 : 1,
                          }}
                        />
                      </div>
                    )}

                    {/* Add button below each element */}
                    <button
                      className="absolute left-1/2 -bottom-3 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                      onClick={() => handleOpenAddMenu(index)}
                      title="Add element"
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          {/* Text Editor Panel */}
          {selectedElement === "text" && getCurrentElement()?.elementType === "text" && (
            <>
              <h2 className="mb-8 text-lg font-semibold">Font</h2>

              <div className="space-y-6">
                {/* Font Family and Weight */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                  <div className="flex gap-2">
                    <Select
                      value={(getCurrentElement() as TextElement)?.fontFamily || "Arial"}
                      onValueChange={(value) => updateCurrentElement({ fontFamily: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).fontWeight}
                      onValueChange={(value) => updateCurrentElement({ fontWeight: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="400">Regular</SelectItem>
                        <SelectItem value="600">Semi Bold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
                  <Select
                    value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).fontSize}
                    onValueChange={(value) => updateCurrentElement({ fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="18">18</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="28">28</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="72">72</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Color */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Font Color</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).fontColor}
                      onChange={(e) => updateCurrentElement({ fontColor: e.target.value })}
                      className="flex-1 text-sm"
                    />
                    <input
                      type="color"
                      value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).fontColor}
                      onChange={(e) => updateCurrentElement({ fontColor: e.target.value })}
                      className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                    />
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
                  <div className="flex gap-2">
                    <button
                      className={`flex h-10 flex-1 items-center justify-center rounded border ${
                        ((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).textAlign === "left"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentElement({ textAlign: "left" })}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex h-10 flex-1 items-center justify-center rounded border ${
                        ((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).textAlign === "center"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentElement({ textAlign: "center" })}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex h-10 flex-1 items-center justify-center rounded border ${
                        ((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).textAlign === "right"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentElement({ textAlign: "right" })}
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Spacing */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Line height</label>
                      <Select
                        value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).lineHeight}
                        onValueChange={(value) => updateCurrentElement({ lineHeight: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.2">1.2</SelectItem>
                          <SelectItem value="1.33">1.33</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="1.75">1.75</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                      <Select
                        value={((getCurrentElement() as TextElement) || {fontFamily:"Arial",fontWeight:"400",fontSize:"16",fontColor:"#000000",lineHeight:"1.5",letterSpacing:"0",textAlign:"left" as const}).letterSpacing}
                        onValueChange={(value) => updateCurrentElement({ letterSpacing: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">-1</SelectItem>
                          <SelectItem value="-0.5">-0.5</SelectItem>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="0.5">0.5</SelectItem>
                          <SelectItem value="0.7">0.7</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Add Text Button */}
                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Add text
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Button Editor Panel */}
          {selectedElement === "button" && getCurrentElement()?.elementType === "button" && (
            <>
              <div className="mb-6 flex gap-4 border-b border-gray-200">
                <button
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "style" ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("style")}
                >
                  Style
                </button>
                <button
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "font" ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("font")}
                >
                  Font
                </button>
              </div>

              {activeTab === "style" && (
                <div className="space-y-6">
                  {/* Fill Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Fill color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={(getCurrentElement() as ButtonElement)?.fillColor || "#000000"}
                        onChange={(e) => updateCurrentElement({ fillColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={(getCurrentElement() as ButtonElement)?.fillColor || "#000000"}
                        onChange={(e) => updateCurrentElement({ fillColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={(getCurrentElement() as ButtonElement)?.borderColor || "#000000"}
                        onChange={(e) => updateCurrentElement({ borderColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={(getCurrentElement() as ButtonElement)?.borderColor || "#000000"}
                        onChange={(e) => updateCurrentElement({ borderColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Border Width */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border width</label>
                    <Select
                      value={(getCurrentElement() as ButtonElement)?.borderWidth || "0"}
                      onValueChange={(value) => updateCurrentElement({ borderWidth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
                    <Select
                      value={(getCurrentElement() as ButtonElement)?.borderRadius || "0"}
                      onValueChange={(value) => updateCurrentElement({ borderRadius: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="999">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Button Sizing */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Button sizing</label>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Height (px)</label>
                        <Select
                          value={(getCurrentElement() as ButtonElement)?.height || "48"}
                          onValueChange={(value) => updateCurrentElement({ height: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="32">32</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                            <SelectItem value="56">56</SelectItem>
                            <SelectItem value="64">64</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Width (%)</label>
                        <Select
                          value={(getCurrentElement() as ButtonElement)?.width || "100"}
                          onValueChange={(value) => updateCurrentElement({ width: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30%</SelectItem>
                            <SelectItem value="40">40%</SelectItem>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="60">60%</SelectItem>
                            <SelectItem value="75">75%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="pt-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      Add button
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "font" && (
                <div className="space-y-6">
                  {/* Font Family and Weight */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                    <div className="flex gap-2">
                      <Select
                        value={(getCurrentElement() as ButtonElement)?.fontFamily || "Arial"}
                        onValueChange={(value) => updateCurrentElement({ fontFamily: value })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={(getCurrentElement() as ButtonElement)?.fontWeight || "400"}
                        onValueChange={(value) => updateCurrentElement({ fontWeight: value })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light</SelectItem>
                          <SelectItem value="400">Regular</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semi Bold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
                    <Select
                      value={(getCurrentElement() as ButtonElement)?.fontSize || "14"}
                      onValueChange={(value) => updateCurrentElement({ fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Font Color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={(getCurrentElement() as ButtonElement)?.fontColor || "#FFFFFF"}
                        onChange={(e) => updateCurrentElement({ fontColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={(getCurrentElement() as ButtonElement)?.fontColor || "#FFFFFF"}
                        onChange={(e) => updateCurrentElement({ fontColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
                    <div className="flex gap-2">
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          (getCurrentElement() as ButtonElement)?.textAlign === "left"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentElement({ textAlign: "left" })}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          (getCurrentElement() as ButtonElement)?.textAlign === "center"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentElement({ textAlign: "center" })}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          (getCurrentElement() as ButtonElement)?.textAlign === "right"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentElement({ textAlign: "right" })}
                      >
                        <AlignRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Line height</label>
                        <Select
                          value={(getCurrentElement() as ButtonElement)?.lineHeight || "1"}
                          onValueChange={(value) => updateCurrentElement({ lineHeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="1.2">1.2</SelectItem>
                            <SelectItem value="1.33">1.33</SelectItem>
                            <SelectItem value="1.5">1.5</SelectItem>
                            <SelectItem value="1.75">1.75</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                        <Select
                          value={(getCurrentElement() as ButtonElement)?.letterSpacing || "0"}
                          onValueChange={(value) => updateCurrentElement({ letterSpacing: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="-1">-1</SelectItem>
                            <SelectItem value="-0.5">-0.5</SelectItem>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="0.5">0.5</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="1.5">1.5</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Field Editor Panel */}
          {selectedElement === "field" && (
            <>
              <div className="mb-6 flex gap-4 border-b border-gray-200">
                <button
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "fields" ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("fields")}
                >
                  Fields
                </button>
                <button
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "style" ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("style")}
                >
                  Style
                </button>
                <button
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "font" ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab("font")}
                >
                  Font
                </button>
              </div>

              {activeTab === "fields" && (
                <div className="space-y-6">
                  {/* Field Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Field type</label>
                    <Select
                      value={getCurrentField()?.type || "text"}
                      onValueChange={(value: "text" | "email") => updateCurrentField({ type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Label */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Label</label>
                    <Input
                      value={getCurrentField()?.label || ""}
                      onChange={(e) => updateCurrentField({ label: e.target.value })}
                      placeholder="Field label"
                      className="text-sm"
                    />
                  </div>

                  {/* Placeholder */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Placeholder</label>
                    <Input
                      value={getCurrentField()?.placeholder || ""}
                      onChange={(e) => updateCurrentField({ placeholder: e.target.value })}
                      placeholder="Field placeholder"
                      className="text-sm"
                    />
                  </div>

                  {/* Required */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="required"
                      checked={getCurrentField()?.required || false}
                      onCheckedChange={(checked) => updateCurrentField({ required: checked as boolean })}
                    />
                    <label htmlFor="required" className="text-sm text-gray-700">
                      Required field
                    </label>
                  </div>

                  {/* Add Field Button */}
                  <div className="pt-4">
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleAddField}>
                      Add field
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "style" && (
                <div className="space-y-6">
                  {/* Fill Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Fill color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={getCurrentField()?.fillColor || "transparent"}
                        onChange={(e) => updateCurrentField({ fillColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={getCurrentField()?.fillColor === "transparent" ? "#ffffff" : getCurrentField()?.fillColor}
                        onChange={(e) => updateCurrentField({ fillColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={getCurrentField()?.borderColor || "#000000"}
                        onChange={(e) => updateCurrentField({ borderColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={getCurrentField()?.borderColor || "#000000"}
                        onChange={(e) => updateCurrentField({ borderColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Border Width */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border width</label>
                    <Select
                      value={getCurrentField()?.borderWidth || "2"}
                      onValueChange={(value) => updateCurrentField({ borderWidth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
                    <Select
                      value={getCurrentField()?.borderRadius || "0"}
                      onValueChange={(value) => updateCurrentField({ borderRadius: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="999">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field Height */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Height (px)</label>
                    <Select
                      value={getCurrentField()?.height || "48"}
                      onValueChange={(value) => updateCurrentField({ height: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="32">32</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                        <SelectItem value="56">56</SelectItem>
                        <SelectItem value="64">64</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeTab === "font" && (
                <div className="space-y-6">
                  {/* Font Family and Weight */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                    <div className="flex gap-2">
                      <Select
                        value={getCurrentField()?.fontFamily || "Arial"}
                        onValueChange={(value) => updateCurrentField({ fontFamily: value })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={getCurrentField()?.fontWeight || "400"}
                        onValueChange={(value) => updateCurrentField({ fontWeight: value })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light</SelectItem>
                          <SelectItem value="400">Regular</SelectItem>
                          <SelectItem value="600">Semi Bold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Size</label>
                    <Select
                      value={getCurrentField()?.fontSize || "14"}
                      onValueChange={(value) => updateCurrentField({ fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Font Color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={getCurrentField()?.fontColor || "#000000"}
                        onChange={(e) => updateCurrentField({ fontColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={getCurrentField()?.fontColor || "#000000"}
                        onChange={(e) => updateCurrentField({ fontColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Alignment</label>
                    <div className="flex gap-2">
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          getCurrentField()?.textAlign === "left"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentField({ textAlign: "left" })}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          getCurrentField()?.textAlign === "center"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentField({ textAlign: "center" })}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          getCurrentField()?.textAlign === "right"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateCurrentField({ textAlign: "right" })}
                      >
                        <AlignRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Spacing</label>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Line height</label>
                        <Select
                          value={getCurrentField()?.lineHeight || "1"}
                          onValueChange={(value) => updateCurrentField({ lineHeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="1.2">1.2</SelectItem>
                            <SelectItem value="1.33">1.33</SelectItem>
                            <SelectItem value="1.5">1.5</SelectItem>
                            <SelectItem value="1.75">1.75</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Letter spacing</label>
                        <Select
                          value={getCurrentField()?.letterSpacing || "0"}
                          onValueChange={(value) => updateCurrentField({ letterSpacing: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="-1">-1</SelectItem>
                            <SelectItem value="-0.5">-0.5</SelectItem>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="0.5">0.5</SelectItem>
                            <SelectItem value="0.7">0.7</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="1.5">1.5</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Universal Image Editor Panel */}
          {selectedElement === "image" && getCurrentElement()?.elementType === "image" && (
            <>
              <h2 className="mb-8 text-lg font-semibold">Image</h2>

              <div className="space-y-6">
                {/* Upload Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Add image from...</label>
                  <label
                    htmlFor="image-upload"
                    className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload image</p>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          updateCurrentElement({ url: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image URL</label>
                  <Input
                    type="text"
                    value={(getCurrentElement() as ImageElement)?.url || ""}
                    onChange={(e) => updateCurrentElement({ url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>

                {/* Alt Text */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Alt text</label>
                  <Input
                    type="text"
                    value={(getCurrentElement() as ImageElement)?.alt || ""}
                    onChange={(e) => updateCurrentElement({ alt: e.target.value })}
                    placeholder="Description of image"
                    className="text-sm"
                  />
                </div>

                {/* Image Height - Only for inline position (height in pixels) */}
                {((getCurrentElement() as ImageElement)?.position === "inline" || (getCurrentElement() as ImageElement)?.position === "none") && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Height (px)</label>
                    <Select
                      value={(getCurrentElement() as ImageElement)?.height || "200"}
                      onValueChange={(value) => updateCurrentElement({ height: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="150">150</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="250">250</SelectItem>
                        <SelectItem value="300">300</SelectItem>
                        <SelectItem value="400">400</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Border Radius */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Border radius</label>
                  <Select
                    value={(getCurrentElement() as ImageElement)?.borderRadius || "8"}
                    onValueChange={(value) => updateCurrentElement({ borderRadius: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="999">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Position */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image position</label>
                  <Select
                    value={(getCurrentElement() as ImageElement)?.position || "inline"}
                    onValueChange={(value: "left" | "right" | "top" | "bottom" | "background" | "none" | "inline") =>
                      updateCurrentElement({ position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="background">Background</SelectItem>
                      <SelectItem value="none">No Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Sizing - Only show for non-inline positions */}
                {(getCurrentElement() as ImageElement)?.position !== "inline" && (getCurrentElement() as ImageElement)?.position !== "none" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      {(getCurrentElement() as ImageElement)?.position === "background" ? "Opacity" : "Image sizing"}
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">
                          {(getCurrentElement() as ImageElement)?.position === "background"
                            ? "Opacity (%)"
                            : (getCurrentElement() as ImageElement)?.position === "top" || (getCurrentElement() as ImageElement)?.position === "bottom"
                            ? "Height (%)"
                            : "Width (%)"}
                        </label>
                        <Select
                          value={
                            (getCurrentElement() as ImageElement)?.position === "background"
                              ? (getCurrentElement() as ImageElement)?.opacity || "100"
                              : (getCurrentElement() as ImageElement)?.position === "top" || (getCurrentElement() as ImageElement)?.position === "bottom"
                              ? (getCurrentElement() as ImageElement)?.height || "50"
                              : (getCurrentElement() as ImageElement)?.width || "100"
                          }
                          onValueChange={(value) => {
                            if ((getCurrentElement() as ImageElement)?.position === "background") {
                              updateCurrentElement({ opacity: value })
                            } else if ((getCurrentElement() as ImageElement)?.position === "top" || (getCurrentElement() as ImageElement)?.position === "bottom") {
                              updateCurrentElement({ height: value })
                            } else {
                              updateCurrentElement({ width: value })
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                            <SelectItem value="25">25%</SelectItem>
                            <SelectItem value="30">30%</SelectItem>
                            <SelectItem value="40">40%</SelectItem>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="60">60%</SelectItem>
                            <SelectItem value="70">70%</SelectItem>
                            <SelectItem value="75">75%</SelectItem>
                            <SelectItem value="80">80%</SelectItem>
                            <SelectItem value="90">90%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Element Dialog */}
      <Dialog open={showAddMenu} onOpenChange={setShowAddMenu}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Element</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <button
              onClick={() => handleAddElement("text")}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Type className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Text</div>
                <div className="text-sm text-gray-500">Add a text element</div>
              </div>
            </button>
            <button
              onClick={() => handleAddElement("button")}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MousePointer className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Button</div>
                <div className="text-sm text-gray-500">Add a button element</div>
              </div>
            </button>
            <button
              onClick={() => handleAddElement("field")}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Type className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Field</div>
                <div className="text-sm text-gray-500">Add an input field</div>
              </div>
            </button>
            <button
              onClick={() => handleAddElement("image")}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <ImageIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Image</div>
                <div className="text-sm text-gray-500">Add an image element</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
