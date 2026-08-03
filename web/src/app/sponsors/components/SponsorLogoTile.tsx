import Image from 'next/image'

type SponsorLogoTileProps = {
  name: string
  logoUrl: string
  websiteUrl?: string
  hoverTitle: string
  hoverDescription: string
}

function isExternalUrl(url?: string) {
  return url ? /^https?:\/\//.test(url) : false
}

function SponsorTileContent({
  name,
  logoUrl,
  hoverTitle,
  hoverDescription,
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
        className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-[1.8px] transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <span className="absolute inset-0 flex flex-col justify-end gap-1 p-2 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 sm:gap-2 sm:p-3 xl:gap-[10px] xl:p-[18px]">
        <span className="font-inter text-[10px] font-medium leading-tight tracking-[-0.2px] text-white sm:text-sm xl:text-[18px] xl:leading-[22px] xl:tracking-[-0.4px]">
          {hoverTitle}
        </span>

        <span className="font-dm-mono text-[7px] font-normal uppercase leading-none tracking-[0.04em] text-ssa-pink-light sm:text-[9px] xl:text-xs xl:leading-3">
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
}: SponsorLogoTileProps) {
  const opensInNewTab = isExternalUrl(websiteUrl)

  const className =
    'group relative block aspect-square w-full overflow-hidden rounded-[6px] border-[1.6px] border-ssa-yellow bg-ssa-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red focus-visible:ring-offset-2'

  if (!opensInNewTab) {
    return (
      <div className={className} aria-label={name}>
        <SponsorTileContent
          name={name}
          logoUrl={logoUrl}
          hoverTitle={hoverTitle}
          hoverDescription={hoverDescription}
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
        hoverTitle={hoverTitle}
        hoverDescription={hoverDescription}
      />
    </a>
  )
}
