"use client"

import Image from 'next/image'
import { usePathname } from 'next/navigation'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
  variant?: HeroVariant
}

export default function Hero({ title, subtitle, mascotImage, variant }: HeroProps) {
  const pathname = usePathname()

  // if `variant` is explicitly provided, it wins; otherwise fullscreen only on '/'
  const isFullscreen = variant ? variant === 'fullscreen' : pathname === '/'

  // Container classes
  const containerClasses = `relative flex ${
    isFullscreen ? 'items-start justify-between' : 'items-end justify-between'
  } rounded-b-2xl md:rounded-b-3xl bg-ssa-red overflow-hidden w-full ${
    isFullscreen
      ? 'min-h-[280px] md:min-h-[320px]'
      : 'min-h-56 sm:min-h-64 md:min-h-72 lg:min-h-80'
  } ${
    isFullscreen ? 'px-4 sm:px-8 md:px-12 lg:px-16' : 'px-4 sm:px-8 md:px-12 lg:px-16'
  } ${
    isFullscreen ? 'pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12' : 'py-6 sm:py-8 md:py-12 pb-8 sm:pb-10 md:pb-12'
  }`

  // Title classes
  const titleClasses = `font-[family-name:var(--font-averia)] font-bold text-ssa-black leading-tight break-words ${
    isFullscreen
      ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
  }`

  // Subtitle classes
  const subtitleClasses = `font-[family-name:var(--font-averia)] font-light text-ssa-black leading-tight break-words ${
    isFullscreen
      ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
      : 'text-sm sm:text-base md:text-lg lg:text-xl'
  }`

  // Content wrapper classes
  const contentClasses = `flex flex-col gap-2 sm:gap-3 md:gap-4 z-10 ${
    isFullscreen ? 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl pr-0 sm:pr-32 md:pr-40 lg:pr-48' : 'max-w-xs sm:max-w-sm md:max-w-lg pl-4 sm:pl-6 md:pl-8 lg:pl-10'
  }`

  // Mascot wrapper classes
  const mascotContainerClasses = `hidden sm:block absolute ${
    isFullscreen ? 'bottom-4 sm:bottom-6 md:bottom-8' : 'bottom-0'
  } right-0 sm:right-12 md:right-20 lg:right-32 ${
    isFullscreen ? 'h-40 sm:h-48 md:h-64 lg:h-72' : 'h-32 sm:h-40 md:h-56 lg:h-64'
  }`

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <h1 className={titleClasses}>
          {title}
        </h1>
        <p className={subtitleClasses}>
          {subtitle}
        </p>
      </div>
      {mascotImage && (
        <div className={mascotContainerClasses}>
          <Image
            src={mascotImage}
            alt="mascot"
            width={470.92}
            height={433.92}
            className="h-full w-auto object-contain opacity-70"
            priority
          />
        </div>
      )}
    </div>
  )
}
