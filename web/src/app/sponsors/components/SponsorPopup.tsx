'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { FaXmark } from 'react-icons/fa6'

type SponsorPopupProps = {
  name: string
  logoUrl: string
  websiteUrl?: string
  onClose: () => void
}

export default function SponsorPopup({
  name,
  logoUrl,
  websiteUrl,
  onClose,
}: SponsorPopupProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const content = (
    <>
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        fill
        sizes="354px"
        className="object-cover"
      />
    </>
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
        className="animate-slide-up h-[min(417px,calc(100dvh-32px))] w-[min(366px,calc(100vw-32px))] rounded-[12px] bg-ssa-background p-[6px] shadow-[0_2.67px_6.93px_0_rgb(255_255_255_/_30%),0_2px_2.67px_0.67px_rgb(84_84_84_/_25%)] motion-reduce:animate-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[20px] border-4 border-ssa-pink-light bg-ssa-white">
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name}`}
              className="absolute inset-0"
            >
              {content}
            </a>
          ) : (
            content
          )}

          <span id="sponsor-popup-title" className="sr-only">
            {name}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close sponsor details"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-ssa-white bg-ssa-grey/70 text-ssa-white transition-colors hover:bg-ssa-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ssa-white"
          >
            <FaXmark aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
