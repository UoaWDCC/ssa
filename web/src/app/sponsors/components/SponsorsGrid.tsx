'use client'

import { useMemo, useState } from 'react'

import CategoryFilters from '@/components/CategoryFilters'
import SearchBar from '@/components/SearchBar'

import type { Sponsor } from '../../../../../cms/src/payload-types'
import SponsorLogoTile from './SponsorLogoTile'

export type { Sponsor } from '../../../../../cms/src/payload-types'

export const SPONSOR_CATEGORIES = [
  'FOOD',
  'RETAIL',
  'SERVICES',
  'ENTERTAINMENT',
] as const

export type SponsorCategory = (typeof SPONSOR_CATEGORIES)[number]

export type SponsorGridItem = Sponsor & {
  category: SponsorCategory
}

type SponsorFilter = 'ALL' | SponsorCategory

type SponsorsGridProps = {
  sponsors: SponsorGridItem[]
}

const FILTER_OPTIONS: readonly SponsorFilter[] = ['ALL', ...SPONSOR_CATEGORIES]

const INITIAL_VISIBLE_COUNT = 24
const LOAD_MORE_COUNT = 24

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') {
    return '/sponsors/sponsorcard.png'
  }

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({
  sponsors,
}: Readonly<SponsorsGridProps>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SponsorFilter>('ALL')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const filteredSponsors = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    return sponsors.filter((sponsor) => {
      const matchesCategory =
        selectedCategory === 'ALL' || sponsor.category === selectedCategory

      const searchableContent = [
        sponsor.name,
        sponsor.description,
        sponsor.location,
        sponsor.memberPerks,
      ]
        .filter((value): value is string => Boolean(value))
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        searchableContent.includes(normalizedSearchQuery)

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory, sponsors])

  const displayedCount = Math.min(visibleCount, filteredSponsors.length)

  const visibleSponsors = filteredSponsors.slice(0, displayedCount)
  const hasMoreSponsors = displayedCount < filteredSponsors.length

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  function handleCategoryChange(category: SponsorFilter) {
    setSelectedCategory(category)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  function handleViewMore() {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + LOAD_MORE_COUNT, filteredSponsors.length),
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1244px]">
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search Sponsor"
        ariaLabel="Search sponsors"
      />

      <CategoryFilters
        options={FILTER_OPTIONS}
        selectedOption={selectedCategory}
        onChange={handleCategoryChange}
        ariaLabel="Filter sponsors by category"
        iconlessOption="ALL"
        className="mt-4"
      />

      {visibleSponsors.length > 0 ? (
        <div className="mt-20 grid w-full grid-cols-3 gap-[7px] sm:gap-4 md:grid-cols-4 xl:grid-cols-6 xl:gap-[20.87px]">
          {visibleSponsors.map((sponsor) => (
            <SponsorLogoTile
              key={sponsor.id}
              name={sponsor.name}
              logoUrl={getSponsorLogoUrl(sponsor.logo)}
              websiteUrl={sponsor.websiteUrl ?? undefined}
              hoverTitle={sponsor.name}
              hoverDescription={sponsor.memberPerks?.trim() || 'Visit website'}
            />
          ))}
        </div>
      ) : (
        <div
          className="mt-20 flex min-h-48 items-center justify-center text-center"
          role="status"
        >
          <p className="font-inter text-base font-normal text-ssa-muted-text">
            No sponsors found.
          </p>
        </div>
      )}

      <div
        className="mt-16 flex flex-col items-center text-center"
        aria-live="polite"
      >
        <p className="font-inter text-base font-normal leading-6 tracking-[-0.4px] text-ssa-muted-text">
          Showing {displayedCount} of {filteredSponsors.length} results
        </p>

        {hasMoreSponsors && (
          <button
            type="button"
            onClick={handleViewMore}
            className="mt-3 font-be-vietnam-pro text-base font-semibold uppercase leading-6 tracking-[-0.32px] text-ssa-muted-text transition-colors duration-200 hover:text-ssa-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ssa-red"
          >
            View More
          </button>
        )}
      </div>
    </div>
  )
}
