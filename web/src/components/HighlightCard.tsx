import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'

export type HighlightCardDetail = {
  iconSrc?: string
  iconAlt?: string
  text: string
}

export type HighlightCardProps = {
  eyebrow: string
  title: string
  details?: HighlightCardDetail[]
  badges?: string[]
  description: React.ReactNode
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

export function HighlightCard({
  eyebrow,
  title,
  details = [],
  badges = [],
  description,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
}: HighlightCardProps) {
  return (
    // Custom shadow values are taken directly from the Figma card effect
    // to match the shared highlight card design.
    <article className="mx-auto grid w-full max-w-[1214px] overflow-hidden rounded-[32px] bg-ssa-card shadow-[0px_3px_4px_1px_#00000040,1px_-5px_4.3px_0px_#D5D5D54D] lg:min-h-[590px] lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-6 py-8 sm:px-8 lg:py-11 lg:pl-14 lg:pr-8">
        <div className="space-y-3">
          <p className="font-averia text-base font-bold uppercase tracking-wide text-ssa-muted-gold lg:text-[21.47px] lg:leading-none">
            {eyebrow}
          </p>
          <h2 className="font-averia text-4xl font-bold leading-tight text-ssa-red lg:text-[40px] lg:leading-none">
            {title}
          </h2>
        </div>

        {(details.length > 0 || badges.length > 0) && (
          <div className="mt-5 flex flex-col gap-4 lg:mt-7">
            {details.length > 0 && (
              <ul className="flex flex-col gap-3">
                {details.map((detail) => (
                  <li
                    key={detail.text}
                    className="flex items-center gap-3 font-averia text-lg font-light leading-tight text-ssa-grey lg:text-[23.32px]"
                  >
                    {detail.iconSrc && (
                      <Image
                        src={detail.iconSrc}
                        alt={detail.iconAlt ?? ''}
                        width={24}
                        height={24}
                        aria-hidden={detail.iconAlt ? undefined : true}
                        className="size-5 shrink-0 object-contain lg:size-6"
                      />
                    )}
                    <span>{detail.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {badges.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-full bg-ssa-red px-4 py-2 font-averia text-sm font-bold leading-none text-ssa-yellow-light lg:text-base"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="my-6 h-px w-full bg-ssa-muted-gold/30 lg:my-8" />

        <div className="font-averia text-xl font-light leading-snug text-ssa-grey lg:text-[25px]">
          {description}
        </div>

        <Link
          href={ctaHref}
          className="mt-8 inline-flex min-h-14 w-full max-w-[553px] items-center justify-between gap-4 rounded-full bg-ssa-card-cta px-6 font-averia text-xl font-bold text-ssa-muted-gold transition-colors hover:bg-ssa-card-cta-hover focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 focus:ring-offset-ssa-card lg:mt-auto lg:h-[68px] lg:text-[25px]"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="flex p-6 pt-0 sm:p-8 sm:pt-0 lg:py-11 lg:pl-8 lg:pr-[68px]">
        <div className="relative min-h-72 w-full overflow-hidden rounded-[28px] lg:min-h-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  )
}
