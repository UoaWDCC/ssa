'use server'

import type { Media } from '@/types/payload-types'
const CMS_URL = process.env.CMS_URL

// Might need to move this to a utility file if we need to use it in multiple places
function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `${CMS_URL}${url}`
}

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

    const data = await res.json()

    const sponsors = (data.docs as Sponsor[]).map((sponsor) => {
      if (
        sponsor.logo &&
        typeof sponsor.logo === 'object' &&
        sponsor.logo.url
      ) {
        return {
          ...sponsor,
          logo: {
            ...sponsor.logo,
            url: resolveMediaUrl(sponsor.logo.url),
          },
        }
      }
      return sponsor
    })

    return sponsors
  } catch (error) {
    throw new Error(
      `Failed to fetch sponsors: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
