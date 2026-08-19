'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import CategoryFilters from '@/components/CategoryFilters'
import SearchBar from '@/components/SearchBar'
import type { Event, EventCategory, PastEventsResponse } from '@/types/events'

import PastEventCard from './PastEventCard'
import {
  EVENT_FILTERS,
  type EventFilter,
  type PastEvent,
  type PastEventTag,
} from './pastEventsData'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

const CATEGORY_LABELS: Partial<Record<EventCategory, PastEventTag>> = {
  games: 'Games',
  community: 'Community',
  food: 'Food',
  agm: 'AGM',
}

async function fetchPastEvents() {
  const response = await fetch('/api/events/past')

  if (!response.ok) {
    throw new Error(`Past Event request failed: ${response.status}`)
  }

  return response.json() as Promise<PastEventsResponse>
}

function resolveMediaUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url

  const baseUrl =
    CMS_URL ??
    (process.env.NODE_ENV === 'production' ? null : 'http://localhost:3001')

  return baseUrl
    ? new URL(url, `${baseUrl.replace(/\/$/, '')}/`).toString()
    : url
}

function toPastEvent(event: Event): PastEvent {
  const coverImage =
    typeof event.coverImage === 'object' ? event.coverImage : null
  const category = event.category ? CATEGORY_LABELS[event.category] : undefined

  return {
    id: event.id,
    name: event.title,
    location: event.location?.trim() || 'Location TBC',
    date: event.date,
    thumbnail:
      resolveMediaUrl(coverImage?.url) ?? '/events/highlight_mascot.png',
    thumbnailAlt: coverImage?.alt?.trim() || `${event.title} event`,
    tags: category ? [category] : [],
  }
}

export default function PastEventsSection() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<EventFilter>('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const { data, isError, isPending } = useQuery({
    queryKey: ['past-events'],
    queryFn: fetchPastEvents,
  })

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const handleFilterChange = (next: EventFilter) => {
    setActiveFilter(next)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pastEvents = data?.events.map(toPastEvent) ?? []

    return pastEvents.filter((event) => {
      const matchesFilter =
        activeFilter === 'All' || event.tags.includes(activeFilter)
      if (!matchesFilter) return false
      if (!q) return true
      return (
        event.name.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q)
      )
    })
  }, [data?.events, query, activeFilter])

  const visibleEvents = filteredEvents.slice(0, visibleCount)
  const hasMore = visibleCount < filteredEvents.length

  return (
    <section className="px-[14px] pb-8 sm:px-14 sm:pb-10 md:px-20 md:pb-12 lg:px-26">
      <div className="mx-auto w-full max-w-[1244px]">
        <h2 className="mb-4 font-be-vietnam-pro text-2xl font-bold tracking-[-1px] text-ssa-red">
          Past Events
        </h2>

        <SearchBar
          value={query}
          onChange={handleQueryChange}
          placeholder="Search Event"
          ariaLabel="Search events"
        />
        <CategoryFilters
          options={EVENT_FILTERS}
          selectedOption={activeFilter}
          onChange={handleFilterChange}
          ariaLabel="Filter past events by category"
          iconlessOption="All"
          className="mt-4"
        />

        {isPending && (
          <p
            role="status"
            className="mt-10 text-center font-inter text-base text-ssa-muted-grey"
          >
            Loading past events…
          </p>
        )}

        {isError && (
          <p
            role="alert"
            className="mt-10 text-center font-inter text-base text-ssa-muted-grey"
          >
            Past events are temporarily unavailable. Please try again later.
          </p>
        )}

        {!isPending && !isError && (
          <div className="mt-14 grid grid-cols-[repeat(2,minmax(0,195px))] items-start justify-center gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {!isPending && !isError && filteredEvents.length > 0 && (
          <div className="mt-14 text-center">
            <p className="font-inter text-base font-normal tracking-[-0.4px] text-ssa-muted-grey">
              Showing {visibleEvents.length} of {filteredEvents.length} results
            </p>

            {hasMore && (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + LOAD_MORE_STEP)
                }
                className="mt-4 font-be-vietnam-pro text-base font-semibold uppercase tracking-[-0.02em] text-ssa-muted-grey transition-colors duration-150 ease-out hover:text-ssa-red focus-visible:outline-none focus-visible:text-ssa-red"
              >
                View More
              </button>
            )}
          </div>
        )}

        {!isPending && !isError && filteredEvents.length === 0 && (
          <p className="mt-10 text-center font-averia text-ssa-black/60">
            No events match your search.
          </p>
        )}
      </div>
    </section>
  )
}
