"use client"

import Link from "next/link"

interface BrandingBadgeProps {
  showBranding: boolean
}

export function BrandingBadge({ showBranding }: BrandingBadgeProps) {
  if (!showBranding) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-200"
      >
        <span>Powered by</span>
        <span className="font-bold text-black">FormBuilder</span>
      </Link>
    </div>
  )
}
