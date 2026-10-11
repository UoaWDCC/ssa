import { fetchFromCMS } from '@/lib/api'
import type { Event } from '@/types/events'

type PayloadListResponse<T> = {
  docs: T[]
}

export async function GET() {
  let data: PayloadListResponse<Event>

  try {
    data = await fetchFromCMS<PayloadListResponse<Event>>(
      '/events?depth=1&limit=0&sort=-date&where[isUpcoming][equals]=false',
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach CMS'
    return Response.json({ error: message }, { status: 502 })
  }

  return Response.json({ events: data.docs })
}
