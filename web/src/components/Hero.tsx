import Image from 'next/image'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
  mascotAlt?: string
  variant?: HeroVariant
}

const containerStyles: Record<HeroVariant, string> = {
  fullscreen:
    'items-start min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12',
  compact:
    'items-end min-h-48 sm:min-h-56 md:min-h-72 lg:min-h-96 py-6 sm:py-8 md:py-12 pb-8 sm:pb-10 md:pb-12',
}

const titleStyles: Record<HeroVariant, string> = {
  fullscreen: 'text-ssa-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  compact: 'text-ssa-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
}

const subtitleStyles: Record<HeroVariant, string> = {
  fullscreen: 'text-ssa-black text-lg sm:text-xl md:text-2xl lg:text-3xl',
  compact: 'text-ssa-black text-sm sm:text-base md:text-lg lg:text-xl',
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
}: Readonly<HeroProps>) {
  return (
    <div
      className={`relative flex justify-between rounded-b-2xl md:rounded-b-3xl bg-ssa-red overflow-hidden w-full px-4 sm:px-8 md:px-12 lg:px-16 ${containerStyles[variant]}`}
    >
      <div
        className={`flex flex-col gap-2 sm:gap-3 md:gap-4 z-10 ${contentStyles[variant]}`}
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
      </div>
      {mascotImage && (
        <div
          className={`hidden sm:block absolute bottom-0 right-0 sm:right-8 md:right-12 lg:right-16 xl:right-20 ${mascotStyles[variant]}`}
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
