import type { Sponsor } from '@/lib/sponsors'
import SponsorLogoTile from './SponsorLogoTile'

export type SponsorGridItem = Sponsor & {
  hoverOverlayClassName?: string
  hoverTextClassName?: string
}

type SponsorsGridProps = {
  sponsors?: SponsorGridItem[] | null
}

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') return '/sponsors/sponsorcard.png'

  return logo.url ?? '/sponsors/sponsorcard.png'
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  const sponsorList = Array.isArray(sponsors) ? sponsors : []

  return (
    <div className="mx-auto grid w-full max-w-[1214px] grid-cols-[repeat(auto-fit,83px)] justify-center gap-[7px] sm:grid-cols-[repeat(auto-fit,120px)] sm:gap-[26px] md:grid-cols-[repeat(auto-fit,160px)] lg:grid-cols-[repeat(auto-fit,222px)]">
      {sponsorList.map((sponsor) => (
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
  )
}
