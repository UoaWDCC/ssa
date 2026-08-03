'use client'

import { useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import CategoryFilters from '@/components/CategoryFilters'
import SearchBar from '@/components/SearchBar'
import PastEventCard from './PastEventCard'
import { EVENT_FILTERS, pastEvents, type EventFilter } from './pastEventsData'

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

export default function PastEventsSection() {
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
    <section className="px-8 sm:px-14 md:px-20 lg:px-26 py-8 sm:py-10 md:py-12">
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

      {/* Grid */}
      <div className="mt-8 -mx-8 flex gap-5 overflow-x-auto px-8 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 md:gap-8 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <div
            key={event.slug}
            className="w-[82vw] flex-none snap-start sm:w-auto"
          >
            <PastEventCard event={event} />
          </div>
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
            className="inline-flex items-center gap-2 rounded-3xl bg-ssa-yellow px-10 py-3 font-averia text-base font-bold text-ssa-category-text transition-colors border-2 border-ssa-dark-skin-yellow hover:bg-ssa-dark-skin-yellow  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2"
          >
            View More
            <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}
