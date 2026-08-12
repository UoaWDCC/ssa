import { fetchFromCMS } from '@/lib/api'

type PayloadMedia = {
  id: number
  updatedAt: string
  url?: string | null
}

type PayloadExec = {
  id: number
  name: string
  role: string
  photo?: number | PayloadMedia | null
}

type PayloadListResponse<T> = {
  docs: T[]
}

function isPayloadMedia(photo: PayloadExec['photo']): photo is PayloadMedia {
  return typeof photo === 'object' && photo !== null
}

export async function GET() {
  const currentYear = new Date().getFullYear()
  let data: PayloadListResponse<PayloadExec>
  try {
    data = await fetchFromCMS<PayloadListResponse<PayloadExec>>(
      `/execs?depth=1&limit=100&sort=id&where[year][equals]=${currentYear}`,
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach CMS'
    return Response.json({ error: message }, { status: 502 })
  }

  const execs = data.docs.map((exec) => {
    const photo = isPayloadMedia(exec.photo) ? exec.photo : null
    const updatedAt = photo?.updatedAt ? Date.parse(photo.updatedAt) : NaN
    const version = Number.isNaN(updatedAt) ? '' : `-${updatedAt}`

    return {
      id: exec.id,
      name: exec.name,
      role: exec.role,
      photo:
        photo?.url && photo.id
          ? `/api/about-us/images/${photo.id}${version}`
          : null,
    }
  })

  return Response.json({ execs })
}
