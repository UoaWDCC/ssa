'use server'

import type { Media } from '@/types/payload-types'
const CMS_URL = process.env.CMS_URL

export type SponsorCategory = 'FOOD' | 'RETAIL' | 'SERVICES' | 'ENTERTAINMENT'

export interface Sponsor {
  id: number
  name: string
  logo: number | Media
  category?: SponsorCategory | null
  websiteUrl?: string | null
  isSponsorOfTheWeek?: boolean | null
  description?: string | null
  location?: string | null
  memberPerks?: string | null
  updatedAt: string
  createdAt: string
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  if (CMS_URL === undefined) {
    return []
  }

  try {
    const res = await fetch(`${CMS_URL}/api/sponsors?depth=2&limit=100`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.docs as Sponsor[]
  } catch {
    return []
  }
}
