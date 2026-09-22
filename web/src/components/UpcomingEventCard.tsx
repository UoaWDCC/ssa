'use client'

import { useQuery } from '@tanstack/react-query'
import { FaClock, FaLocationDot } from 'react-icons/fa6'

import { HighlightCard } from '@/components/HighlightCard'
import { formatEventDate } from '@/lib/eventDate'
import { resolveMediaUrl } from '@/lib/media'
import type { Event, UpcomingEventResponse } from '@/types/events'

async function fetchUpcomingEvent(): Promise<UpcomingEventResponse> {
  const response = await fetch('/api/events/upcoming')

  if (!response.ok) {
    throw new Error(`Upcoming Event request failed: ${response.status}`)
  }

  return response.json() as Promise<UpcomingEventResponse>
}

// Default content retained from the existing Ice Kachang card.
// CMS content replaces this when an upcoming event is available.
const fallbackEvent: Event = {
  id: 0,
  title: 'Ice Kachang',
  date: '2026-04-02',
  time: '2026-04-02T18:00:00',
  location: '401-318 Engineering Atrium (Level 3)',
  memberPrice: 5,
  nonMemberPrice: 11,
  description:
    "Hot, stressed and over Uni already? Say less... we've got the perfect cooldown for you. Come chill with SSA at our Ice Kachang Night. Sweet, icy, colourful... but there's a twist 👀",
  coverImage: null,
  isUpcoming: true,
  updatedAt: '',
  createdAt: '',
}

export default function UpcomingEventCard() {
  const { data } = useQuery({
    queryKey: ['upcoming-event'],
    queryFn: fetchUpcomingEvent,
  })

  // Use the CMS event when available; otherwise retain Ice Kachang.
  const event = data?.event ?? fallbackEvent

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
        ...(event.memberPrice == null
          ? []
          : [`$${event.memberPrice} MEMBERS`]),
        ...(event.nonMemberPrice == null
          ? []
          : [
              {
                text: `$${event.nonMemberPrice} NON-MEMBERS`,
                variant: 'light' as const,
              },
            ]),
      ]}
      description={
        <p>{event.description || 'More details coming soon.'}</p>
      }
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