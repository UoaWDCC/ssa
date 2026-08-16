export type PastEventTag = 'Games' | 'Community' | 'Food' | 'AGM'

export type EventFilter = 'All' | PastEventTag

export type PastEvent = {
  id: number
  slug: string
  name: string
  location: string
  /** ISO date string for the event date. */
  date: string
  thumbnail: string
  thumbnailAlt: string
  tags: PastEventTag[]
}

export const EVENT_FILTERS: EventFilter[] = [
  'All',
  'Community',
  'Games',
  'Food',
  'AGM',
]
