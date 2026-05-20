'use client'

import { useState } from 'react'
import { FaClock, FaLocationDot } from 'react-icons/fa6'

import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'

import EventCategoryFilters from './components/EventCategoryFilters'
import EventSearchInput from './components/EventSearchInput'

const pastEventCategories = ['All', 'Games', 'Community', 'Food', 'AGM']

export default function EventsPage() {
  const [selectedPastEventCategory, setSelectedPastEventCategory] =
    useState('All')
  const [eventSearchQuery, setEventSearchQuery] = useState('')

  return (
    <main className="flex flex-col gap-10 bg-ssa-yellow-light pb-16 text-ssa-grey md:gap-14 md:pb-24 lg:gap-[121px]">
      <Hero
        title="Events"
        subtitle="Join us for exciting events, cultural celebrations, and community gatherings throughout the year."
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />

      <section className="px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1214px] flex-col gap-5 md:gap-8">
          <HighlightCard
            eyebrow="Upcoming Event"
            title="Ice Kachang"
            details={[
              {
                icon: FaClock,
                text: '2nd April - 6PM',
              },
              {
                icon: FaLocationDot,
                text: '401-318 Engineering Atrium (Level 3)',
              },
            ]}
            badges={['$5 Members', '$11 Non-Members']}
            description={
              <>
                Hot, stressed and over Uni already? Say less... we&apos;ve got
                the perfect cooldown for you. Come chill with SSA at our Ice
                Kachang Night. Sweet, icy, colourful... but there&apos;s a twist
                👀
              </>
            }
            ctaLabel="RSVP"
            ctaHref="/events"
            imageSrc="/events/highlight_mascot.png"
            imageAlt="Ice Kachang event artwork"
          />

          <section className="mt-16 flex flex-col gap-5 md:mt-24 md:gap-6">
            <h2 className="font-averia text-2xl font-bold text-ssa-white md:text-4xl lg:text-5xl">
              Past Events
            </h2>

            <div className="w-full bg-ssa-yellow-light px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-3 md:gap-4">
                <EventSearchInput
                  value={eventSearchQuery}
                  onChange={setEventSearchQuery}
                />

                <EventCategoryFilters
                  categories={pastEventCategories}
                  selectedCategory={selectedPastEventCategory}
                  onSelectCategory={setSelectedPastEventCategory}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
