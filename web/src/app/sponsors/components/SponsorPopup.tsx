'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa6'

import Button from '@/components/Button'
import { toExternalHref } from '@/lib/external-url'

type SponsorPopupProps = {
  name: string
  logoUrl: string
  websiteUrl?: string
  memberPerk?: string
  categoryLabel?: string
  onClose: () => void
}

export default function SponsorPopup({
  name,
  logoUrl,
  websiteUrl,
  memberPerk,
  categoryLabel,
  onClose,
}: SponsorPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const externalHref = toExternalHref(websiteUrl)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    popupRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const sponsorImage = (
    <Image
      src={logoUrl}
      alt={`${name} logo`}
      fill
      sizes="354px"
      className="scale-[1.03] object-cover blur-[2px]"
    />
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ssa-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-popup-title"
      onClick={onClose}
    >
      <div
        ref={popupRef}
        tabIndex={-1}
        className="animate-slide-up relative h-[min(417px,calc(100dvh-32px))] w-[min(366px,calc(100vw-32px))] rounded-xl bg-ssa-background p-1.5 shadow-[0_2.67px_6.93px_0_rgb(255_255_255_/_30%),0_2px_2.67px_0.67px_rgb(84_84_84_/_25%)] outline-none motion-reduce:animate-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex h-full w-full flex-row justify-between overflow-hidden rounded-[10px] bg-ssa-white shadow-[0_0_1.9px_0_rgb(67_66_66_/_40%)]">
          {externalHref ? (
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name}`}
              className="absolute inset-0"
            >
              {sponsorImage}
            </a>
          ) : (
            sponsorImage
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 from-[5%] to-black to-[85%]"
          />

          <span id="sponsor-popup-title" className="sr-only">
            {name}
          </span>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 flex w-[calc(100%_-_52px)] max-w-[314px] -translate-x-1/2 flex-col">
          <div className="flex flex-col items-start gap-2">
            <h2 className="max-w-full break-words font-be-vietnam-pro text-2xl font-bold leading-[29px] tracking-[-1px] text-ssa-white">
              {name}
            </h2>

            {categoryLabel && (
              <span className="inline-flex h-5 max-w-full items-center justify-center overflow-hidden rounded-[2px] bg-ssa-background/80 px-1.5 font-dm-mono text-[11px] font-normal uppercase leading-none tracking-[0.04em] text-ssa-muted-grey backdrop-blur-[4px]">
                {categoryLabel}
              </span>
            )}
          </div>

          {memberPerk && (
            <p className="mt-[25px] flex max-w-full items-center gap-[5px] font-inter text-base font-normal leading-6 text-ssa-white">
              <FaStar aria-hidden="true" className="size-4 shrink-0" />
              <span>{memberPerk}</span>
            </p>
          )}

          {externalHref && (
            <Button
              href={externalHref}
              target="_blank"
              size="long"
              variant="light"
              color="yellow"
              arrow={false}
              className="mt-[30px] !h-11 !bg-ssa-yellow-light !py-0 !text-ssa-muted-grey hover:!bg-ssa-yellow-light hover:!text-ssa-muted-grey"
            >
              <span className="inline-flex items-center gap-4">
                <span>CHECK US OUT</span>
                <FiArrowRight aria-hidden="true" className="size-5" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
