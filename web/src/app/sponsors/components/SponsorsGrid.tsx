'use client'

import { useCallback, useRef, useState } from 'react'

import type { Sponsor } from '../../../../../cms/src/payload-types'
import SponsorLogoTile from './SponsorLogoTile'
import SponsorPopup from './SponsorPopup'

export type { Sponsor } from '../../../../../cms/src/payload-types'

export type SponsorGridItem = Sponsor & {
  hoverOverlayClassName?: string
  hoverTextClassName?: string
}

type SponsorsGridProps = {
  sponsors: SponsorGridItem[]
}

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') return '/sponsors/sponsorcard.png'

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  const [selectedSponsor, setSelectedSponsor] =
    useState<SponsorGridItem | null>(null)
  const selectedTriggerRef = useRef<HTMLElement | null>(null)

  const closePopup = useCallback(() => {
    setSelectedSponsor(null)
    requestAnimationFrame(() => selectedTriggerRef.current?.focus())
  }, [])

  return (
    <>
      <div className="mx-auto grid w-full max-w-[1214px] grid-cols-[repeat(auto-fit,83px)] justify-center gap-[7px] sm:grid-cols-[repeat(auto-fit,120px)] sm:gap-[26px] md:grid-cols-[repeat(auto-fit,160px)] lg:grid-cols-[repeat(auto-fit,222px)]">
        {sponsors.map((sponsor) => (
          <SponsorLogoTile
            key={sponsor.id}
            name={sponsor.name}
            logoUrl={getSponsorLogoUrl(sponsor.logo)}
            websiteUrl={sponsor.websiteUrl ?? undefined}
            hoverOverlayClassName={sponsor.hoverOverlayClassName}
            hoverTitle={sponsor.name}
            hoverDescription={sponsor.memberPerks?.trim() || 'Visit website'}
            hoverTextClassName={sponsor.hoverTextClassName ?? 'text-ssa-grey'}
            onTouchSelect={() => {
              selectedTriggerRef.current = document.activeElement as HTMLElement
              setSelectedSponsor(sponsor)
            }}
          />
        ))}
      </div>

      {selectedSponsor && (
        <SponsorPopup
          name={selectedSponsor.name}
          logoUrl={getSponsorLogoUrl(selectedSponsor.logo)}
          websiteUrl={selectedSponsor.websiteUrl ?? undefined}
          onClose={closePopup}
        />
      )}
    </>
  )
}
