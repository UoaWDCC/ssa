'use client'

import { useEffect, useCallback, useState } from 'react'
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
  eventTitle,
  eventDate,
}: PhotoAlbumProps) {
  const total = images.length
  const current = images[currentIndex]
  const [imgAspect, setImgAspect] = useState<number | null>(null)

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Outer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full bg-ssa-yellow-light rounded-t-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner content */}
        <div
          className="px-4 md:px-12 pt-12 pb-6 md:pb-12 mx-auto"
          style={
            imgAspect
              ? { width: `min(${imgAspect * 60}vh, 100%)` }
              : { width: '100%' }
          }
        >
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ssa-light-grey/20 flex items-center justify-center text-ssa-white hover:bg-ssa-skin-yellow hover:text-ssa-light-brown transition-colors cursor-pointer"
          >
            <ClearIcon fontSize="small" />
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-4 pr-10">
            <div>
              <h2
                id="modal-title"
                className="text-xl font-bold font-averia text-ssa-black"
              >
                {eventTitle}
              </h2>
              <p className="text-sm font-averia text-ssa-black uppercase tracking-wide">
                {eventDate}
              </p>
            </div>
            <span className="text-lg md:text-2xl font-bold font-averia text-ssa-light-grey self-end">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="object-cover"
              onLoad={(e) => {
                const img = e.currentTarget
                setImgAspect(img.naturalWidth / img.naturalHeight)
              }}
            />

            {/* Left arrow */}
            <button
              aria-label="Previous photo"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-ssa-grey bg-ssa-yellow-light/60 hover:bg-ssa-yellow-light/90 transition-colors duration-200 border border-white cursor-pointer"
            >
              <ArrowBackIcon fontSize="small" />
            </button>

            {/* Right arrow */}
            <button
              aria-label="Next photo"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-ssa-grey bg-ssa-yellow-light/60 hover:bg-ssa-yellow-light/90 transition-colors duration-200 border border-white cursor-pointer"
            >
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>

          {/* Footer download */}
          <div className="flex items-center justify-end mt-4">
            <a
              href={current.url}
              download
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-ssa-red-light text-white font-averia font-bold hover:bg-ssa-red transition-opacity border-[3px] border-ssa-red cursor-pointer"
            >
              Download <DownloadIcon fontSize="small" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
