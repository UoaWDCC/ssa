import type { Metadata } from 'next'
import {
  Alegreya,
  Averia_Serif_Libre,
  Be_Vietnam_Pro,
  DM_Mono,
  Geist,
  Geist_Mono,
  Inter,
} from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { QueryProvider } from '@/providers/QueryProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
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

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
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
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${averiaSerif.variable} ${alegreya.variable} ${beVietnamPro.variable} ${dmMono.variable} ${inter.variable} antialiased`}
        style={{ paddingTop: '88px' }}
      >
        <Navbar />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
