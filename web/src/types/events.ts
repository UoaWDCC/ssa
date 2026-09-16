import type { Media } from './payload-types'

export type EventCategory = 'games' | 'community' | 'food' | 'agm' | 'all'

export interface EventImage {
  id?: string | null
  image: number | Media
}

export interface Event {
  id: number
  title: string
  date: string
  time?: string | null
  location?: string | null
  memberPrice?: number | null
  nonMemberPrice?: number | null
  description?: string | null
  coverImage?: number | Media | null
  category?: EventCategory | null
  isUpcoming?: boolean | null
  images?: EventImage[] | null
  updatedAt: string
  createdAt: string
}

export interface UpcomingEventResponse {
  event: Event | null
}

export interface PastEventsResponse {
  events: Event[]
}

export interface EventsResponse {
  docs: Event[]
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
