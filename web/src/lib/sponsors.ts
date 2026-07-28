'use server'

import type { Media } from '@/types/payload-types'

const CMS_URL = process.env.CMS_URL

export interface Sponsor {
  id: number
  name: string
  logo: Media
  websiteUrl?: string | null
  isSponsorOfTheWeek?: boolean | null
  description?: string | null
  location?: string | null
  memberPerks?: string | null
  updatedAt: string
  createdAt: string
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  if (!CMS_URL) {
    throw new Error('CMS_URL is not configured')
  }

  const res = await fetch(`${CMS_URL}/api/sponsors`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs as Sponsor[]
}
