'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Hero from '@/components/Hero'
import ExecGrid from './_components/ExecGrid'

// TODO: replace with CMS data matching field requirements
const carouselImages = [
  { src: '/carousel_two.jpg', alt: 'SSA Event 1' },
  { src: '/carousel_one.jpg', alt: 'SSA Event 2' },
  { src: '/carousel_two.jpg', alt: 'SSA Event 3' },
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
    goTo((current - 1 + carouselImages.length) % carouselImages.length)
  }, [current, goTo])

  const goNext = useCallback(() => {
    goTo((current + 1) % carouselImages.length)
  }, [current, goTo])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goTo((current - 1 + carouselImages.length) % carouselImages.length)
      } else if (e.key === 'ArrowRight') {
        goTo((current + 1) % carouselImages.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, goTo])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
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
  }

  return (
    <main className="flex flex-col bg-ssa-yellow-light pb-16 text-ssa-black md:pb-24">
      <div className="-mt-[88px] bg-ssa-red">
        <Hero
          title="About Us"
          subtitle="We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)"
          mascotImage="/ssa_nerd_merlion.svg"
          mascotAlt="SSA Nerd Merlion mascot"
        />
      </div>

      <section
        style={{ paddingTop: '40px' }}
        className="px-4 sm:px-6 md:px-10 lg:px-20"
      >
        <div className="relative">
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
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
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-ssa-black"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-ssa-black"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="flex items-center justify-center w-6 h-6 cursor-pointer"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === current ? 'bg-ssa-red scale-125' : 'bg-ssa-red/30'}`}
              />
            </button>
          ))}
        </div>
      </section>

      <ExecGrid />
    </main>
  )
}
