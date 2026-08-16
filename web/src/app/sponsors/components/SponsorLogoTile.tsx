import Image from 'next/image'

type SponsorLogoTileProps = {
  name: string
  logoUrl: string
  websiteUrl?: string
  hoverTitle: string
  hoverDescription: string
  onTouchSelect?: (trigger: HTMLElement) => void
}

function isExternalUrl(url?: string) {
  return url ? /^https?:\/\//.test(url) : false
}

function SponsorTileContent({
  name,
  logoUrl,
  hoverTitle,
  hoverDescription,
}: Omit<SponsorLogoTileProps, 'websiteUrl' | 'onTouchSelect'>) {
  return (
    <>
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        fill
        sizes="(min-width: 1280px) 190px, (min-width: 768px) 25vw, 33vw"
        className="object-cover"
      />

      {/* Always visible on mobile; hover activated from md upwards */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/80 opacity-100 transition-opacity duration-300 ease-out md:bg-none md:bg-black/50 md:opacity-0 md:backdrop-blur-[1.8px] md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
      />

      <span className="absolute inset-0 flex flex-col justify-end p-2 opacity-100 transition-opacity duration-300 ease-out md:gap-[10px] md:p-[18px] md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <span className="font-inter text-[10px] font-medium leading-[10px] tracking-[-0.2px] text-white sm:text-xs sm:leading-3 md:text-[18px] md:leading-[22px] md:tracking-[-0.4px]">
          {hoverTitle}
        </span>

        <span className="hidden font-dm-mono text-[9px] font-normal uppercase leading-none tracking-[0.04em] text-ssa-pink-light sm:block md:text-xs md:leading-3">
          {hoverDescription}
        </span>
      </span>
    </>
  )
}

export default function SponsorLogoTile({
  name,
  logoUrl,
  websiteUrl,
  hoverTitle,
  hoverDescription,
  onTouchSelect,
}: SponsorLogoTileProps) {
  const opensInNewTab = isExternalUrl(websiteUrl)

  const className =
    'group relative block aspect-square w-full overflow-hidden rounded-[6px] border-[1.6px] border-ssa-cream bg-ssa-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2'

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    const usesTouchPopup =
      window.matchMedia('(max-width: 1023px)').matches ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches

    if (!usesTouchPopup || !onTouchSelect) return

    event.preventDefault()
    onTouchSelect(event.currentTarget)
  }

  if (!opensInNewTab) {
    return (
      <button
        type="button"
        className={`${className} cursor-pointer`}
        aria-label={`View ${name} details`}
        onClick={handleClick}
      >
        <SponsorTileContent
          name={name}
          logoUrl={logoUrl}
          hoverTitle={hoverTitle}
          hoverDescription={hoverDescription}
        />
      </button>
    )
  }

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name}`}
      className={className}
      onClick={handleClick}
    >
      <SponsorTileContent
        name={name}
        logoUrl={logoUrl}
        hoverTitle={hoverTitle}
        hoverDescription={hoverDescription}
      />
    </a>
  )
}
