import type { Metadata } from 'next'
import {
  Geist,
  Geist_Mono,
  Inter,
  Poppins,
  Manrope,
  Playfair_Display,
  Merriweather,
  JetBrains_Mono,
  Bebas_Neue,
  Abril_Fatface
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

// Sans-Serif Fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-manrope"
});

// Serif Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair"
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather"
});

// Monospace Font
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-jetbrains"
});

// Display Fonts
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas"
});

const abril = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abril"
});

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${_geist.variable}
          ${_geistMono.variable}
          ${inter.variable}
          ${poppins.variable}
          ${manrope.variable}
          ${playfair.variable}
          ${merriweather.variable}
          ${jetbrains.variable}
          ${bebas.variable}
          ${abril.variable}
          font-sans antialiased
        `}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
