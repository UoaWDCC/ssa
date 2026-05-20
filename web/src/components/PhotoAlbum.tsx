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
    const img = new window.Image()
    img.src = current.url
    img.onload = () => setImgAspect(img.naturalWidth / img.naturalHeight)
  }, [current.url])

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Outer panel — controls background and width */}
      <div
        className="relative w-full bg-ssa-yellow-light rounded-t-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner content — width adapts to image aspect ratio */}
        <div
          className="pt-8 pb-12 mx-auto"
          style={
            imgAspect
              ? { width: `min(${imgAspect * 60}vh, 100%)` }
              : { width: '100%' }
          }
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ssa-light-grey/20 flex items-center justify-center text-ssa-white hover:bg-ssa-skin-yellow hover:text-ssa-light-brown transition-colors"
          >
            <ClearIcon fontSize="small" />
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-4 pr-10">
            <div>
              <h2 className="text-xl font-bold font-averia text-ssa-black">
                {eventTitle}
              </h2>
              <p className="text-sm font-averia text-ssa-black uppercase tracking-wide">
                {eventDate}
              </p>
            </div>
            <span className="text-2xl font-bold font-averia text-ssa-light-grey">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="object-cover"
            />

            {/* Left arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-[#FFF7E9]/60 hover:bg-[#FFF7E9]/90 transition-colors duration-200 border border-white"
            >
              <ArrowBackIcon fontSize="small" />
            </button>

            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 bg-[#FFF7E9]/60 hover:bg-[#FFF7E9]/90 transition-colors duration-200 border border-white"
            >
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>

          {/* Footer download */}
          <div className="flex items-center justify-end mt-4">
            <a
              href={current.url}
              download
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-ssa-red text-white font-averia font-bold hover:opacity-90 transition-opacity"
            >
              Download <DownloadIcon fontSize="small" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
