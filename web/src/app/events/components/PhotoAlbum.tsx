'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DownloadIcon from '@mui/icons-material/Download'

interface GalleryImage {
  id: number
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
        className="relative mx-auto w-full max-w-[1538px] aspect-[1538/771]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo box — positioning context for the download/close buttons and
            the bottom counter, since those sit on the visible image itself */}
        <div className="absolute inset-y-0 left-1/2 w-[78.94%] -translate-x-1/2 overflow-hidden rounded-[10.13px]">
          <Image
            src={current.url}
            alt={current.alt}
            fill
            className="object-cover"
          />

          <div className="absolute top-4 right-4 flex items-center gap-3">
            <a
              href={current.url}
              download
              aria-label="Download"
              className="flex h-[64.85px] w-[64.85px] items-center justify-center rounded-[6.48px] border-[1.62px] border-[#8c8880] bg-[#f2ebdd]/80 text-ssa-grey hover:bg-[#f2ebdd] transition-colors cursor-pointer"
            >
              <DownloadIcon fontSize="small" />
            </a>
            <button
              aria-label="Close"
              onClick={onClose}
              className="flex h-[48.64px] w-[48.64px] items-center justify-center rounded-full bg-transparent text-ssa-grey hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ClearIcon sx={{ fontSize: '26.96px' }} />
            </button>
          </div>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-be-vietnam-pro text-lg font-semibold text-white/90">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Arrows pinned to the outer stage edges, out in the black margin —
            not centered over the photo */}
        <button
          aria-label="Previous photo"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
        </button>
        <button
          aria-label="Next photo"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowForwardIcon sx={{ fontSize: { xs: 32, md: 48 } }} />
        </button>
      </div>
    </div>
  )
}
