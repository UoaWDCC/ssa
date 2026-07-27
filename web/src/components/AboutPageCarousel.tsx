'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

interface CarouselImage {
  src: string
  alt: string
}

interface CarouselProps {
  images: CarouselImage[]
  autoPlayInterval?: number
}

export default function Carousel({
  images,
  autoPlayInterval = 6000,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)
  }, [images.length, autoPlayInterval])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index)
      startTimer()
    },
    [startTimer],
  )

  const goPrev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length)
  }, [current, goTo, images.length])

  const goNext = useCallback(() => {
    goTo((current + 1) % images.length)
  }, [current, goTo, images.length])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goTo((current - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        goTo((current + 1) % images.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, goTo, images.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goNext()
        } else {
          goPrev()
        }
      }
      touchStartX.current = null
    },
    [goNext, goPrev],
  )

  return (
    <div className="relative drop-shadow-xl">
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[16/7] overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative h-full w-full shrink-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev button — bare chevron, no background */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-colors drop-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 md:w-12 md:h-12"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next button — bare chevron, no background */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-colors drop-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 md:w-12 md:h-12"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 pt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="flex items-center justify-center w-6 h-6 cursor-pointer"
          >
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === current ? 'bg-ssa-red scale-125' : 'bg-ssa-red/30'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
