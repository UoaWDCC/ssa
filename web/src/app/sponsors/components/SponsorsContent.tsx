'use client'

import Image from 'next/image'
import { FaLocationDot } from 'react-icons/fa6'

import CtaLink from '@/components/CtaLink'
import {
  HighlightCard,
  type HighlightCardDetail,
} from '@/components/HighlightCard'
import { useSponsors, useSponsorOfTheWeek } from '@/hooks/useSponsors'
import { getCmsMediaUrl } from '@/lib/media'
import type { Sponsor } from '@/types/sponsors'

import SponsorsGrid from './SponsorsGrid'

function getSponsorLogoUrl(sponsor: Sponsor | null | undefined) {
  return getCmsMediaUrl(sponsor?.logo?.url) ?? '/sponsors/sponsorcard.png'
}

function getSponsorLogoAlt(sponsor: Sponsor) {
  return sponsor.logo?.alt ?? `${sponsor.name} logo`
}

function HighlightSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-[1214px] overflow-hidden rounded-[32px] bg-ssa-card shadow-[0px_3px_4px_1px_#00000040,1px_-5px_4.3px_0px_#D5D5D54D] lg:min-h-[590px] min-[1200px]:grid-cols-[minmax(0,1fr)_554px]">
      <div className="flex min-w-0 flex-col gap-5 px-6 py-8 sm:px-8 lg:pb-[58px] lg:pl-14 lg:pr-10 lg:pt-11">
        <div className="h-5 w-48 animate-pulse rounded bg-ssa-muted-gold/20" />
        <div className="h-11 w-72 max-w-full animate-pulse rounded bg-ssa-red/20" />
        <div className="h-8 w-56 max-w-full animate-pulse rounded bg-ssa-grey/10" />
        <div className="h-28 w-full animate-pulse rounded bg-ssa-grey/10" />
        <div className="mt-auto h-[68px] w-full max-w-[553px] animate-pulse rounded-full bg-ssa-red/20" />
      </div>
      <div className="hidden justify-end min-[1200px]:flex min-[1200px]:items-start min-[1200px]:py-[44px] min-[1200px]:pl-8 min-[1200px]:pr-[68px]">
        <div className="h-[488px] w-[486px] animate-pulse rounded-[20px] bg-ssa-grey/10" />
      </div>
    </div>
  )
}

function SponsorsGridSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-[1214px] gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={`sponsor-skeleton-${String(index)}`}
          className="rounded-2xl bg-ssa-card p-4 shadow-[0px_2px_4px_0px_#00000026]"
        >
          <div className="aspect-square w-full animate-pulse rounded-lg bg-ssa-grey/10 lg:rounded-[20px]" />
          <div className="mt-4 h-7 w-3/4 animate-pulse rounded bg-ssa-red/20" />
          <div className="mt-3 h-16 animate-pulse rounded bg-ssa-grey/10" />
        </div>
      ))}
    </div>
  )
}

export default function SponsorsContent() {
  const {
    data: sponsors,
    isLoading: sponsorsLoading,
    isError: sponsorsError,
  } = useSponsors()
  const {
    data: sponsorOfTheWeek,
    isLoading: sponsorOfTheWeekLoading,
    isError: sponsorOfTheWeekError,
  } = useSponsorOfTheWeek()

  const sponsorOfTheWeekDetails: HighlightCardDetail[] =
    sponsorOfTheWeek?.location
      ? [{ icon: FaLocationDot, text: sponsorOfTheWeek.location }]
      : []
  const sponsorOfTheWeekBadges = sponsorOfTheWeek?.member_perks
    ? [sponsorOfTheWeek.member_perks]
    : []

  return (
    <section className="mt-10 px-[18px] md:mt-14 md:px-10 lg:mt-[121px] lg:px-16">
      {sponsorOfTheWeekLoading && <HighlightSkeleton />}

      {sponsorOfTheWeekError && (
        <p className="mx-auto w-full max-w-[1214px] font-averia text-ssa-black/60">
          Failed to load sponsor of the week. Please try again later.
        </p>
      )}

      {!sponsorOfTheWeekLoading &&
        !sponsorOfTheWeekError &&
        sponsorOfTheWeek && (
          <HighlightCard
            eyebrow="Sponsor of the Week"
            title={sponsorOfTheWeek.name}
            details={sponsorOfTheWeekDetails}
            badges={sponsorOfTheWeekBadges}
            description={
              <p>
                {sponsorOfTheWeek.description ??
                  'Support this SSA sponsor and check out their latest offers.'}
              </p>
            }
            ctaLabel="CHECK US OUT!"
            ctaHref={sponsorOfTheWeek.website_url ?? '/sponsors'}
            imageSrc={getSponsorLogoUrl(sponsorOfTheWeek)}
            imageAlt={getSponsorLogoAlt(sponsorOfTheWeek)}
          />
        )}

      <section className="mt-12 md:mt-16 lg:mt-[89px]">
        <div className="mx-auto mb-10 w-full max-w-[1214px] sm:mb-12">
          <h2 className="font-averia text-3xl font-bold leading-tight text-ssa-grey sm:text-4xl md:text-5xl">
            Our Sponsors
          </h2>
        </div>

        {sponsorsError && (
          <p className="mx-auto w-full max-w-[1214px] font-averia text-ssa-black/60">
            Failed to load sponsors. Please try again later.
          </p>
        )}

        {sponsorsLoading && <SponsorsGridSkeleton />}

        {!sponsorsLoading && !sponsorsError && sponsors?.length === 0 && (
          <p className="mx-auto w-full max-w-[1214px] rounded-2xl bg-ssa-card px-6 py-8 text-center font-averia text-lg font-light text-ssa-grey shadow-[0px_2px_4px_0px_#00000026]">
            No sponsors have been added yet.
          </p>
        )}

        {!sponsorsLoading &&
          !sponsorsError &&
          sponsors &&
          sponsors.length > 0 && <SponsorsGrid sponsors={sponsors} />}

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
  )
}
