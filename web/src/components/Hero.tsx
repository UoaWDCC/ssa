import Image from 'next/image'
import Link from 'next/link'

type HeroVariant = 'fullscreen' | 'compact'
type HeroLayout = 'centered' | 'split'

interface HeroProps {
  title: string
  subtitle: string
  variant?: HeroVariant
  layout?: HeroLayout
  tags?: readonly string[]
  ctaLabel?: string
  ctaHref?: string
}

const containerStyles: Record<HeroVariant, string> = {
  fullscreen:
    'items-center justify-center min-h-[calc(100svh-88px)] py-10 sm:py-12 md:py-16',
  compact:
    'items-center justify-center min-h-[clamp(18rem,55svh,32rem)] py-8 sm:py-10 md:py-12',
}

const titleStyles: Record<HeroVariant, string> = {
  fullscreen: 'text-ssa-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  compact: 'text-ssa-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
}

const subtitleStyles: Record<HeroVariant, string> = {
  fullscreen: 'text-ssa-white text-md sm:text-xl md:text-2xl lg:text-3xl',
  compact: 'text-ssa-white text-sm sm:text-base md:text-lg lg:text-xl',
}

const contentStyles: Record<HeroVariant, string> = {
  fullscreen:
    'relative z-10 flex max-w-md flex-col items-center gap-2 text-center sm:max-w-lg md:max-w-xl lg:max-w-2xl sm:gap-3 md:gap-4',
  compact:
    'relative z-10 flex max-w-xs flex-col items-center gap-2 text-center sm:max-w-sm md:max-w-lg sm:gap-3 md:gap-4',
}

const leftOrchidStyles: Record<HeroVariant, string> = {
  fullscreen:
    'hidden sm:block absolute bottom-0 h-72 sm:h-80 md:h-[26rem] lg:h-[30rem] xl:h-[34rem] w-auto pointer-events-none select-none',
  compact:
    'hidden sm:block absolute bottom-0 h-56 sm:h-64 md:h-80 lg:h-96 w-auto pointer-events-none select-none',
}

const rightOrchidStyles: Record<HeroVariant, string> = {
  fullscreen:
    'hidden sm:block absolute bottom-0 h-64 sm:h-72 md:h-[22rem] lg:h-[26rem] xl:h-[30rem] w-auto pointer-events-none select-none',
  compact:
    'hidden sm:block absolute bottom-0 h-48 sm:h-56 md:h-72 lg:h-80 w-auto pointer-events-none select-none',
}

const layoutStyles: Record<HeroVariant, string> = {
  fullscreen: 'gap-2 sm:gap-3 md:gap-4',
  compact: 'gap-2 sm:gap-3 md:gap-4',
}

const splitLayoutStyles: Record<HeroVariant, string> = {
  fullscreen:
    'flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16',
  compact:
    'flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16',
}

const splitContentStyles: Record<HeroVariant, string> = {
  fullscreen:
    'relative z-10 flex w-full max-w-2xl flex-col items-start gap-2 text-left sm:gap-3 md:gap-4',
  compact:
    'relative z-10 flex w-full max-w-xl flex-col items-start gap-2 text-left sm:gap-3 md:gap-4',
}

const orchidDuoStyles: Record<HeroVariant, string> = {
  fullscreen:
    'w-full max-w-[18rem] sm:max-w-[24rem] md:max-w-[30rem] lg:max-w-[36rem]',
  compact:
    'w-full max-w-[14rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[28rem]',
}

export default function Hero({
  title,
  subtitle,
  variant = 'compact',
  layout = 'centered',
  tags = [],
  ctaLabel,
  ctaHref,
}: Readonly<HeroProps>) {
  const isSplitLayout = layout === 'split'

  return (
    <div
      className={`relative isolate flex overflow-hidden rounded-b-2xl bg-[linear-gradient(151deg,rgba(255,99,126,1)_49%,rgba(255,162,164,1)_78%,rgba(255,241,213,1)_100%)] w-full px-4 sm:px-8 md:rounded-b-3xl md:px-12 lg:px-16 ${containerStyles[variant]}`}
    >
      {isSplitLayout ? (
        <div
          className={`z-10 mx-auto flex w-full max-w-6xl items-center ${splitLayoutStyles[variant]}`}
        >
          <div className={splitContentStyles[variant]}>
            <h1
              className={`font-be-vietnam-pro font-bold leading-tight wrap-break-word ${titleStyles[variant]}`}
            >
              {title}
            </h1>
            <p
              className={`font-inter font-bold leading-tight wrap-break-word ${subtitleStyles[variant]}`}
            >
              {subtitle}
            </p>
            {tags.length > 0 && (
              <ul className="flex flex-wrap justify-start gap-2 pt-1 sm:pt-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/35 bg-white/10 px-3 py-1 font-inter text-xs font-bold uppercase tracking-[0.18em] text-ssa-yellow-light sm:px-4 sm:py-1.5 sm:text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="mt-3 inline-flex w-fit min-w-0 items-center justify-center self-start rounded-[26px] border-2 border-ssa-yellow-light bg-ssa-yellow-light px-7 py-2 font-be-vietnam-pro text-base font-bold text-ssa-red hover:bg-ssa-white/20 hover:text-ssa-yellow-light sm:mt-4 sm:px-8 sm:py-2.5 sm:text-lg"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
          <Image
            src="/OrchidDuo.svg"
            alt="Orchid duo decoration"
            width={1200}
            height={1200}
            aria-hidden="true"
            className={`${orchidDuoStyles[variant]} z-0 h-auto shrink-0 self-end md:self-center`}
          />
        </div>
      ) : (
        <>
          <Image
            src="/LOrchid.svg"
            alt="Left orchid decoration"
            width={2000}
            height={4000}
            aria-hidden="true"
            className={`${leftOrchidStyles[variant]} z-0 left-1/2 translate-x-[-190%]`}
          />
          <Image
            src="/ROrchid.svg"
            alt="Right orchid decoration"
            width={200}
            height={500}
            aria-hidden="true"
            className={`${rightOrchidStyles[variant]} z-0 left-1/2 translate-x-[90%]`}
          />
          <div
            className={`z-10 mx-auto flex w-full max-w-5xl items-end justify-center ${layoutStyles[variant]}`}
          >
            <div className={contentStyles[variant]}>
              <h1
                className={`font-be-vietnam-pro font-bold leading-tight wrap-break-word ${titleStyles[variant]}`}
              >
                {title}
              </h1>
              <p
                className={`font-inter font-bold leading-tight wrap-break-word ${subtitleStyles[variant]}`}
              >
                {subtitle}
              </p>
              {tags.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-2 pt-1 sm:pt-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/35 bg-white/10 px-3 py-1 font-inter text-xs font-bold uppercase tracking-[0.18em] text-ssa-yellow-light sm:px-4 sm:py-1.5 sm:text-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref}
                  className="mt-3 inline-flex w-fit min-w-0 items-center justify-center self-center rounded-[26px] border-2 border-ssa-yellow-light bg-ssa-yellow-light px-7 py-2 font-be-vietnam-pro text-base font-bold text-ssa-red hover:bg-ssa-white/20 hover:text-ssa-yellow-light sm:mt-4 sm:px-8 sm:py-2.5 sm:text-lg"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
