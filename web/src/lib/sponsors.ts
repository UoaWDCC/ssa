import type { Media } from '@/types/payload-types'
import { fetchFromCMS } from './api.ts'

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

export function getSponsorLogoUrl(logo: Sponsor['logo']): string {
  if (typeof logo === 'number') {
    return '/sponsors/sponsorcard.png'
  }

  return logo?.url || '/sponsors/sponsorcard.png'
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  try {
    const data = await fetchFromCMS<{ docs: Sponsor[] }>(
      '/sponsors?depth=2&limit=100',
      { cache: 'no-store' },
    )
    return data.docs
  } catch (error) {
    console.error('Failed to fetch sponsors from CMS:', error)
    return []
  }
}
