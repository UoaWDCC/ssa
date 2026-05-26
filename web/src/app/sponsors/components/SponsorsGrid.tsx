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

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') return '/sponsors/sponsorcard.png'

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1214px] grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[26px]">
      {sponsors.map((sponsor) => (
        <SponsorLogoTile
          key={sponsor.id}
          name={sponsor.name}
          logoUrl={getSponsorLogoUrl(sponsor.logo)}
          websiteUrl={sponsor.websiteUrl ?? '/sponsors'}
          hoverOverlayClassName={sponsor.hoverOverlayClassName}
          hoverTitle={sponsor.name}
          hoverDescription={sponsor.memberPerks?.trim() || 'Visit website'}
          hoverTextClassName={sponsor.hoverTextClassName ?? 'text-ssa-grey'}
        />
      ))}
    </div>
  )
}
