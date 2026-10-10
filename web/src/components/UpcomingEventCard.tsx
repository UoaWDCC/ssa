'use client'

import { useQuery } from '@tanstack/react-query'
import { FaClock, FaLocationDot } from 'react-icons/fa6'

import { HighlightCard } from '@/components/HighlightCard'
import { formatEventDate } from '@/lib/eventDate'
import { resolveMediaUrl } from '@/lib/media'
import type { UpcomingEventResponse } from '@/types/events'

async function fetchUpcomingEvent(): Promise<UpcomingEventResponse> {
  const response = await fetch('/api/events/upcoming')

  if (!response.ok) {
    throw new Error(`Upcoming Event request failed: ${response.status}`)
  }

  return response.json() as Promise<UpcomingEventResponse>
}

export default function UpcomingEventCard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['upcoming-event'],
    queryFn: fetchUpcomingEvent,
  })

  if (isPending || isError || !data?.event) {
    const message = isPending
      ? 'Loading upcoming event...'
      : isError
        ? 'Upcoming event information is unavailable right now.'
        : 'No upcoming events right now.'

    return (
      <div
        className="mx-auto flex min-h-48 w-full max-w-[1250px] items-center justify-center text-center"
        role="status"
      >
        <p className="font-inter text-base font-normal text-ssa-muted-grey">
          {message}
        </p>
      </div>
    )
  }

  const event = data.event

  const coverImage =
    event.coverImage && typeof event.coverImage === 'object'
      ? event.coverImage
      : null

  return (
    <HighlightCard
      eyebrow="Upcoming Event"
      title={event.title}
      details={[
        {
          icon: FaLocationDot,
          text: event.location || 'Location to be confirmed',
        },
        {
          icon: FaClock,
          text: formatEventDate(event.date, event.time),
        },
      ]}
      badges={[
        ...(event.memberPrice == null ? [] : [`$${event.memberPrice} MEMBERS`]),
        ...(event.nonMemberPrice == null
          ? []
          : [
              {
                text: `$${event.nonMemberPrice} NON-MEMBERS`,
                variant: 'light' as const,
              },
            ]),
      ]}
      description={<p>{event.description || 'More details coming soon.'}</p>}
      ctaLabel="RSVP"
      ctaHref="/events/rsvp"
      imageSrc={
        resolveMediaUrl(coverImage?.url) || '/events/highlight_mascot.png'
      }
      imageAlt={
        coverImage?.url
          ? coverImage.alt || `${event.title} event artwork`
          : 'Ice Kachang event artwork'
      }
    />
  )
}
