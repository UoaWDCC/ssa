import Image from 'next/image'

import Button from '@/components/Button'
import Footer from '@/components/Footer'
import HeroSplit from '@/components/HeroSplit'
import HighlightCardSkeleton from '@/components/HighlightCardSkeleton'

import SponsorsControlsPlaceholder from './components/SponsorsControlsPlaceholder'
import SponsorsGridSkeleton from './components/SponsorsGridSkeleton'

export default function SponsorsLoading() {
  return (
    <main className="flex flex-col bg-ssa-background text-ssa-grey">
      <HeroSplit
        title="SPONSORS"
        subtitle="Thank you to our amazing sponsors who make our events and activities possible."
      />
      <section className="mt-10 px-4.5 md:mt-14 md:px-10 lg:mt-30.25 lg:px-16">
        <HighlightCardSkeleton variant="sponsor" />

        <section className="mt-12 md:mt-16 lg:mt-22.5">
          <div className="mx-auto mb-4 w-full max-w-311">
            <h2 className="font-be-vietnam-pro text-2xl font-bold leading-8 tracking-[-1px] text-ssa-red">
              Sponsors
            </h2>
          </div>

          <div className="mx-auto w-full max-w-311">
            <SponsorsControlsPlaceholder />
            <SponsorsGridSkeleton />
          </div>

          <section className="relative mx-auto mt-32 flex w-full max-w-189 flex-col items-center gap-8 overflow-visible md:mt-40 lg:mt-46 lg:block lg:h-53.75">
            <Image
              src="/nerdy-merlion.png"
              alt="Nerdy Merlion mascot"
              width={397}
              height={491}
              className="pointer-events-none h-auto w-52.5 select-none lg:absolute lg:-bottom-30 lg:-left-11.25 lg:z-0 lg:w-75 lg:max-w-none"
            />

            <div className="relative z-10 flex w-full max-w-65 flex-col items-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
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
