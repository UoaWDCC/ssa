import Image from 'next/image'

type HeroVariant = 'fullscreen' | 'compact'

interface HeroProps {
  title: string
  subtitle: string
  mascotImage?: string
  variant?: HeroVariant
}

export default function Hero({ title, subtitle, mascotImage, variant = 'fullscreen' }: HeroProps) {
  const isFullscreen = variant === 'fullscreen'

  // Container classes
  const containerClasses = `relative flex items-center justify-between rounded-2xl md:rounded-3xl bg-ssa-red overflow-hidden w-full ${
    isFullscreen
      ? 'aspect-[16/9] md:aspect-[12/7] min-h-screen md:min-h-auto'
      : 'aspect-[16/10] md:aspect-[16/9] min-h-80 md:min-h-96'
  } px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-12`

  // Title classes with responsive font sizes
  const titleClasses = `font-[family-name:var(--font-averia)] font-bold text-ssa-black leading-tight break-words ${
    isFullscreen
      ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[98px]'
      : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
  }`

  // Subtitle classes with responsive font sizes
  const subtitleClasses = `font-[family-name:var(--font-averia)] font-light text-ssa-black leading-tight break-words ${
    isFullscreen
      ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
      : 'text-base sm:text-lg md:text-xl lg:text-2xl'
  }`

  // Content wrapper classes
  const contentClasses = `flex flex-col gap-2 sm:gap-3 md:gap-4 z-10 ${
    isFullscreen ? 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl' : 'max-w-xs sm:max-w-sm md:max-w-lg'
  }`

  // Mascot wrapper classes
  const mascotContainerClasses = `hidden sm:block absolute bottom-0 right-2 sm:right-4 md:right-8 lg:right-12 ${
    isFullscreen ? 'h-48 sm:h-60 md:h-80 lg:h-96' : 'h-32 sm:h-40 md:h-56 lg:h-64'
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
