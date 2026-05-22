'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const carouselImages = [
  {
    src: '/carousel_two.jpg',
    alt: 'SSA Event 1',
    title: 'VAUSA X SSA Mid-Autumn Summer Festival',
    albumHref: 'https://example.com/album1',
  },
  {
    src: '/carousel_one.jpg',
    alt: 'SSA Event 2',
    title: 'SSA Welcome Night',
    albumHref: 'https://example.com/album2',
  },
  {
    src: '/carousel_two.jpg',
    alt: 'SSA Event 3',
    title: 'SSA Culture Night',
    albumHref: 'https://example.com/album3',
  },
  {
    src: '/carousel_one.jpg',
    alt: 'SSA Event 4',
    title: 'SSA Orientation 2024',
    albumHref: 'https://example.com/album4',
  },
  {
    src: '/carousel_two.jpg',
    alt: 'SSA Event 5',
    title: 'SSA Annual Dinner',
    albumHref: 'https://example.com/album5',
  },
]

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length)
    }, 6000)
  }, [])

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
    setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length)
    startTimer()
  }, [startTimer])

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % carouselImages.length)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext()
        else goPrev()
      }
      touchStartX.current = null
    },
    [goNext, goPrev],
  )

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="relative">
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
          onFocus={stopTimer}
          onBlur={startTimer}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="relative h-full w-full shrink-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Dark overlay at 35% opacity */}
                <div className="absolute inset-0 bg-black/35" />
                {/* Title top left */}
                <p className="absolute top-4 left-4 text-white font-averia font-semibold text-xl md:text-2xl drop-shadow">
                  {image.title}
                </p>
                {/* View Album bottom right */}
                <div className="absolute bottom-4 right-4">
                  <a
                    href={image.albumHref}
                    className="inline-flex items-center gap-2 border-2 rounded-xl border-ssa-white bg-transparent text-ssa-white font-averia font-semibold text-sm md:text-base px-5 py-2 transition-colors cursor-pointer hover:bg-white/20"
                  >
                    View Album →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dots centered bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="flex items-center justify-center w-6 h-6 cursor-pointer"
              >
                <span
                  className={`block w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === current ? 'bg-ssa-red scale-125' : 'bg-white/70'}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Prev button */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer text-white drop-shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-15 h-15"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer text-white drop-shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-15 h-15"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
