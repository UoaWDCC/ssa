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

// TODO: replace with CMS data once the events endpoint is available.
export const pastEvents: PastEvent[] = [
  {
    slug: 'satay-by-the-quad-march-2026',
    name: 'Satay by the Quad',
    location: 'Outhwaite Park',
    date: '2026-03-11',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Students gathered at Outhwaite Park for Satay by the Quad',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'junior-comms-april-2025',
    name: 'Junior Comms',
    location: 'UOA OGGB',
    date: '2025-04-10',
    thumbnail: '/carousel_two.jpg',
    thumbnailAlt: 'Members posing together at Junior Comms event',
    tags: ['Food', 'Games'],
  },
  {
    slug: 'satay-by-the-quad-march-2026-2',
    name: 'Satay by the Quad',
    location: 'Outhwaite Park',
    date: '2026-03-11',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Students enjoying satay together on the quad lawn',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'satay-by-the-quad-march-2026-3',
    name: 'Satay by the Quad',
    location: 'Outhwaite Park',
    date: '2026-03-11',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Group photo of students at Satay by the Quad',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'satay-by-the-quad-march-2026-4',
    name: 'Satay by the Quad',
    location: 'Outhwaite Park',
    date: '2026-03-11',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Attendees mingling at Satay by the Quad',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'satay-by-the-quad-march-2026-5',
    name: 'Satay by the Quad',
    location: 'Outhwaite Park',
    date: '2026-03-11',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Friends sharing food at Satay by the Quad',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'ice-kachang-night-2025',
    name: 'Ice Kachang Night',
    location: 'UOA Engineering',
    date: '2025-07-13',
    thumbnail: '/carousel_two.jpg',
    thumbnailAlt: 'Students enjoying ice kachang at UOA Engineering',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'ssa-x-vausa-mid-autumn-2025',
    name: 'SSA X VAUSA Mid-Autumn Festival',
    location: 'UOA Engineering',
    date: '2025-08-13',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'Group photo at SSA X VAUSA Mid-Autumn Festival',
    tags: ['Food', 'Community'],
  },
  {
    slug: 'ssa-camp-2025',
    name: 'SSA Camp',
    location: 'Camp Somewhere',
    date: '2025-11-21',
    thumbnail: '/carousel_two.jpg',
    thumbnailAlt: 'SSA Camp group photo with banner',
    tags: ['Community', 'Games'],
  },
  {
    slug: 'agm-2025',
    name: 'Annual General Meeting',
    location: 'UOA OGGB',
    date: '2025-09-15',
    thumbnail: '/carousel_one.jpg',
    thumbnailAlt: 'SSA members at the Annual General Meeting',
    tags: ['AGM', 'Community'],
  },
  {
    slug: 'games-night-2025',
    name: 'Games Night',
    location: 'UOA Recreation Centre',
    date: '2025-06-05',
    thumbnail: '/carousel_two.jpg',
    thumbnailAlt: 'Students playing board games at SSA Games Night',
    tags: ['Games', 'Community'],
  },
]
