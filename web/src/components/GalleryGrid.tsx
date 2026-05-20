'use client'

import { useState } from 'react'
import Image from 'next/image'
import ViewMoreButton from '@/components/ViewMoreButton'
import PhotoModal from '@/components/PhotoAlbum'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

const INITIAL_COUNT = 12
const LOAD_MORE_COUNT = 30

interface GalleryImage {
  id: number
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
      <div className="flex flex-col items-center gap-10 max-w-8xl mx-auto w-full px-30 py-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {visibleImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openModal(index)}
              className="relative aspect-square rounded-xl overflow-hidden shadow-[0_3px_4px_1px_rgba(0,0,0,0.25),0_4px_10px_0px_rgba(255,255,255,0.30)] group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div
                  style={{
                    backgroundColor: '#FFF7E9',
                    border: '3px solid #D4CECE',
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                  }}
                  className="flex items-center justify-center"
                >
                  <ZoomInIcon style={{ color: '#C9A84C', fontSize: 38 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
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
