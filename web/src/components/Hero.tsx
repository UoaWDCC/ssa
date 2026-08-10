import Image from 'next/image'
import Button from '@/components/Button'

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
    'items-center justify-center min-h-[calc(75svh-180px)] py-6 sm:min-h-[calc(100svh-88px)] sm:py-12 md:py-16',
  compact:
    'items-center justify-center min-h-[18rem] py-6 sm:min-h-[clamp(18rem,45svh,28rem)] sm:py-10 md:py-12',
}

const titleStyles: Record<HeroVariant, string> = {
  fullscreen:
    'text-ssa-white text-[48px] leading-[40px] tracking-[-0.04em] sm:text-[88px] sm:leading-[72px] sm:tracking-[-0.08em]',
  compact: 'text-ssa-white text-[48px] leading-[56px] tracking-[-2px]',
}

const subtitleStyles: Record<HeroVariant, string> = {
  fullscreen:
    'text-ssa-white font-bold text-sm sm:text-base md:text-lg lg:text-xl',
  compact:
    'text-ssa-white font-normal text-[16px] leading-[24px] tracking-[-0.4px]',
}

const contentStyles: Record<HeroVariant, string> = {
  fullscreen:
    'relative z-10 flex max-w-md flex-col items-center gap-2 text-center sm:max-w-lg md:max-w-xl lg:max-w-2xl sm:gap-3 md:gap-4',
  compact:
    'relative z-10 flex max-w-xs flex-col items-center gap-2 text-center sm:max-w-sm md:max-w-lg sm:gap-3 md:gap-4',
}

const leftOrchidStyles: Record<HeroVariant, string> = {
  fullscreen:
    'absolute bottom-0 left-[10%] h-48 w-auto pointer-events-none select-none sm:left-1/2 sm:h-52 sm:-translate-x-[190%] md:h-[23rem] lg:h-[27rem] xl:h-[31rem]',
  compact:
    'absolute bottom-0 left-[-0.5rem] h-32 w-auto pointer-events-none select-none sm:left-1/2 sm:h-48 md:h-72 lg:h-80',
}

const rightOrchidStyles: Record<HeroVariant, string> = {
  fullscreen:
    'absolute bottom-0 right-[10%] h-48 w-auto pointer-events-none select-none sm:left-1/2 sm:right-auto sm:h-52 sm:translate-x-[90%] md:h-[20rem] lg:h-[23rem] xl:h-[27rem]',
  compact:
    'absolute bottom-0 right-[-0.5rem] h-28 w-auto pointer-events-none select-none sm:left-1/2 sm:right-auto sm:h-44 sm:translate-x-[90%] md:h-64 lg:h-72',
}

const layoutStyles: Record<HeroVariant, string> = {
  fullscreen: 'gap-2 sm:gap-3 md:gap-4',
  compact: 'gap-2 sm:gap-3 md:gap-4',
}

const splitLayoutStyles: Record<HeroVariant, string> = {
  fullscreen:
    'relative flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16',
  compact:
    'relative flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16',
}

const splitContentStyles: Record<HeroVariant, string> = {
  fullscreen:
    'relative z-10 flex w-full max-w-2xl flex-col items-start gap-2 text-left sm:gap-3 md:gap-4',
  compact:
    'relative z-10 flex w-full max-w-xl flex-col items-start gap-2 text-left sm:gap-3 md:gap-4',
}

const orchidDuoStyles: Record<HeroVariant, string> = {
  fullscreen:
    'absolute bottom-0 right-[5%] h-48 w-auto pointer-events-none select-none sm:right-[10%] sm:h-40 md:h-48 lg:h-56 xl:h-64',
  compact:
    'absolute bottom-[-2rem] right-[5%] h-48 w-auto pointer-events-none select-none z-0 sm:bottom-0 sm:right-[10%] sm:h-36 md:h-44 lg:h-52',
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
        <>
          <div
            className={`z-10 mx-auto flex w-full max-w-6xl items-center ${splitLayoutStyles[variant]}`}
          >
            <div className={splitContentStyles[variant]}>
              <h1
                className={`font-be-vietnam-pro font-bold wrap-break-word ${titleStyles[variant]}`}
              >
                {title}
              </h1>
              <p
                className={`hidden font-inter leading-tight wrap-break-word sm:block ${subtitleStyles[variant]}`}
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
                <Button
                  href={ctaHref}
                  variant="light"
                  color="red"
                  arrow={false}
                  className="mt-3 sm:mt-4"
                >
                  {ctaLabel}
                </Button>
              )}
            </div>
          </div>
          <Image
            src="/OrchidDuo.svg"
            alt="Orchid duo decoration"
            width={1200}
            height={1200}
            aria-hidden="true"
            className={`${orchidDuoStyles[variant]} z-0 opacity-70 sm:opacity-100`}
          />
        </>
      ) : (
        <>
          <Image
            src="/LOrchid.svg"
            alt="Left orchid decoration"
            width={2000}
            height={4000}
            aria-hidden="true"
            className={`${leftOrchidStyles[variant]} z-0 opacity-70 sm:opacity-100`}
          />
          <Image
            src="/ROrchid.svg"
            alt="Right orchid decoration"
            width={200}
            height={500}
            aria-hidden="true"
            className={`${rightOrchidStyles[variant]} z-0 opacity-70 sm:opacity-100`}
          />
          <div
            className={`z-10 mx-auto flex w-full max-w-5xl items-end justify-center ${layoutStyles[variant]}`}
          >
            <div className={contentStyles[variant]}>
              <h1
                className={`font-be-vietnam-pro font-bold break-words ${titleStyles[variant]}`}
              >
                {title}
              </h1>
              <p
                className={`leading-tight break-words ${subtitleStyles[variant]}`}
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
                <Button
                  href={ctaHref}
                  variant="light"
                  size="short"
                  color="red"
                  arrow={true}
                  className="mt-3 self-center sm:mt-4"
                >
                  {ctaLabel}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
