import { Media } from './payload-types'

export type EventCategory =
  | 'social'
  | 'cultural'
  | 'academic'
  | 'sports'
  | 'other'

export interface EventImage {
  id: string | null
  image: Media
}

export interface Event {
  id: number
  title: string
  date: string
  description: string | null
  coverImage: Media | null
  category: EventCategory | null
  isUpcoming: boolean | null
  images: EventImage[] | null
  updatedAt: string
  createdAt: string
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
