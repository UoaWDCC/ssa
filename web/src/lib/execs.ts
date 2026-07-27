'use server'

import { Media } from '@/types/payload-types'
const CMS_URL = process.env.CMS_URL

export interface Exec {
  id: number
  name: string
  role: string
  photo?: (number | null) | Media
  bio?: string | null
  year?: number | null
  updatedAt: string
  createdAt: string
}

export async function fetchExecs(): Promise<Exec[]> {
  const res = await fetch(`${CMS_URL}/api/execs`, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data as Exec[]
}
