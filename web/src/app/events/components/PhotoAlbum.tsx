'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DownloadIcon from '@mui/icons-material/Download'

interface GalleryImage {
  id: number | string
  url: string
  alt: string
}

interface PhotoAlbumProps {
  images: GalleryImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
  eventTitle: string
  eventDate: string
}

export default function PhotoAlbum({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: PhotoAlbumProps) {
  const total = images.length
  const current = images[currentIndex]

  const handlePrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? total - 1 : currentIndex - 1)
  }, [currentIndex, total, onNavigate])

  const handleNext = useCallback(() => {
    onNavigate(currentIndex === total - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, total, onNavigate])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handlePrev, handleNext, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null
  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        className="relative mx-auto flex h-full w-full max-w-[1538px] items-center justify-center px-14 sm:px-16 md:aspect-[1538/771] md:h-auto md:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo box — positioning context for the download/close buttons and
            the bottom counter, since those sit on the visible image itself */}
        <div className="relative h-full max-h-full w-full overflow-hidden rounded-[10.13px] md:absolute md:inset-y-0 md:left-1/2 md:h-auto md:w-[78.94%] md:max-h-none md:-translate-x-1/2">
          <Image
            src={current.url}
            alt={current.alt}
            fill
            unoptimized={
              /^https?:\/\//.test(current.url) ||
              current.url.startsWith('/api/')
            }
            className="object-contain md:object-cover"
          />

          <div className="absolute top-4 right-4 flex items-center gap-[6.25px]">
            <a
              href={current.url}
              download
              aria-label="Download"
              className="flex h-[41.24px] w-[41.24px] items-center justify-center rounded-full border-[1.75px] border-ssa-overlay-border bg-ssa-muted-grey/50 text-white hover:bg-ssa-muted-grey/70 transition-colors cursor-pointer"
            >
              <DownloadIcon fontSize="small" />
            </a>
            <button
              aria-label="Close"
              onClick={onClose}
              className="flex h-[41.24px] w-[41.24px] items-center justify-center rounded-full border-[1.75px] border-ssa-overlay-border bg-ssa-muted-grey/50 text-white hover:bg-ssa-muted-grey/70 transition-colors cursor-pointer"
            >
              <ClearIcon fontSize="small" />
            </button>
          </div>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-be-vietnam-pro text-lg font-semibold text-white/90">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Arrows pinned to the outer stage edges, out in the black margin —
            not centered over the photo. Pulled further in on small screens
            (where there's no side margin) so they never sit on top of the image. */}
        <button
          aria-label="Previous photo"
          onClick={handlePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer sm:left-2 md:left-4"
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 28, sm: 36, md: 48 } }} />
        </button>
        <button
          aria-label="Next photo"
          onClick={handleNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer sm:right-2 md:right-4"
        >
          <ArrowForwardIcon sx={{ fontSize: { xs: 28, sm: 36, md: 48 } }} />
        </button>
      </div>
    </div>
  )
}
