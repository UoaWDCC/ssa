'use client'

import { useState } from 'react'

import type { Sponsor } from '../../../../../cms/src/payload-types'
import SponsorLogoTile from './SponsorLogoTile'

export type { Sponsor } from '../../../../../cms/src/payload-types'

export type SponsorGridItem = Sponsor & {
  hoverOverlayClassName?: string
  hoverTextClassName?: string
}

type SponsorsGridProps = {
  sponsors: SponsorGridItem[]
}

const INITIAL_VISIBLE_COUNT = 24
const LOAD_MORE_COUNT = 24

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') return '/sponsors/sponsorcard.png'

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const visibleSponsors = sponsors.slice(0, visibleCount)
  const displayedCount = Math.min(visibleCount, sponsors.length)
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
            hoverOverlayClassName={sponsor.hoverOverlayClassName}
            hoverTitle={sponsor.name}
            hoverDescription={sponsor.memberPerks?.trim() || 'Visit website'}
            hoverTextClassName={sponsor.hoverTextClassName ?? 'text-ssa-grey'}
          />
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center text-center sm:mt-16">
        <p className="font-alegreya text-lg font-normal text-ssa-grey/70 sm:text-xl">
          Showing {displayedCount} of {sponsors.length} results
        </p>

        {hasMoreSponsors && (
          <button
            type="button"
            onClick={handleViewMore}
            className="mt-3 font-alegreya text-lg font-bold uppercase text-ssa-grey transition-opacity duration-200 hover:opacity-70 sm:text-xl"
          >
            View More
          </button>
        )}
      </div>
    </div>
  )
}
