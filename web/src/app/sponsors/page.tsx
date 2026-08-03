import Image from 'next/image'
import { FaLocationDot } from 'react-icons/fa6'

import Button from '@/components/Button'
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
  if (typeof logo === 'number') {
    return '/sponsors/sponsorcard.png'
  }

  return logo.url ?? '/sponsors/sponsorcard.png'
}

function getSponsorLogoAlt(sponsor: Sponsor) {
  if (typeof sponsor.logo === 'number') {
    return `${sponsor.name} logo`
  }

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
    'Sip n Chill offers icy desserts, refreshing drinks, and a chill space to hang with your friends or just take a break from uni life.',
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
  },
]

// Remove when Payload CMS sponsors are connected.
const sponsorEntries: SponsorGridItem[] = Array.from(
  { length: 45 },
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

  const sponsorOfTheWeekDetails: HighlightCardDetail[] =
    sponsorOfTheWeekEntry.location
      ? [
          {
            icon: FaLocationDot,
            text: sponsorOfTheWeekEntry.location,
          },
        ]
      : []

  const sponsorOfTheWeekBadges = sponsorOfTheWeekEntry.memberPerks
    ? [sponsorOfTheWeekEntry.memberPerks]
    : []

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
          badges={sponsorOfTheWeekBadges}
          description={<p>{sponsorOfTheWeekEntry.description}</p>}
          ctaLabel="CHECK US OUT!"
          ctaHref={sponsorOfTheWeekEntry.websiteUrl ?? '/sponsors'}
          imageSrc={getSponsorLogoUrl(sponsorOfTheWeekEntry.logo)}
          imageAlt={getSponsorLogoAlt(sponsorOfTheWeekEntry)}
        />

        <section className="mt-12 md:mt-16 lg:mt-[89px]">
          <div className="mx-auto mb-10 w-full max-w-[1244px] sm:mb-12">
            <h2 className="font-be-vietnam-pro text-3xl font-bold leading-tight text-ssa-red sm:text-4xl md:text-5xl">
              Sponsors
            </h2>
          </div>

          <SponsorsGrid sponsors={sponsors} />

          <section className="relative mx-auto mt-32 flex w-full max-w-[756px] flex-col items-center gap-8 overflow-visible md:mt-40 lg:mt-[184px] lg:block lg:h-[215px]">
            <Image
              src="/nerdy-merlion.png"
              alt="Nerdy Merlion mascot"
              width={397}
              height={491}
              className="pointer-events-none h-auto w-[210px] select-none lg:absolute lg:bottom-[-120px] lg:left-[-45px] lg:z-0 lg:w-[300px] lg:max-w-none"
            />

            <div className="relative z-10 flex w-full max-w-[260px] flex-col items-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
              <p className="w-full text-center font-be-vietnam-pro text-2xl font-bold leading-8 tracking-[-1px] text-ssa-red">
                Keen to support SSA?
              </p>

              <Button
                href="/contact"
                size="long"
                variant="filled"
                color="pink"
                arrowSide="right"
                className="mt-3 h-12 py-0 text-base uppercase"
              >
                Contact Us
              </Button>
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
