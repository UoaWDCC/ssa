'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { FaClock, FaLocationDot } from 'react-icons/fa6'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'
import InstagramFeed from '@/components/InstagramFeed'

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

export default function Home() {
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
    <main className="flex flex-col gap-10 bg-ssa-yellow-light text-ssa-grey md:gap-14 lg:gap-[121px]">
      <Hero
        variant="fullscreen"
        title="Singapore Students' Association"
        subtitle="A home for people from the Little Red Dot."
        mascotImage="/ssa_merlion_full_body.svg"
        mascotAlt="SSA Merlion mascot"
      />
      <section className="px-6 md:px-10 lg:px-16">
        <HighlightCard
          eyebrow="Upcoming Event"
          title="Ice Kachang"
          details={[
            { icon: FaClock, text: '2nd April - 6PM' },
            {
              icon: FaLocationDot,
              text: '401-318 Engineering Atrium (Level 3)',
            },
          ]}
          badges={['$5 Members', '$11 Non-Members']}
          description={
            <>
              Hot, stressed and over Uni already? Say less... we&apos;ve got the
              perfect cooldown for you. Come chill with SSA at our Ice Kachang
              Night. Sweet, icy, colourful... but there&apos;s a twist 👀
            </>
          }
          ctaLabel="RSVP"
          ctaHref="/events"
          imageSrc="/events/highlight_mascot.png"
          imageAlt="Ice Kachang event artwork"
        />
      </section>

      {/* Image Carousel */}
      <section>
        <div className="relative">
          <div
            className="relative w-full aspect-[16/7] sm:aspect-[16/7] overflow-hidden"
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
                  {/* Title top left */}
                  <p className="absolute top-4 left-4 text-white font-averia font-semibold text-xl md:text-2xl drop-shadow">
                    {image.title}
                  </p>
                  {/* View Album bottom right */}
                  <div className="absolute bottom-4 right-4">
                    <a
                      href={image.albumHref}
                      className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-ssa-black font-averia font-semibold text-sm md:text-base rounded-full px-5 py-2 transition-colors cursor-pointer"
                    >
                      View Album →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots overlaid bottom left */}
            <div className="absolute bottom-4 left-4 flex gap-2">
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

          {/* Next button */}
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
      </section>

      <InstagramFeed />
      <Footer />
    </main>
  )
}
