// Matches the columns Payload CMS creates in the 'events' PostgreSQL table.
// Column names are snake_case because that's what Payload stores in the database.

export type EventCoverImage = {
  url: string | null
  alt: string | null
}

export type Event = {
  id: number
  title: string
  date: string
  description: string | null
  // Joined from the 'media' table via cover_image_id foreign key
  cover_image: EventCoverImage | null
  category: 'games' | 'community' | 'food' | 'agm' | 'all' | null
  is_upcoming: boolean | null
  updated_at: string
  created_at: string
}
