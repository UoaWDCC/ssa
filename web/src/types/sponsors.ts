// Matches the columns Payload CMS creates in the 'sponsors' PostgreSQL table.
// Column names are snake_case because that's what Payload stores in the database.
export type SponsorLogo = {
  url: string | null
  alt: string | null
}

export type Sponsor = {
  id: number
  name: string
  // ID of the related media row (the actual logo is in the 'media' table)
  logo_id: number | null
  // Joined from the 'media' table via logo_id foreign key
  logo?: SponsorLogo | null
  website_url: string | null
  is_sponsor_of_the_week: boolean | null
  description: string | null
  location: string | null
  member_perks: string | null
  updated_at: string
  created_at: string
}
