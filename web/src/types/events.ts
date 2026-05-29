export interface EventMedia {
  id: number
  url: string | null
  alt: string
  width: number | null
  height: number | null
}

export type EventCategory =
  | 'social'
  | 'cultural'
  | 'academic'
  | 'sports'
  | 'other'

export interface EventImage {
  id: string | null
  image: EventMedia
}

export interface Event {
  id: number
  title: string
  date: string
  description: string | null
  coverImage: EventMedia | null
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
