'use server'

import type { Media } from '@/types/payload-types'
const CMS_URL = process.env.CMS_URL

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
  const res = await fetch(`${CMS_URL}/api/sponsors?depth=2`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as {
    docs: Array<
      Omit<Sponsor, 'logo'> & { logo: number | Record<string, unknown> }
    >
  }
  return data.docs.map((sponsor) => {
    if (typeof sponsor.logo === 'number') return sponsor as Sponsor

    const logo = sponsor.logo as {
      id: number
      alt: string
      url?: string | null
      width?: number | null
      height?: number | null
    }

    return {
      ...sponsor,
      logo: {
        id: logo.id,
        alt: logo.alt,
        url: resolveMediaUrl(logo.url),
        width: logo.width ?? null,
        height: logo.height ?? null,
      },
    }
  }) as Sponsor[]
}
