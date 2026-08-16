import { notFound } from 'next/navigation'

import GalleryGrid from '@/app/events/components/GalleryGrid'
import type { Event } from '@/types/events'

interface GalleryPageProps {
  params: Promise<{ slug: string }>
}

async function fetchEvent(eventId: number) {
  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, '')
  if (!cmsUrl) throw new Error('CMS_URL is not configured')

  const response = await fetch(`${cmsUrl}/api/events/${eventId}?depth=1`, {
    cache: 'no-store',
  })

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Event request failed: ${response.status}`)
  }

  return response.json() as Promise<Event>
}

function resolveMediaUrl(url: string, cmsUrl: string) {
  if (/^https?:\/\//.test(url)) return url

  const publicCmsUrl = process.env.NEXT_PUBLIC_CMS_URL
  const baseUrl =
    publicCmsUrl ?? (process.env.NODE_ENV === 'production' ? null : cmsUrl)

  return baseUrl
    ? new URL(url, `${baseUrl.replace(/\/$/, '')}/`).toString()
    : url
}

function formatEventDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-NZ', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Pacific/Auckland',
  }).format(date)
}

export default async function EventGalleryPage({
  params,
}: Readonly<GalleryPageProps>) {
  const { slug } = await params
  const eventId = Number(slug)

  if (!Number.isInteger(eventId) || eventId <= 0) notFound()

  const event = await fetchEvent(eventId)
  if (!event || event.isUpcoming !== false) notFound()

  const cmsUrl = process.env.CMS_URL?.replace(/\/$/, '')
  if (!cmsUrl) throw new Error('CMS_URL is not configured')

  const images = (event.images ?? []).flatMap((row, index) => {
    const media = typeof row.image === 'object' ? row.image : null
    if (!media?.url) return []

    return [
      {
        id: row.id ?? `${media.id}-${index}`,
        url: resolveMediaUrl(media.url, cmsUrl),
        alt: media.alt?.trim() || `${event.title} photo ${index + 1}`,
      },
    ]
  })

  const eventDate = formatEventDate(event.date)

  return (
    <main className="min-h-[60vh] bg-ssa-yellow-light">
      <div className="px-6 pt-16 text-center text-ssa-black">
        <h1 className="font-averia text-3xl font-bold capitalize sm:text-4xl">
          {event.title}
        </h1>
      </div>

      {images.length > 0 ? (
        <GalleryGrid
          images={images}
          eventTitle={event.title}
          eventDate={eventDate}
        />
      ) : (
        <section className="px-6 py-20 text-center text-ssa-black/60 md:py-32">
          <p className="font-inter text-base">
            No photos have been added for this event yet.
          </p>
        </section>
      )}
    </main>
  )
}
