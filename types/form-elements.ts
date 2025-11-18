export type ElementType = "text" | "button" | "field" | "image" | null

export interface TextElement {
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

export interface ButtonElement {
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

export interface FieldElement {
  id: string
  elementType: "field"
  type: "text" | "email" | "checkbox" | "multiple-choice" | "rating" | "long-text"
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
  // Multiple choice specific
  multipleChoiceType?: "radio" | "checkbox"
  options?: string[]
  // Rating specific
  maxRating?: number
  starColor?: string
  // Long text specific
  rows?: number
}

export interface ImageElement {
  id: string
  elementType: "image"
  url: string
  alt: string
  width: string
  height: string
  borderRadius: string
  position: "inline" | "left" | "right" | "top" | "bottom" | "background" | "none"
  opacity?: string
}

export type FormElement = TextElement | ButtonElement | FieldElement | ImageElement

export interface FormBackground {
  type: "color" | "gradient" | "image"
  color: string
  gradientFrom: string
  gradientTo: string
  gradientDirection: "to bottom" | "to top" | "to right" | "to left" | "to bottom right"
  imageUrl: string
  imageOpacity: string
}

export type ActiveTab = "fields" | "style" | "font"
