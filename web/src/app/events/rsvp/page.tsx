'use client'

import RsvpForm from './_components/RsvpForm'
import { UpcomingEventResponse } from '@/types/events'
import { useQuery } from '@tanstack/react-query'

async function fetchUpcomingEvent() {
  const response = await fetch('/api/events/upcoming')

  if (!response.ok) {
    throw new Error(`Upcoming Event request failed: ${response.status}`)
  }

  return response.json() as Promise<UpcomingEventResponse>
}

export default function IceKachangRsvpPage() {
  const { data } = useQuery({
    queryKey: ['upcoming-event'],
    queryFn: fetchUpcomingEvent,
  })

  return (
    <main className="min-h-[calc(100vh-88px)] bg-ssa-background font-inter text-ssa-grey">
      <div className="mx-auto w-full max-w-[1250px] px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-0">
        <div className="grid items-stretch gap-10 lg:grid-cols-[15.5rem_1px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[18rem_1px_minmax(0,1fr)] xl:gap-12">
          <aside aria-labelledby="rsvp-title" className="lg:min-h-[520px]">
            <h1
              id="rsvp-title"
              className="font-be-vietnam-pro text-[clamp(2.5rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.05em] text-ssa-red"
            >
              RSVP
            </h1>
            <p className="mt-4 max-w-[30ch] text-base leading-6">
              {data?.event?.description ||
                'No description available for this event.'}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:mt-16 lg:grid-cols-1">
              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Event name
                </dt>
                <dd className="mt-1 text-base leading-6">
                  {data?.event?.title || 'No Title'}
                </dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Date
                </dt>
                <dd className="mt-1 text-base leading-6">
                  <time dateTime="2026-04-02T18:00:00+13:00">
                    {data?.event?.date || 'No Date'} -{' '}
                    {data?.event?.time || 'No Time'}
                  </time>
                </dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Location
                </dt>
                <dd className="mt-1 max-w-[30ch] text-base leading-6">
                  {data?.event?.location || 'No Location'}
                </dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Price
                </dt>
                <dd className="mt-1 grid max-w-[14rem] grid-cols-[1fr_auto] gap-x-6 text-base leading-6">
                  <span>Member</span>
                  <span>
                    {data?.event?.memberPrice == null
                      ? '—'
                      : `$${data.event.memberPrice}`}
                  </span>
                  <span>Non-member</span>
                  <span>
                    {data?.event?.nonMemberPrice == null
                      ? '—'
                      : `$${data.event.nonMemberPrice}`}
                  </span>
                </dd>
              </div>
            </dl>
          </aside>

          <div aria-hidden="true" className="hidden bg-[#e9e1d5] lg:block" />

          <RsvpForm eventId={data?.event?.id} />
        </div>
      </div>
    </main>
  )
}
