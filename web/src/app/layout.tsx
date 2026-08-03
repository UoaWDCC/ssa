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

import { DM_Mono } from 'next/font/google'

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400'],
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-inter-source',
})

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
        className={`${geistSans.variable} ${geistMono.variable} ${averiaSerif.variable} ${alegreya.variable} ${beVietnamPro.variable}  ${inter.variable} ${dmMono.variable} antialiased`}
        style={{ paddingTop: '88px' }}
      >
        <Navbar />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
