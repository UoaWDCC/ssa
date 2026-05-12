'use client'

import { useMemo, useState } from 'react'
import ArrowRightIcon from './ArrowRightIcon'
import PastEventCard from './PastEventCard'
import { EVENT_FILTERS, pastEvents, type EventFilter } from './pastEventsData'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

export default function PastEventsSection() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<EventFilter>('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  // Track which filter+query the current `visibleCount` belongs to so we can
  // reset pagination when the user changes the search input or filter.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const filterKey = `${activeFilter}|${query.trim().toLowerCase()}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase()
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
  }, [query, activeFilter])

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ssa-black/40"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search event..."
          className="w-full rounded-full border border-ssa-black/20 bg-ssa-white py-3 pl-12 pr-5 font-averia text-base text-ssa-black placeholder:text-ssa-black/40 focus:border-ssa-red focus:outline-none focus:ring-2 focus:ring-ssa-red/30"
        />
      </label>

      {/* Filter chips */}
      <div
        role="radiogroup"
        aria-label="Filter past events by category"
        className="mt-5 flex flex-wrap gap-3"
      >
        {EVENT_FILTERS.map((filter) => {
          const isActive = activeFilter === filter
          return (
            <button
              key={filter}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-1.5 font-averia text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-ssa-red text-white'
                  : 'bg-ssa-red-lighter text-ssa-red hover:bg-ssa-red-light hover:text-white'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <PastEventCard key={event.slug} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
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
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </section>
  )
}
