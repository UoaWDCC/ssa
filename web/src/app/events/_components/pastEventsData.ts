export type PastEventTag = 'Games' | 'Community' | 'Food' | 'AGM'

export type EventFilter = 'All' | PastEventTag

export type PastEvent = {
  slug: string
  name: string
  location: string
  /** ISO date string (YYYY-MM-DD) for the event date. */
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

// replace with CMS data once the events endpoint is available.
export const pastEvents: PastEvent[] = [
  {
    slug: 'satay-by-the-park-march-2026',
    name: 'Satay By The Park',
    location: 'Outhwaite Park',
    date: '2026-03-06',
    thumbnail: '/events/past/satay-by-the-park.png',
    thumbnailAlt:
      'Satay By The Park event poster featuring the SSA Merlion mascot at a picnic',
    tags: ['Community'],
  },
  {
    slug: 'ssa-freshers-night-march-2026',
    name: 'SSA Freshers Night',
    location: 'UOA Quad',
    date: '2026-03-12',
    thumbnail: '/events/past/ssa-freshers-night.png',
    thumbnailAlt:
      'SSA Freshers Night event poster featuring the SSA Merlion mascot and University clock tower',
    tags: ['Games', 'Community'],
  },
  {
    slug: 'ssa-ice-kachang-night-april-2026',
    name: 'SSA ICE KACHANG NIGHT',
    location: '401-318 Engineering Atrium (Level 3)',
    date: '2026-04-02',
    thumbnail: '/events/past/ssa-ice-kachang-night.png',
    thumbnailAlt:
      'SSA Ice Kachang Night event poster featuring the SSA Merlion mascot and ice kachang',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'ssa-quiz-night-may-2026',
    name: 'SSA Quiz Night',
    location: '119-130 (Clock Tower East)',
    date: '2026-05-01',
    thumbnail: '/events/past/ssa-quiz-night.png',
    thumbnailAlt:
      'SSA Quiz Night event poster featuring the SSA Merlion mascot in pixel-art styling',
    tags: ['Games', 'Community'],
  },
  {
    slug: 'ssa-pool-night-may-2026',
    name: 'SSA Pool Night',
    location: 'Afterlife Billiards (520 Queen Street)',
    date: '2026-05-15',
    thumbnail: '/events/past/ssa-pool-night.png',
    thumbnailAlt:
      'SSA Pool Night event poster featuring billiard balls and the SSA Merlion mascot',
    tags: ['Games', 'Community'],
  },
  {
    slug: 'ssa-camp-may-2026',
    name: 'SSA Camp',
    location: 'Hahei Resort, Coromandel',
    date: '2026-05-15',
    thumbnail: '/events/past/ssa-camp.png',
    thumbnailAlt:
      'SSA Camp event poster featuring two SSA Merlion mascots around a campfire',
    tags: ['Community'],
  },
]
