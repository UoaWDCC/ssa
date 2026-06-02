'use client'

import { useMemo, useState } from 'react'
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6'
import { usePastEvents } from '@/hooks/useEvents'
import type { Event } from '@/types/events'
import PastEventCard from './PastEventCard'
import {
  CATEGORY_TO_TAG,
  EVENT_FILTERS,
  type EventFilter,
  type PastEvent,
} from './pastEventsData'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

// Maps a Supabase Event row to the shape PastEventCard expects
function toPastEvent(event: Event): PastEvent {
  const tag = event.category ? CATEGORY_TO_TAG[event.category] : undefined
  return {
    slug: String(event.id),
    name: event.title,
    location: '',
    date: event.date,
    thumbnail: event.cover_image?.url ?? '/carousel_one.jpg',
    thumbnailAlt: event.cover_image?.alt ?? event.title,
    tags: tag ? [tag] : [],
  }
}

export default function PastEventsSection() {
  const { data: rawEvents, isLoading, isError } = usePastEvents()

  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<EventFilter>('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const handleFilterChange = (next: EventFilter) => {
    setActiveFilter(next)
    setVisibleCount(INITIAL_VISIBLE)
  }

  // Convert Supabase rows to the PastEvent shape once, then filter
  const pastEvents = useMemo(
    () => (rawEvents ?? []).map(toPastEvent),
    [rawEvents],
  )

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pastEvents.filter((event) => {
      const matchesFilter =
        activeFilter === 'All' || event.tags.includes(activeFilter)
      if (!matchesFilter) return false
      if (!q) return true
      return event.name.toLowerCase().includes(q)
    })
  }, [pastEvents, query, activeFilter])

  const visibleEvents = filteredEvents.slice(0, visibleCount)
  const hasMore = visibleCount < filteredEvents.length

  return (
    <section className="px-8 sm:px-14 md:px-20 lg:px-[6.5rem] py-8 sm:py-10 md:py-12">
      <h2 className="font-averia font-bold text-ssa-black text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
        Past Events
      </h2>

      {/* Search bar */}
      <label className="relative block">
        <span className="sr-only">Search events</span>
        <FaMagnifyingGlass
          className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ssa-black/40"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search event..."
          className="w-full rounded-full border border-ssa-black/20 bg-ssa-white py-3 pl-12 pr-5 font-averia text-base text-ssa-black placeholder:text-ssa-black/40 focus:border-ssa-red focus:outline-none focus:ring-2 focus:ring-ssa-red/30"
        />
      </label>

      {/* Filter chips */}
      <div
        role="group"
        aria-label="Filter past events by category"
        className="mt-5 flex flex-wrap gap-3"
      >
        {EVENT_FILTERS.map((filter) => {
          const isActive = activeFilter === filter
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleFilterChange(filter)}
              className={`rounded-full px-10 py-3 font-averia text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-ssa-red text-white'
                  : 'bg-ssa-yellow text-ssa-black/60 hover:bg-ssa-red-lighter hover:text-ssa-red'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {isError && (
        <p className="mt-8 text-center font-averia text-ssa-black/60">
          Failed to load events. Please try again later.
        </p>
      )}

      {/* Show skeleton cards while loading */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: INITIAL_VISIBLE }, (_, i) => (
              <div
                key={`skeleton-${String(i)}`}
                className="aspect-[5/6] w-full animate-pulse rounded-2xl bg-gray-200"
              />
            ))
          : visibleEvents.map((event) => (
              <PastEventCard key={event.slug} event={event} />
            ))}
      </div>

      {!isLoading && filteredEvents.length === 0 && (
        <p className="mt-10 text-center font-averia text-ssa-black/60">
          No events match your search.
        </p>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
            className="inline-flex items-center gap-2 rounded-full bg-ssa-red-lighter px-8 py-3 font-averia text-base font-bold text-ssa-black transition-colors hover:bg-ssa-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2"
          >
            View More
            <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
