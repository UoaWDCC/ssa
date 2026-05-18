import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import type { IconType } from 'react-icons'

export type HighlightCardDetail = {
  icon?: IconType
  iconSrc?: string
  iconAlt?: string
  text: string
}

export type HighlightCardBadge =
  | string
  | {
      text: string
      variant?: 'red' | 'light'
    }

export type HighlightCardProps = {
  eyebrow: string
  title: string
  details?: HighlightCardDetail[]
  badges?: HighlightCardBadge[]
  description: React.ReactNode
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

function DetailIcon({ detail }: { detail: HighlightCardDetail }) {
  if (detail.icon) {
    const Icon = detail.icon

    return (
      <Icon
        aria-hidden="true"
        className="size-5 shrink-0 text-ssa-red lg:size-6"
      />
    )
  }

  if (!detail.iconSrc) return null

  return (
    <Image
      src={detail.iconSrc}
      alt={detail.iconAlt ?? ''}
      width={24}
      height={24}
      aria-hidden={detail.iconAlt ? undefined : true}
      className="size-5 shrink-0 object-contain lg:size-6"
    />
  )
}

function getBadgeText(badge: HighlightCardBadge) {
  return typeof badge === 'string' ? badge : badge.text
}

function getBadgeClassName(badge: HighlightCardBadge) {
  const variant = typeof badge === 'string' ? 'red' : (badge.variant ?? 'red')
  const variantClassName =
    variant === 'light'
      ? 'bg-[#FCE6BA] text-[#706F6F]'
      : 'bg-ssa-red text-ssa-yellow-light'

  return `flex items-center justify-center gap-[3.66px] rounded-[5px] px-4 py-2 text-center font-sans text-sm font-bold leading-none lg:text-[19px] lg:leading-[19px] ${variantClassName}`
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
    <article className="mx-auto grid w-full max-w-[1214px] overflow-hidden rounded-[32px] bg-ssa-card shadow-[0px_3px_4px_1px_#00000040,1px_-5px_4.3px_0px_#D5D5D54D] lg:min-h-[590px] lg:grid-cols-[minmax(0,1fr)_554px]">
      <div className="flex min-w-0 flex-col px-6 py-8 sm:px-8 lg:pb-[58px] lg:pl-14 lg:pr-10 lg:pt-11">
        <div>
          <div className="space-y-1.5 lg:space-y-2">
            <p className="font-averia text-base font-bold uppercase leading-tight tracking-wide text-ssa-muted-gold lg:text-[21px] lg:leading-6">
              {eyebrow}
            </p>
            <h2 className="font-averia text-4xl font-bold leading-tight text-ssa-red lg:text-[40px] lg:leading-[42px]">
              {title}
            </h2>
          </div>

          {(details.length > 0 || badges.length > 0) && (
            <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:gap-4">
              {details.length > 0 && (
                <ul className="flex flex-col gap-2 lg:gap-1.5">
                  {details.map((detail) => (
                    <li
                      key={detail.text}
                      className="flex items-center gap-3 font-averia text-lg font-light leading-tight text-ssa-grey lg:text-[23px] lg:leading-8"
                    >
                      <DetailIcon detail={detail} />
                      <span>{detail.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {badges.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <li
                      key={getBadgeText(badge)}
                      className={getBadgeClassName(badge)}
                    >
                      {getBadgeText(badge)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="my-5 h-px w-full bg-ssa-muted-gold/30 lg:my-6" />

          <div className="font-averia text-xl font-light leading-snug text-ssa-smoke-grey [&_p]:m-0 lg:text-[25px] lg:leading-[30px]">
            {description}
          </div>
        </div>

        <Link
          href={ctaHref}
          className="mt-6 inline-flex min-h-14 w-full max-w-[553px] items-center justify-center gap-4 rounded-full border-[3.5px] border-[#EC415E] bg-ssa-red px-6 font-averia text-xl font-bold leading-tight text-ssa-cta-text transition-colors hover:bg-[#FE6681D9] focus:outline-none focus:ring-2 focus:ring-ssa-muted-gold focus:ring-offset-2 focus:ring-offset-ssa-card lg:mt-auto lg:h-[68px] lg:text-[25px] lg:leading-[27px]"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="flex justify-end p-6 pt-0 sm:p-8 sm:pt-0 lg:items-start lg:py-[44px] lg:pl-8 lg:pr-[68px]">
        <div className="relative aspect-[486/488] w-full max-w-[486px] shrink-0 overflow-hidden rounded-[20px] lg:h-[488px] lg:w-[486px] lg:aspect-auto">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 486px, calc(100vw - 48px)"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  )
}
