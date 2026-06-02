export interface SponsorMedia {
  id: number
  url: string | null
  alt: string
  width: number | null
  height: number | null
}

export interface Sponsor {
  id: number
  name: string
  logo: SponsorMedia
  websiteUrl: string | null
  isSponsorOfTheWeek: boolean | null
  description: string | null
  location: string | null
  memberPerks: string | null
  updatedAt: string
  createdAt: string
}

export interface SponsorsResponse {
  docs: Sponsor[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
