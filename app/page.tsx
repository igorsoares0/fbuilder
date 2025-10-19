"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Monitor, Smartphone, AlignLeft, AlignCenter, AlignRight, Upload, Plus } from "lucide-react"

type ElementType = "text" | "button" | "field" | "image" | null

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

  const [imageStyles, setImageStyles] = useState({
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/text-editor-q4PVzyjDcuig9i4hLmgvReaMzJ8hhm.png",
    height: "100",
    width: "50",
    position: "left" as "left" | "right" | "top" | "bottom",
  })

  const updateImageStyles = (updates: Partial<typeof imageStyles>) => {
    setImageStyles({ ...imageStyles, ...updates })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateImageStyles({ url: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
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

  const getCurrentField = () => {
    return formFields.find((field) => field.id === selectedElementId)
  }

  const updateCurrentField = (updates: Partial<FormField>) => {
    setFormFields(
      formFields.map((field) => (field.id === selectedElementId ? { ...field, ...updates } : field))
    )
  }

  const handleSelectElement = (type: ElementType, id: string) => {
    setSelectedElement(type)
    setSelectedElementId(id)
    if (type === "text") setActiveTab("font")
    if (type === "button") setActiveTab("style")
    if (type === "field") setActiveTab("fields")
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
          <div
            className={`flex h-full w-full max-w-6xl ${
              imageStyles.position === "top" || imageStyles.position === "bottom"
                ? "flex-col"
                : imageStyles.position === "right"
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            {/* Image Section */}
            <div
              className={`relative cursor-pointer bg-[#C9B896] ${
                selectedElement === "image" ? "ring-4 ring-blue-500 ring-inset" : ""
              }`}
              style={{
                height:
                  imageStyles.position === "top" || imageStyles.position === "bottom"
                    ? `${imageStyles.height}%`
                    : "100%",
                width:
                  imageStyles.position === "left" || imageStyles.position === "right"
                    ? `${imageStyles.width}%`
                    : "100%",
              }}
              onClick={() => handleSelectElement("image", "main-image")}
            >
              <img
                src={imageStyles.url}
                alt="Decorative still life"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Form Section */}
            <div
              className="flex flex-1 items-center justify-center bg-[#EDE8E3] px-16 py-20"
              style={{
                height:
                  imageStyles.position === "top" || imageStyles.position === "bottom"
                    ? `${100 - parseInt(imageStyles.height)}%`
                    : "100%",
                width:
                  imageStyles.position === "left" || imageStyles.position === "right"
                    ? `${100 - parseInt(imageStyles.width)}%`
                    : "100%",
              }}
            >
              <div className="w-full max-w-md space-y-6">
                {/* Heading */}
                <div
                  className={`cursor-pointer rounded border-2 p-4 ${
                    selectedElement === "text" && selectedElementId === "heading"
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelectElement("text", "heading")}
                >
                  <h1
                    style={{
                      fontFamily: headingStyles.fontFamily,
                      fontWeight: headingStyles.fontWeight,
                      fontSize: `${headingStyles.fontSize}px`,
                      color: headingStyles.fontColor,
                      lineHeight: headingStyles.lineHeight,
                      letterSpacing: `${headingStyles.letterSpacing}px`,
                      textAlign: headingStyles.textAlign,
                    }}
                  >
                    Unleash your genius
                  </h1>
                </div>

                {/* Description */}
                <div
                  className={`cursor-pointer rounded border-2 p-2 ${
                    selectedElement === "text" && selectedElementId === "description"
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelectElement("text", "description")}
                >
                  <p
                    style={{
                      fontFamily: descriptionStyles.fontFamily,
                      fontWeight: descriptionStyles.fontWeight,
                      fontSize: `${descriptionStyles.fontSize}px`,
                      color: descriptionStyles.fontColor,
                      lineHeight: descriptionStyles.lineHeight,
                      letterSpacing: `${descriptionStyles.letterSpacing}px`,
                      textAlign: descriptionStyles.textAlign,
                    }}
                  >
                    Wondering how to take your creative talent and turn it into a scalable business? You're in good
                    hands, friend. Sign up below to receive my 100% free step-by-step guide on how to launch and grow a
                    creative business that celebrates your genius.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 pt-4">
                  {formFields.map((field, index) => (
                    <div key={field.id} className="relative">
                      <button
                        className="absolute left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white hover:bg-gray-50"
                        onClick={() => handleAddField()}
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={`cursor-pointer px-6 pl-12 transition-all ${
                          selectedElement === "field" && selectedElementId === field.id
                            ? "ring-4 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor: field.fillColor,
                          borderColor: field.borderColor,
                          borderWidth: `${field.borderWidth}px`,
                          borderStyle: "solid",
                          borderRadius: `${field.borderRadius}px`,
                          height: `${field.height}px`,
                          fontFamily: field.fontFamily,
                          fontWeight: field.fontWeight,
                          fontSize: `${field.fontSize}px`,
                          color: field.fontColor,
                          lineHeight: field.lineHeight,
                          letterSpacing: `${field.letterSpacing}px`,
                          textAlign: field.textAlign,
                        }}
                        onClick={() => handleSelectElement("field", field.id)}
                      />
                    </div>
                  ))}
                  <Button
                    className={`transition-all ${
                      selectedElement === "button" ? "ring-4 ring-blue-500 ring-offset-2" : ""
                    }`}
                    style={{
                      backgroundColor: buttonStyles.fillColor,
                      borderColor: buttonStyles.borderColor,
                      borderWidth: `${buttonStyles.borderWidth}px`,
                      borderStyle: buttonStyles.borderWidth !== "0" ? "solid" : "none",
                      borderRadius: `${buttonStyles.borderRadius}px`,
                      height: `${buttonStyles.height}px`,
                      width: `${buttonStyles.width}%`,
                      fontFamily: buttonStyles.fontFamily,
                      fontWeight: buttonStyles.fontWeight,
                      fontSize: `${buttonStyles.fontSize}px`,
                      color: buttonStyles.fontColor,
                      lineHeight: buttonStyles.lineHeight,
                      letterSpacing: `${buttonStyles.letterSpacing}px`,
                      textAlign: buttonStyles.textAlign,
                    }}
                    onClick={() => handleSelectElement("button", "download-button")}
                  >
                    DOWNLOAD
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-gray-200 bg-white p-6">
          {/* Text Editor Panel */}
          {selectedElement === "text" && (
            <>
              <h2 className="mb-8 text-lg font-semibold">Font</h2>

              <div className="space-y-6">
                {/* Font Family and Weight */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Font</label>
                  <div className="flex gap-2">
                    <Select
                      value={getCurrentTextStyles().fontFamily}
                      onValueChange={(value) => updateCurrentTextStyles({ fontFamily: value })}
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
                      value={getCurrentTextStyles().fontWeight}
                      onValueChange={(value) => updateCurrentTextStyles({ fontWeight: value })}
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
                    value={getCurrentTextStyles().fontSize}
                    onValueChange={(value) => updateCurrentTextStyles({ fontSize: value })}
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
                      value={getCurrentTextStyles().fontColor}
                      onChange={(e) => updateCurrentTextStyles({ fontColor: e.target.value })}
                      className="flex-1 text-sm"
                    />
                    <input
                      type="color"
                      value={getCurrentTextStyles().fontColor}
                      onChange={(e) => updateCurrentTextStyles({ fontColor: e.target.value })}
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
                        getCurrentTextStyles().textAlign === "left"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentTextStyles({ textAlign: "left" })}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex h-10 flex-1 items-center justify-center rounded border ${
                        getCurrentTextStyles().textAlign === "center"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentTextStyles({ textAlign: "center" })}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex h-10 flex-1 items-center justify-center rounded border ${
                        getCurrentTextStyles().textAlign === "right"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => updateCurrentTextStyles({ textAlign: "right" })}
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
                        value={getCurrentTextStyles().lineHeight}
                        onValueChange={(value) => updateCurrentTextStyles({ lineHeight: value })}
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
                        value={getCurrentTextStyles().letterSpacing}
                        onValueChange={(value) => updateCurrentTextStyles({ letterSpacing: value })}
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
          {selectedElement === "button" && (
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
                        value={buttonStyles.fillColor}
                        onChange={(e) => updateButtonStyles({ fillColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={buttonStyles.fillColor}
                        onChange={(e) => updateButtonStyles({ fillColor: e.target.value })}
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
                        value={buttonStyles.borderColor}
                        onChange={(e) => updateButtonStyles({ borderColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={buttonStyles.borderColor}
                        onChange={(e) => updateButtonStyles({ borderColor: e.target.value })}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Border Width */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Border width</label>
                    <Select
                      value={buttonStyles.borderWidth}
                      onValueChange={(value) => updateButtonStyles({ borderWidth: value })}
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
                      value={buttonStyles.borderRadius}
                      onValueChange={(value) => updateButtonStyles({ borderRadius: value })}
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
                          value={buttonStyles.height}
                          onValueChange={(value) => updateButtonStyles({ height: value })}
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
                          value={buttonStyles.width}
                          onValueChange={(value) => updateButtonStyles({ width: value })}
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
                        value={buttonStyles.fontFamily}
                        onValueChange={(value) => updateButtonStyles({ fontFamily: value })}
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
                        value={buttonStyles.fontWeight}
                        onValueChange={(value) => updateButtonStyles({ fontWeight: value })}
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
                      value={buttonStyles.fontSize}
                      onValueChange={(value) => updateButtonStyles({ fontSize: value })}
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
                        value={buttonStyles.fontColor}
                        onChange={(e) => updateButtonStyles({ fontColor: e.target.value })}
                        className="flex-1 text-sm"
                      />
                      <input
                        type="color"
                        value={buttonStyles.fontColor}
                        onChange={(e) => updateButtonStyles({ fontColor: e.target.value })}
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
                          buttonStyles.textAlign === "left"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateButtonStyles({ textAlign: "left" })}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          buttonStyles.textAlign === "center"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateButtonStyles({ textAlign: "center" })}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        className={`flex h-10 flex-1 items-center justify-center rounded border ${
                          buttonStyles.textAlign === "right"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => updateButtonStyles({ textAlign: "right" })}
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
                          value={buttonStyles.lineHeight}
                          onValueChange={(value) => updateButtonStyles({ lineHeight: value })}
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
                          value={buttonStyles.letterSpacing}
                          onValueChange={(value) => updateButtonStyles({ letterSpacing: value })}
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

          {/* Image Editor Panel */}
          {selectedElement === "image" && (
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
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Image Sizing */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image sizing</label>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">
                        {imageStyles.position === "top" || imageStyles.position === "bottom"
                          ? "Height (%)"
                          : "Width (%)"}
                      </label>
                      <Select
                        value={
                          imageStyles.position === "top" || imageStyles.position === "bottom"
                            ? imageStyles.height
                            : imageStyles.width
                        }
                        onValueChange={(value) =>
                          imageStyles.position === "top" || imageStyles.position === "bottom"
                            ? updateImageStyles({ height: value })
                            : updateImageStyles({ width: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25">25%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="40">40%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="60">60%</SelectItem>
                          <SelectItem value="70">70%</SelectItem>
                          <SelectItem value="75">75%</SelectItem>
                          <SelectItem value="100">100%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Image Position */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Image position</label>
                  <Select
                    value={imageStyles.position}
                    onValueChange={(value: "left" | "right" | "top" | "bottom") =>
                      updateImageStyles({ position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
