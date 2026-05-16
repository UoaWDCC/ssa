import SponsorLogoTile from './SponsorLogoTile'

export type Sponsor = {
  name: string
  logo: string
  websiteURL: string
  isSponsorOfTheWeek?: boolean
  hoverOverlayClassName: string
  hoverTitle: string
  hoverDescription: string
  hoverTextClassName: string
}

type SponsorsGridProps = {
  sponsors: Sponsor[]
}

export default function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1214px] grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[26px]">
      {sponsors.map((sponsor) => (
        <SponsorLogoTile
          key={sponsor.name}
          name={sponsor.name}
          logo={sponsor.logo}
          websiteURL={sponsor.websiteURL}
          hoverOverlayClassName={sponsor.hoverOverlayClassName}
          hoverTitle={sponsor.hoverTitle}
          hoverDescription={sponsor.hoverDescription}
          hoverTextClassName={sponsor.hoverTextClassName}
        />
      ))}
    </div>
  )
}
