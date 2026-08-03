import Image from 'next/image'

type SponsorLogoTileProps = {
  name: string
  logoUrl: string
  websiteUrl?: string
  hoverOverlayClassName?: string
  hoverTitle: string
  hoverDescription: string
  hoverTextClassName: string
}

function isExternalUrl(url?: string) {
  return url ? /^https?:\/\//.test(url) : false
}

function SponsorTileContent({
  name,
  logoUrl,
  hoverOverlayClassName = 'bg-ssa-pink-light/60',
  hoverTitle,
  hoverDescription,
  hoverTextClassName,
}: Omit<SponsorLogoTileProps, 'websiteUrl'>) {
  return (
    <>
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        fill
        sizes="(min-width: 1280px) 190px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover"
      />

      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-[6px] opacity-0 backdrop-blur-[3px] transition-opacity duration-500 ease-out group-hover:opacity-100 ${hoverOverlayClassName}`}
      />

      <span
        className={`absolute inset-0 flex flex-col justify-end gap-1 p-2 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 sm:gap-2 sm:p-4 lg:gap-3 lg:p-5 ${hoverTextClassName}`}
      >
        <span className="font-averia text-[8px] font-bold leading-tight sm:text-base lg:text-[19px]">
          {hoverTitle}
        </span>

        <span className="flex items-center gap-[5px] self-start font-alegreya text-[6px] font-medium leading-tight sm:text-sm lg:text-base">
          <span
            aria-hidden="true"
            className="h-3 w-0 shrink-0 border-l border-current sm:h-6 sm:border-l-2 lg:h-[30px]"
          />

          <span>{hoverDescription}</span>
        </span>
      </span>
    </>
  )
}

export default function SponsorLogoTile({
  name,
  logoUrl,
  websiteUrl,
  hoverOverlayClassName = 'bg-ssa-pink-light/60',
  hoverTitle,
  hoverDescription,
  hoverTextClassName,
}: SponsorLogoTileProps) {
  const opensInNewTab = isExternalUrl(websiteUrl)

  const className =
    'group relative block aspect-square w-full overflow-hidden rounded-[6px] border border-ssa-yellow bg-ssa-white'

  if (!opensInNewTab) {
    return (
      <div className={className} aria-label={name}>
        <SponsorTileContent
          name={name}
          logoUrl={logoUrl}
          hoverOverlayClassName={hoverOverlayClassName}
          hoverTitle={hoverTitle}
          hoverDescription={hoverDescription}
          hoverTextClassName={hoverTextClassName}
        />
      </div>
    )
  }

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name}`}
      className={className}
    >
      <SponsorTileContent
        name={name}
        logoUrl={logoUrl}
        hoverOverlayClassName={hoverOverlayClassName}
        hoverTitle={hoverTitle}
        hoverDescription={hoverDescription}
        hoverTextClassName={hoverTextClassName}
      />
    </a>
  )
}
