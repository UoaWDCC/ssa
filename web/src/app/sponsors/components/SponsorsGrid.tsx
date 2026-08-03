'use client'

import { useState } from 'react'

import type { Sponsor } from '../../../../../cms/src/payload-types'
import SponsorLogoTile from './SponsorLogoTile'

export type { Sponsor } from '../../../../../cms/src/payload-types'

export type SponsorGridItem = Sponsor

type SponsorsGridProps = {
  sponsors: SponsorGridItem[]
}

const INITIAL_VISIBLE_COUNT = 24
const LOAD_MORE_COUNT = 24

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') {
    return '/sponsors/sponsorcard.png'
  }

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const displayedCount = Math.min(visibleCount, sponsors.length)
  const visibleSponsors = sponsors.slice(0, displayedCount)
  const hasMoreSponsors = displayedCount < sponsors.length

  function handleViewMore() {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + LOAD_MORE_COUNT, sponsors.length),
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1244px]">
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6 xl:gap-[20.87px]">
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

      <div
        className="mt-16 flex flex-col items-center text-center"
        aria-live="polite"
      >
        <p className="font-inter text-base font-normal leading-6 tracking-[-0.4px] text-ssa-muted-text">
          Showing {displayedCount} of {sponsors.length} results
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
