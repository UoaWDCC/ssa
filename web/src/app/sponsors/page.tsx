import { FaLocationDot } from 'react-icons/fa6'

import CtaLink from '@/components/CtaLink'
import Hero from '@/components/Hero'
import {
  HighlightCard,
  type HighlightCardDetail,
} from '@/components/HighlightCard'

import SponsorsGrid, { type Sponsor } from './components/SponsorsGrid'

type SponsorOfTheWeek = {
  name: string
  logo: string
  websiteURL: string
  isSponsorOfTheWeek: boolean
  description: string
}

type SponsorCardContent = SponsorOfTheWeek & {
  eyebrow: string
  details: HighlightCardDetail[]
  badges: string[]
  ctaLabel: string
  imageAlt: string
}

// TO DO: Replace this mock data with CMS/API data once the Sponsor of the Week endpoint is available.
// Expected CMS fields: name, logo, websiteURL, isSponsorOfTheWeek, description.
// Extra fields below are presentational props used by HighlightCard.
const mockSponsorOfTheWeek: SponsorCardContent = {
  name: 'SIP N CHILL',
  logo: '/sponsors/sponsorcard.png', // Temporary local image until the CMS provides sponsor assets.
  websiteURL: '/sponsors', // Temporary placeholder link until the CMS provides a sponsor URL.
  isSponsorOfTheWeek: true,
  description:
    'Sip n Chill offers icy desserts , refreshing drinks, and a chill space to hang with your friends or just take a break from uni life.',
  eyebrow: 'Sponsor of the Week',
  details: [{ icon: FaLocationDot, text: 'Newmarket 432 Khyber Pass Road' }],
  badges: ['10% OFF for SSA Members'],
  ctaLabel: 'CHECK US OUT!',
  imageAlt: 'Sip n Chill sponsor photo',
}

// TO DO: Replace this mock data with CMS/API data once the sponsors directory endpoint is available.
// Hover overlay colours are presentational values for the current sponsor artwork.
const mockSponsorTiles = [
  {
    name: 'Kompass Coffee',
    logo: '/sponsors/kompass_coffee.png',
    websiteURL: 'https://www.kompasscoffee.co.nz/',
    hoverOverlayClassName: 'bg-[#71717199]',
    hoverTitle: 'kompass coffee',
    hoverDescription: 'Present your SSA card for 15% off',
    hoverTextClassName: 'text-[#FFFFFF]',
  },
  {
    name: 'Sip n Chill',
    logo: '/sponsors/sipnchill.png',
    websiteURL: '/sponsors',
    isSponsorOfTheWeek: true,
    hoverOverlayClassName: 'bg-[#FFE6B699]',
    hoverTitle: "SIP 'N CHILL",
    hoverDescription: 'Present your SSA card for 10% off',
    hoverTextClassName: 'text-[#434242]',
  },
]

const mockSponsors: Sponsor[] = Array.from({ length: 25 }, (_, index) => {
  const sponsor = mockSponsorTiles[index % mockSponsorTiles.length]

  return {
    ...sponsor,
    name: `${sponsor.name} ${index + 1}`,
  }
})

export default async function SponsorsPage() {
  // TO DO: Re-enable CMS fetching once the Sponsor of the Week endpoint
  // and returned image URLs are confirmed by the backend/CMS.
  const sponsorOfTheWeek = mockSponsorOfTheWeek
  const sponsors = mockSponsors

  return (
    <main className="flex flex-col gap-10 bg-ssa-yellow-light text-ssa-grey md:gap-14 lg:gap-[121px]">
      <Hero
        title="Sponsors"
        subtitle="Thank you to our amazing sponsors who make our events and activities possible."
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />
      <section className="px-6 pb-16 md:px-10 md:pb-24 lg:px-16">
        <HighlightCard
          eyebrow={sponsorOfTheWeek.eyebrow}
          title={sponsorOfTheWeek.name}
          details={sponsorOfTheWeek.details}
          badges={sponsorOfTheWeek.badges}
          description={<p>{sponsorOfTheWeek.description}</p>}
          ctaLabel={sponsorOfTheWeek.ctaLabel}
          ctaHref={sponsorOfTheWeek.websiteURL}
          imageSrc={sponsorOfTheWeek.logo}
          imageAlt={sponsorOfTheWeek.imageAlt}
        />

        <section className="mt-12 md:mt-16 lg:mt-[89px]">
          <div className="mx-auto mb-8 w-full max-w-[1214px] md:mb-10">
            <h2 className="font-averia text-4xl font-bold leading-tight text-ssa-grey md:text-5xl lg:text-[64px]">
              Our Sponsors
            </h2>
          </div>

          <SponsorsGrid sponsors={sponsors} />

          <div className="mx-auto mt-16 flex w-full max-w-[1214px] justify-center md:mt-20 lg:mt-[143px] lg:justify-end lg:pr-[67px]">
            <div className="flex h-[137px] w-full max-w-[390px] flex-col items-center">
              <p className="font-averia text-[40px] font-light leading-tight text-ssa-red">
                Keen to support SSA?
              </p>
              <CtaLink
                href="/contact"
                className="mt-[30px] h-[65px] w-full gap-[15px] border-[3px] border-transparent bg-[#FFC5C5] px-[35px] py-[15px] text-xl text-ssa-cta-text hover:border-[#EAB7BF] hover:bg-[#EAB7BF] lg:text-[25px] lg:leading-[27px]"
              >
                <span>Contact Us</span>
                <span aria-hidden="true">→</span>
              </CtaLink>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
