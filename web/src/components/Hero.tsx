import Image from 'next/image'
import Button from '@/components/Button'

interface HeroProps {
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export default function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: Readonly<HeroProps>) {
  return (
    <div className="relative isolate flex w-full min-h-[calc(75svh-180px)] items-center justify-center overflow-hidden rounded-b-2xl bg-[linear-gradient(151deg,rgba(255,99,126,1)_49%,rgba(255,162,164,1)_78%,rgba(255,241,213,1)_100%)] px-4 py-6 sm:min-h-[calc(100svh-88px)] sm:px-8 sm:py-12 md:rounded-b-3xl md:px-12 md:py-16 lg:px-16">
      <Image
        src="/LOrchid.svg"
        alt="Left orchid decoration"
        width={2000}
        height={4000}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[10%] z-0 h-48 w-auto select-none opacity-70 sm:left-1/2 sm:h-52 sm:-translate-x-[190%] sm:opacity-100 md:h-[23rem] lg:h-[27rem] xl:h-[31rem]"
      />

      <Image
        src="/ROrchid.svg"
        alt="Right orchid decoration"
        width={200}
        height={500}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[10%] z-0 h-48 w-auto select-none opacity-70 sm:left-1/2 sm:right-auto sm:h-52 sm:translate-x-[90%] sm:opacity-100 md:h-[20rem] lg:h-[23rem] xl:h-[27rem]"
      />

      <div className="z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 text-center sm:gap-5 md:gap-6">
        <h1 className="font-be-vietnam-pro text-[48px] font-bold leading-[40px] tracking-[-0.04em] text-ssa-white wrap-break-word sm:text-[88px] sm:leading-[72px] sm:tracking-[-0.08em]">
          {title}
        </h1>

        <p className="font-inter text-sm font-bold leading-tight text-ssa-white wrap-break-word sm:text-base md:text-lg lg:text-xl">
          {subtitle}
        </p>

        {ctaLabel && ctaHref && (
          <Button href={ctaHref} variant="light" color="red">
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
