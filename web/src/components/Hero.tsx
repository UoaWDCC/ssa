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
  fullscreen:
    'text-ssa-yellow-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  compact: 'text-ssa-yellow-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
}

const subtitleStyles: Record<HeroVariant, string> = {
  fullscreen:
    'text-ssa-yellow-light text-lg sm:text-xl md:text-2xl lg:text-3xl',
  compact: 'text-ssa-yellow-light text-sm sm:text-base md:text-lg lg:text-xl',
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
      <div
        className={`z-10 flex flex-col gap-2 sm:gap-3 md:gap-4 ${contentStyles[variant]}`}
      >
        <h1
          className={`font-averia font-bold leading-tight break-words ${titleStyles[variant]}`}
        >
          <div className="relative flex items-start">
            <span>{title}</span>
            {showSingaporeFlag && (
              <Image
                src="/sg_flag.svg"
                alt="Singapore Students Association flag"
                width={152}
                height={152}
                className="absolute -right-4 top-10 h-24 sm:h-28 md:h-32 w-auto"
              />
            )}
          </div>
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
                className="rounded-full border border-white/35 bg-white/10 px-3 py-1 font-averia text-xs font-bold uppercase tracking-[0.18em] text-ssa-yellow-light sm:px-4 sm:py-1.5 sm:text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-3 inline-flex w-fit items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2 font-averia text-base font-bold text-ssa-yellow-light transition-colors hover:bg-white/20 sm:mt-4 sm:px-6 sm:py-2.5 sm:text-lg"
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
