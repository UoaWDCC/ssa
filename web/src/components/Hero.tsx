'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
  variant?: HeroVariant
}

export default function Hero({
  title,
  subtitle,
  mascotImage,
  variant,
}: HeroProps) {

  const pathname = usePathname()

  // if `variant` is explicitly provided, it wins; otherwise fullscreen only on '/'
  const isFullscreen = variant ? variant === 'fullscreen' : pathname === '/'

  // Container classes
  const containerClasses = `relative flex ${isFullscreen ? 'items-start justify-between' : 'items-end justify-between'
    } rounded-b-2xl md:rounded-b-3xl bg-ssa-red overflow-hidden w-full ${isFullscreen
      ? 'min-h-[350px] md:min-h-[500px] lg:min-h-[600px]'
      : 'min-h-48 sm:min-h-56 md:min-h-72 lg:min-h-96'
    } px-4 sm:px-8 md:px-12 lg:px-16 ${isFullscreen
      ? 'pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12'
      : 'py-6 sm:py-8 md:py-12 pb-8 sm:pb-10 md:pb-12'
    }`

  // Title classes
  const titleClasses = `font-[family-name:var(--font-averia)] font-bold leading-tight break-words ${isFullscreen
    ? 'text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
    : 'text-[#434242] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
    }`

  // Subtitle classes
  const subtitleClasses = `font-[family-name:var(--font-averia)] font-light leading-tight break-words ${isFullscreen
    ? 'text-black text-lg sm:text-xl md:text-2xl lg:text-3xl'
    : 'text-[#434242] text-sm sm:text-base md:text-lg lg:text-xl'
    }`

  // Content wrapper classes
  const contentClasses = `flex flex-col gap-2 sm:gap-3 md:gap-4 z-10 ${isFullscreen
    ? 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl pr-0 sm:pr-32 md:pr-40 lg:pr-48 ml-0 md:ml-12 lg:ml-24'
    : 'max-w-xs sm:max-w-sm md:max-w-lg pl-4 sm:pl-6 md:pl-8 lg:pl-10'
    }`

  // Mascot wrapper classes
  const mascotContainerClasses = `hidden sm:block absolute bottom-0 right-0 sm:right-8 md:right-12 lg:right-16 xl:right-20 ${isFullscreen
    ? 'h-48 sm:h-56 md:h-80 lg:h-96'
    : 'h-36 sm:h-40 md:h-48 lg:h-56'
    }`

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <h1 className={titleClasses}>{title}</h1>
        <p className={subtitleClasses}>{subtitle}</p>
      </div>
      {mascotImage && (
        <div className={mascotContainerClasses}>
          <Image
            src={mascotImage}
            alt="mascot"
            width={470.92}
            height={433.92}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      )}
    </div>
  )
}
