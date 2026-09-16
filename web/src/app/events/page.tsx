'use client'

import { FaClock, FaLocationDot } from 'react-icons/fa6'

import Footer from '@/components/Footer'
import HeroSplit from '@/components/HeroSplit'
import { HighlightCard } from '@/components/HighlightCard'
import { formatEventDate } from '@/lib/eventDate'
import { resolveMediaUrl } from '@/lib/media'
import type { UpcomingEventResponse } from '@/types/events'

import PastEventsSection from './_components/PastEventsSection'
import { useQuery } from '@tanstack/react-query'

async function fetchUpcomingEvent() {
  const response = await fetch('/api/events/upcoming')

  if (!response.ok) {
    throw new Error(`Upcoming Event request failed: ${response.status}`)
  }

  return response.json() as Promise<UpcomingEventResponse>
}

export default function EventsPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['upcoming-event'],
    queryFn: fetchUpcomingEvent,
  })
  const event = data?.event
  const coverImage =
    event?.coverImage && typeof event.coverImage === 'object'
      ? event.coverImage
      : null

  return (
    <main className="flex flex-col gap-10 bg-ssa-background text-ssa-grey md:gap-14 lg:gap-[121px]">
      <HeroSplit
        title="EVENTS"
        subtitle="Join us for exciting events, cultural celebrations, and community gatherings throughout the year."
      />

      <section className="px-[21px] md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1250px] flex-col gap-5 md:gap-8">
          {isPending ? (
            <p role="status">Loading the upcoming event…</p>
          ) : isError ? (
            <p role="alert">
              We couldn’t load the upcoming event. Please try again later.
            </p>
          ) : !event ? (
            <p>No upcoming events right now. Check back soon!</p>
          ) : (
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
              imageSrc={resolveMediaUrl(coverImage?.url) || '/merlion_logo.png'}
              imageAlt={
                coverImage?.url
                  ? coverImage.alt || `${event.title} event artwork`
                  : 'SSA Merlion mascot'
              }
            />
          )}
        </div>
      </section>

      <PastEventsSection />
      <Footer />
    </main>
  )
}
