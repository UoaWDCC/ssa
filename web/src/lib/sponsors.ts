'use server'

import type { Media } from '@/types/payload-types'
const CMS_URL = process.env.CMS_URL

export interface Sponsor {
  id: number
  name: string
  logo: number | Media
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
    throw new Error('CMS_URL is not defined in the environment variables.')
  }

  try {
    const res = await fetch(`${CMS_URL}/api/sponsors?depth=2`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.docs as Sponsor[]
  } catch (error) {
    throw new Error(
      `Failed to fetch sponsors: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
