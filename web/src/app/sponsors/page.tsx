'use client'
import Image from 'next/image'
import { FaLocationDot, FaStar } from 'react-icons/fa6'

import CtaLink from '@/components/CtaLink'
import Footer from '@/components/Footer'
import HeroSplit from '@/components/HeroSplit'
import {
  HighlightCard,
  type HighlightCardDetail,
} from '@/components/HighlightCard'
import SponsorsGrid from './components/SponsorsGrid'
import type { Media } from '@/types/payload-types'
import { useSponsors } from '@/hooks/useSponsors'
import type { Sponsor } from '@/lib/sponsors'

type SponsorMediaSeedInput = Pick<Media, 'id' | 'alt' | 'url'>

function createSponsorMedia({ id, alt, url }: SponsorMediaSeedInput): Media {
  return {
    id,
    alt,
    url,
    width: null,
    height: null,
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
  name: 'Sip N Chill',
  logo: createSponsorMedia({
    id: 101,
    alt: 'Sip n Chill sponsor photo',
    url: '/sponsors/sponsorcard.png',
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

export default function SponsorsPage() {
  const { sponsors, status } = useSponsors()

  const sponsorOfTheWeekDetails: HighlightCardDetail[] = [
    ...(sponsorOfTheWeekEntry.location
      ? [{ icon: FaLocationDot, text: sponsorOfTheWeekEntry.location }]
      : []),
    ...(sponsorOfTheWeekEntry.memberPerks
      ? [{ icon: FaStar, text: sponsorOfTheWeekEntry.memberPerks }]
      : []),
  ]

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
          description={<p>{sponsorOfTheWeekEntry.description}</p>}
          ctaLabel="CHECK US OUT!"
          ctaHref={sponsorOfTheWeekEntry.websiteUrl ?? '/sponsors'}
          imageSrc={getSponsorLogoUrl(sponsorOfTheWeekEntry.logo)}
          imageAlt={getSponsorLogoAlt(sponsorOfTheWeekEntry)}
        />

        <section className="mt-12 md:mt-16 lg:mt-22.25">
          <div className="mx-auto mb-10 w-full max-w-303.5 sm:mb-12">
            <h2 className="font-averia text-3xl font-bold leading-tight text-ssa-grey sm:text-4xl md:text-5xl">
              Our Sponsors
            </h2>
            {status === 'error' ? (
              <p className="mt-4 text-base text-ssa-grey/80 sm:text-lg">
                Sponsor data is temporarily unavailable. Please check back soon.
              </p>
            ) : null}
          </div>

          {status !== 'error' && <SponsorsGrid sponsors={sponsors} />}

          <section className="relative mx-auto mt-16 w-full max-w-303.5 overflow-visible pb-16.25 md:mt-20 lg:mt-35.75 lg:h-105 lg:pb-0">
            <Image
              src="/nerdy-merlion.png"
              alt="Nerdy Merlion mascot"
              width={397}
              height={491}
              className="hidden min-[1200px]:absolute min-[1200px]:bottom-0 min-[1200px]:left-21 min-[1200px]:z-0 min-[1200px]:block min-[1200px]:w-99.25 min-[1200px]:translate-y-[30%]"
            />

            <div className="mt-16.25 flex w-full justify-center lg:absolute lg:inset-x-0 lg:bottom-22.5 lg:mt-0 lg:justify-end lg:pr-16">
              <div className="flex h-34.25 w-full max-w-97.5 flex-col items-center">
                <p className="font-averia text-[34px] font-light leading-tight text-ssa-red lg:text-[40px]">
                  Keen to support SSA?
                </p>
                <CtaLink
                  href="/contact"
                  className="mt-7.5 h-16.25 w-full gap-3.75 border-[3px] border-transparent bg-ssa-contact-cta px-8.75 py-3.75 text-xl text-ssa-cta-text hover:border-ssa-contact-cta-hover hover:bg-ssa-contact-cta-hover lg:text-[25px] lg:leading-6.75"
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
