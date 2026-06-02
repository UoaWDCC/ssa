// Matches the columns Payload CMS creates in the 'execs' PostgreSQL table.
// Column names are snake_case because that's what Payload stores in the database.

export type ExecPhoto = {
  url: string | null
  alt: string | null
}

export type Exec = {
  id: number
  name: string
  role: string
  // Joined from the 'media' table via photo_id foreign key
  photo: ExecPhoto | null
  bio: string | null
  // Academic year this exec served (e.g. 2024)
  year: number | null
  updated_at: string
  created_at: string
}
