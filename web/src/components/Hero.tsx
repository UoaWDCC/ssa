import Link from 'next/link'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  variant?: HeroVariant
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
  fullscreen: 'text-ssa-white text-lg sm:text-xl md:text-2xl lg:text-3xl',
  compact: 'text-ssa-white text-sm sm:text-base md:text-lg lg:text-xl',
}

const contentStyles: Record<HeroVariant, string> = {
  fullscreen:
    'mx-auto flex max-w-md flex-col items-center gap-2 text-center sm:max-w-lg md:max-w-xl lg:max-w-2xl sm:gap-3 md:gap-4',
  compact:
    'mx-auto flex max-w-xs flex-col items-center gap-2 text-center sm:max-w-sm md:max-w-lg sm:gap-3 md:gap-4',
}

export default function Hero({
  title,
  subtitle,
  variant = 'compact',
  tags = [],
  ctaLabel,
  ctaHref,
}: Readonly<HeroProps>) {
  return (
    <div
      className={`relative isolate flex overflow-hidden rounded-b-2xl bg-[linear-gradient(151deg,rgba(255,99,126,1)_49%,rgba(255,162,164,1)_78%,rgba(255,241,213,1)_100%)] w-full px-4 sm:px-8 md:rounded-b-3xl md:px-12 lg:px-16 ${containerStyles[variant]}`}
    >
      <div className={`z-10 ${contentStyles[variant]}`}>
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
            className="mt-3 inline-flex w-fit min-w-0 items-center justify-center self-center rounded-[26px] border-2 border-ssa-yellow-light bg-ssa-yellow-light px-7 py-2 font-be-vietnam-pro text-base font-bold text-ssa-red hover:bg-white/20 sm:mt-4 sm:px-8 sm:py-2.5 sm:text-lg"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
