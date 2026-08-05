import type { Metadata } from 'next'
import {
  Geist,
  Geist_Mono,
  Averia_Serif_Libre,
  Alegreya,
  Be_Vietnam_Pro,
  Inter,
} from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { QueryProvider } from '@/providers/QueryProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const averiaSerif = Averia_Serif_Libre({
  variable: '--font-averia',
  subsets: ['latin'],
  weight: ['300', '700'],
})

const alegreya = Alegreya({
  variable: '--font-alegreya',
  subsets: ['latin'],
  weight: ['500'],
})

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// "I - Paragraph Text" in Figma — body copy across the UI overhaul.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "SSA | Singaporean Students' Association",
  description: "SSA | Singaporean Students' Association",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${averiaSerif.variable} ${alegreya.variable} ${beVietnamPro.variable} ${inter.variable} antialiased`}
        style={{ paddingTop: '88px' }}
      >
        <Navbar />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
