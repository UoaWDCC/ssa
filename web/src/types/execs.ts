// Matches the columns Payload CMS creates in the 'execs' PostgreSQL table.
// Column names are snake_case because that's what Payload stores in the database.
export type Exec = {
  id: number
  name: string
  role: string
  // ID of the related media row (the actual image is in the 'media' table)
  photo_id: number | null
  bio: string | null
  // Academic year this exec served (e.g. 2024)
  year: number | null
  updated_at: string
  created_at: string
}
