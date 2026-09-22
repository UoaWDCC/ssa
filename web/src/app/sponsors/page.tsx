import Image from 'next/image'
import { FaLocationDot } from 'react-icons/fa6'

export const dynamic = 'force-dynamic'

import Button from '@/components/Button'
import Footer from '@/components/Footer'
import HeroSplit from '@/components/HeroSplit'
import {
  HighlightCard,
  type HighlightCardDetail,
} from '@/components/HighlightCard'
import { fetchSponsors } from '@/lib/sponsors'

import SponsorsGrid, {
  type Sponsor,
  type SponsorGridItem,
} from './components/SponsorsGrid'

import type { Media } from '@/types/payload-types'

type SponsorMediaSeedInput = Pick<
  Media,
  'id' | 'alt' | 'url' | 'width' | 'height'
>

function createSponsorMedia({
  id,
  alt,
  url,
  width,
  height,
}: SponsorMediaSeedInput): Media {
  return {
    id,
    alt,
    url,
    width,
    height,
  }
}

const fallbackSponsorOfTheWeek: Sponsor = {
  id: 1,
  name: 'SIP N CHILL',
  logo: createSponsorMedia({
    id: 101,
    alt: 'Sip n Chill sponsor photo',
    url: '/sponsors/sponsorcard.png',
    width: 400,
    height: 400,
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

export default async function SponsorsPage() {
  const cmsSponsors = await fetchSponsors()
  const sponsorOfTheWeekEntry =
    cmsSponsors.find((sponsor) => sponsor.isSponsorOfTheWeek === true) ??
    fallbackSponsorOfTheWeek
  const sponsors: SponsorGridItem[] = cmsSponsors.map((sponsor) => ({
    ...sponsor,
    category: sponsor.category ?? 'FOOD',
  }))

  const sponsorOfTheWeekDetails: HighlightCardDetail[] = [
    {
      icon: FaLocationDot,
      text: sponsorOfTheWeekEntry.location || 'Location to be confirmed',
    },
  ]

  const sponsorOfTheWeekBadges = sponsorOfTheWeekEntry.memberPerks
    ? [sponsorOfTheWeekEntry.memberPerks]
    : []

  return (
    <main className="flex flex-col bg-ssa-background text-ssa-grey">
      <HeroSplit
        title="SPONSORS"
        subtitle="Thank you to our amazing sponsors who make our events and activities possible."
      />
      <section className="mt-10 px-4.5 md:mt-14 md:px-10 lg:mt-30.25 lg:px-16">
        <HighlightCard
          eyebrow="Sponsor of the Week"
          title={sponsorOfTheWeekEntry.name}
          details={sponsorOfTheWeekDetails}
          badges={sponsorOfTheWeekBadges}
          description={
            <p>
              {sponsorOfTheWeekEntry.description || 'More details coming soon.'}
            </p>
          }
          ctaLabel="CHECK US OUT!"
          ctaHref={sponsorOfTheWeekEntry.websiteUrl ?? '/sponsors'}
          imageSrc="/sponsors/sponsorcard.png"
          imageAlt={`${sponsorOfTheWeekEntry.name} sponsor artwork`}
        />

        <section className="mt-12 md:mt-16 lg:mt-[89px]">
          <div className="mx-auto mb-4 w-full max-w-[1244px]">
            <h2 className="font-be-vietnam-pro text-2xl font-bold leading-8 tracking-[-1px] text-ssa-red">
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
