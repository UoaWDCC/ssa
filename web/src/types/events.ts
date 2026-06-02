// Matches the columns Payload CMS creates in the 'events' PostgreSQL table.
// Column names are snake_case because that's what Payload stores in the database.
export type Event = {
  id: number
  title: string
  date: string
  description: string | null
  // ID of the related media row (the actual image object is in the 'media' table)
  cover_image_id: number | null
  category: 'games' | 'community' | 'food' | 'agm' | 'all' | null
  is_upcoming: boolean | null
  updated_at: string
  created_at: string
}
