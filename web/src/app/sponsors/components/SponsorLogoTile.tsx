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
  hoverOverlayClassName,
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
        sizes="(min-width: 1024px) 222px, calc((100vw - 80px) / 4)"
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-[16px] opacity-0 backdrop-blur-[3px] transition-opacity duration-500 ease-out group-hover:opacity-100 ${hoverOverlayClassName}`}
      />
      <span
        className={`absolute inset-0 flex flex-col justify-end gap-3 p-5 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 ${hoverTextClassName}`}
      >
        <span className="font-averia text-[21px] font-bold leading-tight">
          {hoverTitle}
        </span>
        <span className="flex items-center gap-[5px] self-start font-alegreya text-[17px] font-medium leading-tight">
          <span
            aria-hidden="true"
            className="h-[30px] w-0 shrink-0 border-l-2 border-current"
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
    'group relative block size-[83px] overflow-hidden rounded-md border-2 border-ssa-pink-light bg-ssa-white sm:size-[120px] sm:rounded-lg md:size-[160px] lg:size-[222px] lg:rounded-[20px] lg:border-4'

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
