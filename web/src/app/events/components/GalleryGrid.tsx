'use client'

import { useState } from 'react'
import Image from 'next/image'
import ViewMoreButton from '@/app/events/components/ViewMoreButton'
import PhotoModal from '@/app/events/components/PhotoAlbum'

const INITIAL_COUNT = 25
const LOAD_MORE_COUNT = 25

interface GalleryImage {
  id: number | string
  url: string
  alt: string
}

interface GalleryGridProps {
  images: GalleryImage[]
  eventTitle: string
  eventDate: string
}

export default function GalleryGrid({
  images,
  eventTitle,
  eventDate,
}: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const visibleImages = images.slice(0, visibleCount)
  const hasMore = visibleCount < images.length

  const openModal = (index: number) => {
    setSelectedIndex(index)
    setModalOpen(true)
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-32">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-[6.6px] w-full">
          {visibleImages.map((img, index) => (
            <button
              type="button"
              key={img.id}
              onClick={() => openModal(index)}
              className="relative aspect-[243.88/278.72] rounded-[8.21px] overflow-hidden group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                unoptimized={
                  /^https?:\/\//.test(img.url) || img.url.startsWith('/api/')
                }
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        <p className="text-sm text-ssa-category-text">
          Showing {visibleImages.length} of {images.length} results
        </p>

        <ViewMoreButton
          onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
          hasMore={hasMore}
        />
      </div>

      <PhotoModal
        images={images}
        currentIndex={selectedIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setSelectedIndex}
        eventTitle={eventTitle}
        eventDate={eventDate}
      />
    </>
  )
}
