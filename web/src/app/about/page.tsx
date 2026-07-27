'use client'

import Hero from '@/components/Hero'
import Carousel from '@/components/AboutPageCarousel'
import ExecGrid from './_components/ExecGrid'

// TODO: replace with CMS data matching field requirements
const carouselImages = [
  { src: '/carousel_two.jpg', alt: 'SSA Event 1' },
  { src: '/carousel_one.jpg', alt: 'SSA Event 2' },
  { src: '/carousel_two.jpg', alt: 'SSA Event 3' },
]

export default function AboutPage() {
  return (
    <main className="flex flex-col bg-ssa-yellow-light pb-16 text-ssa-black md:pb-24">
      <div
        className="overflow-hidden rounded-2xl bg-ssa-red"
        style={{ marginTop: '-88px', paddingTop: '88px' }}
      >
        <Hero
          title="About Us"
          subtitle="We are a community that promotes and celebrates Singapore culture and traditions through social activities (and food!)"
        />
      </div>

      <section className="pt-10 px-4 sm:px-6 md:px-10 lg:px-20">
        <Carousel images={carouselImages} />
      </section>

      <ExecGrid />
    </main>
  )
}
