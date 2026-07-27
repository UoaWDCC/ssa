import Image from 'next/image'
import { FaLocationDot, FaStar } from 'react-icons/fa6'

import CtaLink from '@/components/CtaLink'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import {
  HighlightCard,
  type HighlightCardDetail,
} from '@/components/HighlightCard'

import SponsorsGrid, {
  type Sponsor,
  type SponsorGridItem,
} from './components/SponsorsGrid'
import type { Media } from '../../../../cms/src/payload-types'

type SponsorMediaSeedInput = Pick<Media, 'id' | 'alt' | 'url' | 'filename'>

function createSponsorMedia({
  id,
  alt,
  url,
  filename,
}: SponsorMediaSeedInput): Media {
  return {
    id,
    alt,
    url,
    filename,
    updatedAt: '2026-05-18T00:00:00.000Z',
    createdAt: '2026-05-18T00:00:00.000Z',
  }
}

function getSponsorLogoUrl(logo: Sponsor['logo']) {
  if (typeof logo === 'number') return '/sponsors/sponsorcard.png'

  return logo.url ?? '/sponsors/sponsorcard.png'
}

function getSponsorLogoAlt(sponsor: Sponsor) {
  if (typeof sponsor.logo === 'number') return `${sponsor.name} logo`

  return sponsor.logo.alt
}

const sponsorOfTheWeekEntry: Sponsor = {
  id: 1,
  name: 'SIP N CHILL',
  logo: createSponsorMedia({
    id: 101,
    alt: 'Sip n Chill sponsor photo',
    url: '/sponsors/sponsorcard.png',
    filename: 'sponsorcard.png',
  }),
  websiteUrl:
    'https://www.instagram.com/sipchillnz?igsh=MW5ocnBrbnl5OXlrbQ%3D%3D',
  isSponsorOfTheWeek: true,
  description:
    'Sip n Chill offers icy desserts , refreshing drinks, and a chill space to hang with your friends or just take a break from uni life.',
  location: 'Newmarket 432 Khyber Pass Road',
  memberPerks: '10% OFF FOR SSA MEMBERS',
  updatedAt: '2026-05-18T00:00:00.000Z',
  createdAt: '2026-05-18T00:00:00.000Z',
}

const sponsorSeedEntries: SponsorGridItem[] = [
  {
    id: 2,
    name: 'Kompass Coffee',
    logo: createSponsorMedia({
      id: 102,
      alt: 'Kompass Coffee logo',
      url: '/sponsors/kompass_coffee.png',
      filename: 'kompass_coffee.png',
    }),
    websiteUrl: 'https://www.instagram.com/kompasscoffee/',
    isSponsorOfTheWeek: false,
    description: null,
    location: null,
    memberPerks: 'Present your SSA card for 15% off',
    updatedAt: '2026-05-18T00:00:00.000Z',
    createdAt: '2026-05-18T00:00:00.000Z',
    hoverOverlayClassName: 'bg-[#71717199]',
    hoverTextClassName: 'text-white',
  },
  {
    id: 3,
    name: 'Sip n Chill',
    logo: createSponsorMedia({
      id: 103,
      alt: 'Sip n Chill logo',
      url: '/sponsors/sipnchill.png',
      filename: 'sipnchill.png',
    }),
    websiteUrl:
      'https://www.instagram.com/sipchillnz?igsh=MW5ocnBrbnl5OXlrbQ%3D%3D',
    isSponsorOfTheWeek: true,
    description: sponsorOfTheWeekEntry.description,
    location: sponsorOfTheWeekEntry.location,
    memberPerks: 'Present your SSA card for 10% off',
    updatedAt: '2026-05-18T00:00:00.000Z',
    createdAt: '2026-05-18T00:00:00.000Z',
    hoverOverlayClassName: 'bg-ssa-yellow/60',
    hoverTextClassName: 'text-ssa-grey',
  },
]
//remove after milestone
const sponsorEntries: SponsorGridItem[] = Array.from(
  { length: 20 },
  (_, index) => {
    const sponsor = sponsorSeedEntries[index % sponsorSeedEntries.length]

    return {
      ...sponsor,
      id: index + 10,
      name: `${sponsor.name} ${index + 1}`,
    }
  },
)

export default async function SponsorsPage() {
  const sponsors = sponsorEntries
  const sponsorOfTheWeekDetails: HighlightCardDetail[] = [
    ...(sponsorOfTheWeekEntry.location
      ? [{ icon: FaLocationDot, text: sponsorOfTheWeekEntry.location }]
      : []),
    ...(sponsorOfTheWeekEntry.memberPerks
      ? [{ icon: FaStar, text: '10% SSA Members' }]
      : []),
  ]

  return (
    <main className="flex flex-col bg-ssa-yellow-light text-ssa-grey">
      <Hero
        title="Sponsors"
        subtitle="Thank you to our amazing sponsors who make our events and activities possible."
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />
      <section className="mt-10 px-[18px] md:mt-14 md:px-10 lg:mt-[121px] lg:px-16">
        <HighlightCard
          eyebrow="Sponsor of the Week"
          title={sponsorOfTheWeekEntry.name}
          details={sponsorOfTheWeekDetails}
          description={<p>{sponsorOfTheWeekEntry.description}</p>}
          ctaLabel="CHECK US OUT!"
          ctaHref={sponsorOfTheWeekEntry.websiteUrl ?? '/sponsors'}
          imageSrc={getSponsorLogoUrl(sponsorOfTheWeekEntry.logo)}
          imageAlt={getSponsorLogoAlt(sponsorOfTheWeekEntry)}
        />

        <section className="mt-12 md:mt-16 lg:mt-[89px]">
          <div className="mx-auto mb-10 w-full max-w-[1214px] sm:mb-12">
            <h2 className="font-averia text-3xl font-bold leading-tight text-ssa-grey sm:text-4xl md:text-5xl">
              Our Sponsors
            </h2>
          </div>

          <SponsorsGrid sponsors={sponsors} />

          <section className="relative mx-auto mt-16 w-full max-w-[1214px] overflow-visible pb-[65px] md:mt-20 lg:mt-[143px] lg:h-[420px] lg:pb-0">
            <Image
              src="/nerdy-merlion.png"
              alt="Nerdy Merlion mascot"
              width={397}
              height={491}
              className="hidden min-[1200px]:absolute min-[1200px]:bottom-0 min-[1200px]:left-[84px] min-[1200px]:z-0 min-[1200px]:block min-[1200px]:w-[397px] min-[1200px]:translate-y-[30%]"
            />

            <div className="mt-[65px] flex w-full justify-center lg:absolute lg:inset-x-0 lg:bottom-[90px] lg:mt-0 lg:justify-end lg:pr-16">
              <div className="flex h-[137px] w-full max-w-[390px] flex-col items-center">
                <p className="font-averia text-[34px] font-light leading-tight text-ssa-red lg:text-[40px]">
                  Keen to support SSA?
                </p>
                <CtaLink
                  href="/contact"
                  className="mt-[30px] h-[65px] w-full gap-[15px] border-[3px] border-transparent bg-ssa-contact-cta px-[35px] py-[15px] text-xl text-ssa-cta-text hover:border-ssa-contact-cta-hover hover:bg-ssa-contact-cta-hover lg:text-[25px] lg:leading-[27px]"
                >
                  <span>Contact Us</span>
                  <span aria-hidden="true">→</span>
                </CtaLink>
              </div>
            </div>
          </section>
        </section>
      </section>
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  )
}
