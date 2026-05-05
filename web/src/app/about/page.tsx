'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Hero from '@/components/Hero'

// TODO: replace with CMS data matching field requirements
const carouselImages = [
  { src: '/carousel_two.png', alt: 'SSA Event 1' },
  { src: '/carousel_one.png', alt: 'SSA Event 2' },
  { src: '/carousel_two.png', alt: 'SSA Event 3' },
]

export default function AboutPage() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length)
    }, 6000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index)
      startTimer()
    },
    [startTimer],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo((current + 1) % carouselImages.length)
      } else {
        goTo((current - 1 + carouselImages.length) % carouselImages.length)
      }
    }
    touchStartX.current = null
  }

  return (
    <main className="flex flex-col gap-8 bg-ssa-yellow-light pb-16 text-ssa-grey pt-[88px] md:gap-14 md:pb-24">
      <Hero
        title="About Us"
        subtitle="We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)"
        mascotImage="/nerdy-merlion.png"
      />

      {/* Image carousel */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20">
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding track */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 pt-4">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="flex items-center justify-center w-6 h-6"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === current ? 'bg-ssa-red scale-125' : 'bg-ssa-red/30'}`}
              />
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
