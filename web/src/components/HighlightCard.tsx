import Image from 'next/image'
import type React from 'react'
import type { IconType } from 'react-icons'
import Button from '@/components/Button'

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
        className="size-[18px] shrink-0 text-ssa-black"
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
      className="size-[18px] shrink-0 object-contain brightness-0"
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
      ? 'bg-ssa-muted-cream text-ssa-muted-taupe'
      : 'bg-ssa-red-light text-white'

  return `flex items-center justify-center rounded-[2px] px-2 py-[5px] text-center font-dm-mono text-xs font-normal uppercase leading-3 ${variantClassName}`
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
    <article className="mx-auto min-h-[366px] w-full max-w-[360px] overflow-hidden rounded-[14px] bg-ssa-yellow-light p-6 shadow-[0_1px_3px_1px_#00000026] md:max-w-[720px] xl:grid xl:h-[395px] xl:min-h-0 xl:max-w-[1250px] xl:grid-cols-2 xl:gap-9 xl:p-9">
      <div className="relative hidden min-h-0 w-full overflow-hidden rounded-[16px] xl:block xl:h-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1400px) 571px, (min-width: 1280px) calc(50vw - 82px), (min-width: 768px) calc(100vw - 144px), calc(100vw - 96px)"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col font-be-vietnam-pro xl:h-full">
        <div>
          <p className="font-dm-mono text-xs font-normal uppercase leading-4 tracking-[1px] text-ssa-muted-taupe xl:font-medium">
            {eyebrow}
          </p>
          <h2 className="mt-[2px] text-2xl font-bold leading-7 text-ssa-red">
            {title}
          </h2>

          {badges.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-2">
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

          {details.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1 xl:mt-8 xl:gap-0">
              {details.map((detail) => (
                <li
                  key={detail.text}
                  className="flex min-w-0 items-center gap-2 text-base font-normal leading-6 text-ssa-grey"
                >
                  <DetailIcon detail={detail} />
                  <span>{detail.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4 xl:mt-auto">
          <div className="font-inter text-base font-normal leading-6 text-ssa-grey [&_p]:m-0">
            {description}
          </div>

          <Button
            href={ctaHref}
            size="long"
            variant="filled"
            color="red"
            className="max-w-[566px] shrink-0"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
