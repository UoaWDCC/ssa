'use client'

import { useState } from 'react'
import Image from 'next/image'

import Hero from '@/components/Hero'

const upcomingEvent = {
  title: 'Ice Kachang',
  date: '2nd April',
  time: '6PM',
  location: '401-318 Engineering Atrium (Level 3)',
  pricing:
    '$5 (Members) | $11 (Non-members, includes membership for the year!)',
  teaser: [
    'Hot, stressed and over Uni already? Say less... we’ve got the perfect cooldown for you. Come chill with SSA at our Ice Kachang Night.',
    'Sweet, icy, colourful... but there’s a twist',
  ],
}

const pastEventCategories = ['All', 'Games', 'Community', 'Food', 'AGM']

export default function EventsPage() {
  const [selectedPastEventCategory, setSelectedPastEventCategory] =
    useState('All')

  return (
    <main className="flex flex-col gap-10 bg-ssa-yellow-light pb-16 text-ssa-grey md:gap-14 md:pb-24">
      <Hero
        title="Events"
        subtitle="Join us for exciting events, cultural celebrations, and community gatherings throughout the year."
        mascotImage="/events/mascot_eating.png"
      />

      <section className="px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-8">
          <h2 className="font-averia text-2xl font-bold text-ssa-grey md:text-4xl lg:text-5xl">
            Upcoming Events
          </h2>

          <article className="mx-auto grid w-full max-w-6xl gap-6 rounded-2xl bg-ssa-yellow p-4 md:gap-8 md:rounded-3xl md:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-start lg:p-10">
            <div className="flex min-w-0 flex-col gap-6 md:gap-10">
              <div className="space-y-2 md:space-y-4">
                <p className="font-averia text-xl font-normal uppercase tracking-[0.06em] text-ssa-red md:text-4xl lg:text-5xl">
                  {upcomingEvent.title}
                </p>

                <div className="flex w-full max-w-xl flex-col gap-2 font-averia text-xs leading-tight text-ssa-grey md:gap-3 md:text-lg">
                  <div className="flex items-start gap-2 md:gap-3">
                    <Image
                      src="/events/clockicon.svg"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={18}
                      className="mt-0.5 h-3 w-3 shrink-0 md:mt-1 md:h-4 md:w-5"
                    />
                    <p className="text-ssa-grey">
                      {upcomingEvent.date} - {upcomingEvent.time}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <Image
                      src="/events/locationicon.svg"
                      alt=""
                      aria-hidden="true"
                      width={23}
                      height={20}
                      className="mt-0.5 h-3 w-3.5 shrink-0 md:mt-1 md:h-5 md:w-6"
                    />
                    <p className="text-ssa-grey">{upcomingEvent.location}</p>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <Image
                      src="/events/staricon.svg"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      className="mt-0.5 h-3 w-3 shrink-0 md:mt-1 md:h-5 md:w-5"
                    />
                    <p className="max-w-[22rem] text-ssa-grey">
                      {upcomingEvent.pricing}
                    </p>
                  </div>
                </div>
              </div>

              <p className="w-full max-w-xl font-averia text-xs leading-tight text-ssa-grey md:text-lg lg:text-2xl">
                <span className="text-ssa-grey">{upcomingEvent.teaser[0]}</span>
                <br />
                <span className="text-ssa-grey">{upcomingEvent.teaser[1]}</span>
                <span aria-hidden="true"> 👀</span>
              </p>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3 justify-self-center lg:justify-self-end">
              <div className="aspect-[1110/792] w-full overflow-hidden rounded-xl md:rounded-3xl">
                <Image
                  src="/events/events_page_eating.png"
                  alt="Ice Kachang event artwork"
                  width={1110}
                  height={792}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                className="inline-flex min-h-10 w-full items-center justify-between rounded-full border-2 border-ssa-red bg-ssa-red px-4 py-2 text-left font-averia text-xs font-bold uppercase tracking-[0.04em] text-ssa-yellow-light transition-colors duration-200 hover:bg-ssa-pink hover:text-ssa-red md:min-h-14 md:px-8 md:text-2xl"
              >
                <span>RSVP Now</span>
                <span
                  aria-hidden="true"
                  className="text-base leading-none md:text-3xl"
                >
                  →
                </span>
              </button>
            </div>
          </article>

          <section className="mt-16 flex flex-col gap-5 md:mt-24 md:gap-6">
            <h2 className="font-averia text-2xl font-bold text-ssa-grey md:text-4xl lg:text-5xl">
              Past Events
            </h2>

            <div className="w-full bg-ssa-yellow-light px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-3 md:gap-4">
                <input
                  type="search"
                  aria-label="Search events"
                  placeholder="Search events..."
                  className="h-10 w-full rounded-full border border-ssa-pink-light bg-white px-4 py-1.5 font-averia text-base text-ssa-grey placeholder:text-ssa-pink-light focus:border-ssa-red focus:outline-none md:h-14 md:max-w-[1215px] md:px-5 md:text-xl"
                />

                <div className="flex flex-wrap gap-2">
                  {pastEventCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedPastEventCategory(category)}
                      className={`rounded-full border-2 px-3 py-1 font-averia text-[10px] font-bold transition-colors duration-200 md:min-h-[62px] md:px-8 md:text-[25px] ${
                        selectedPastEventCategory === category
                          ? 'border-ssa-red bg-ssa-pink text-ssa-red'
                          : 'border-ssa-red bg-ssa-red text-ssa-yellow-light hover:bg-ssa-red hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
