// These types and constants are still used by PastEventCard and PastEventsSection.
// The static pastEvents array has been replaced by the usePastEvents hook.

export type PastEventTag = 'Games' | 'Community' | 'Food' | 'AGM'

export type EventFilter = 'All' | PastEventTag

export type PastEvent = {
  slug: string
  name: string
  location: string
  /** ISO date string (YYYY-MM-DD) */
  date: string
  thumbnail: string
  thumbnailAlt: string
  tags: PastEventTag[]
}

export const EVENT_FILTERS: EventFilter[] = [
  'All',
  'Games',
  'Community',
  'Food',
  'AGM',
]

// Maps a single CMS category value to the display tag used on cards.
// 'all' has no equivalent tag so it returns undefined.
export const CATEGORY_TO_TAG: Record<string, PastEventTag | undefined> = {
  games: 'Games',
  community: 'Community',
  food: 'Food',
  agm: 'AGM',
}
