export interface ExecMedia {
  id: number
  url: string | null
  alt: string
  width: number | null
  height: number | null
}

export interface Exec {
  id: number
  name: string
  role: string
  photo: ExecMedia | null
  bio: string | null
  year: number | null
  updatedAt: string
  createdAt: string
}

export interface ExecsResponse {
  docs: Exec[]
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
