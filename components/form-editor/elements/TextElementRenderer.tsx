"use client"

import { TextElement } from "@/types/form-elements"

interface TextElementRendererProps {
  element: TextElement
  isSelected: boolean
  isEditing: boolean
  onClick: () => void
  onContentChange: (content: string) => void
  onFinishEditing: () => void
}

export function TextElementRenderer({
  element,
  isSelected,
  isEditing,
  onClick,
  onContentChange,
  onFinishEditing,
}: TextElementRendererProps) {
  return (
    <div
      className={`cursor-pointer rounded border-2 p-4 ${
        isSelected ? "border-blue-500" : "border-transparent"
      }`}
      onClick={onClick}
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={element.content}
          onChange={(e) => {
            onContentChange(e.target.value)
            // Auto-resize textarea
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          onBlur={onFinishEditing}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onFinishEditing()
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
  )
}
