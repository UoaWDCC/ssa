import Image from 'next/image'
import Link from 'next/link'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
  mascotAlt?: string
  variant?: HeroVariant
  tags?: readonly string[]
  ctaLabel?: string
  ctaHref?: string
  showSingaporeFlag?: boolean
}

const containerStyles: Record<HeroVariant, string> = {
  fullscreen:
    'items-start min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12',
  compact:
    'items-end min-h-48 sm:min-h-56 md:min-h-72 lg:min-h-96 py-6 sm:py-8 md:py-12 pb-8 sm:pb-10 md:pb-12',
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
    'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl pr-0 sm:pr-32 md:pr-40 lg:pr-48 ml-0 md:ml-12 lg:ml-24',
  compact: 'max-w-xs sm:max-w-sm md:max-w-lg pl-4 sm:pl-6 md:pl-8 lg:pl-10',
}

const mascotStyles: Record<HeroVariant, string> = {
  fullscreen: 'h-48 sm:h-56 md:h-80 lg:h-96',
  compact: 'h-36 sm:h-40 md:h-48 lg:h-56',
}

function SingaporeFlagBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      className="h-full w-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
    >
      <rect
        x="28"
        y="40"
        width="160"
        height="140"
        rx="30"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="8"
      />
      <path d="M48 58h120v66H48z" fill="rgba(248,91,118,0.32)" />
      <path
        d="M92 78c0 17 14 31 31 31 4 0 8-1 11-2-8 10-20 16-34 16-24 0-43-19-43-43s19-43 43-43c14 0 26 6 34 16-3-1-7-2-11-2-17 0-31 14-31 31Z"
        fill="rgba(255,255,255,0.95)"
      />
      <g fill="rgba(255,255,255,0.95)">
        <circle cx="135" cy="66" r="4" />
        <circle cx="150" cy="58" r="4" />
        <circle cx="152" cy="77" r="4" />
        <circle cx="141" cy="89" r="4" />
        <circle cx="125" cy="85" r="4" />
      </g>
    </svg>
  )
}

export default function Hero({
  title,
  subtitle,
  mascotImage,
  mascotAlt = 'Mascot',
  variant = 'compact',
  tags = [],
  ctaLabel,
  ctaHref,
  showSingaporeFlag = false,
}: Readonly<HeroProps>) {
  return (
    <div
      className={`relative isolate flex justify-between overflow-hidden rounded-b-2xl bg-ssa-red w-full px-4 sm:px-8 md:rounded-b-3xl md:px-12 lg:px-16 ${containerStyles[variant]}`}
    >
      {showSingaporeFlag && variant === 'fullscreen' && (
        <div className="pointer-events-none absolute right-0 top-4 hidden w-40 translate-x-6 opacity-70 sm:block sm:w-48 md:w-64 lg:w-72">
          <SingaporeFlagBackdrop />
        </div>
      )}

      <div
        className={`z-10 flex flex-col gap-2 sm:gap-3 md:gap-4 ${contentStyles[variant]}`}
      >
        <h1
          className={`font-averia font-bold leading-tight break-words ${titleStyles[variant]}`}
        >
          {title}
        </h1>
        <p
          className={`font-averia font-light leading-tight break-words ${subtitleStyles[variant]}`}
        >
          {subtitle}
        </p>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1 sm:pt-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/35 bg-white/10 px-3 py-1 font-averia text-xs font-bold uppercase tracking-[0.18em] text-ssa-white sm:px-4 sm:py-1.5 sm:text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-3 inline-flex w-fit items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2 font-averia text-base font-bold text-ssa-white transition-colors hover:bg-white/20 sm:mt-4 sm:px-6 sm:py-2.5 sm:text-lg"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
      {mascotImage && (
        <div
          className={`absolute bottom-0 right-0 hidden sm:block sm:right-8 md:right-12 lg:right-16 xl:right-20 ${mascotStyles[variant]}`}
        >
          <Image
            src={mascotImage}
            alt={mascotAlt}
            width={471}
            height={434}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      )}
    </div>
  )
}
