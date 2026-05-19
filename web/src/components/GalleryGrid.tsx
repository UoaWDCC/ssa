'use client'

import { useState } from 'react'
import Image from 'next/image'
import ViewMoreButton from '@/components/ViewMoreButton'

const INITIAL_COUNT = 12 // 3x4
const LOAD_MORE_COUNT = 30 // 10 rows x 3 cols

interface GalleryImage {
  id: number
  url: string
  alt: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleImages = images.slice(0, visibleCount)
  const hasMore = visibleCount < images.length

  return (
    <div className="flex flex-col items-center gap-10 max-w-8xl mx-auto w-full px-30 py-30">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
        {visibleImages.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-[0_3px_4px_1px_rgba(0,0,0,0.25),0_4px_10px_0px_rgba(255,255,255,0.30)]"
          >
            <Image src={img.url} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
      <ViewMoreButton
        onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
        hasMore={hasMore}
      />
    </div>
  )
}
