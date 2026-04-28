'use client'

import { useState } from 'react'
import Image from 'next/image'

import Hero from '@/components/Hero'

const upcomingEvent = {
  title: 'Ice Kachang',
  date: '2nd April',
  time: '6PM',
  location: '401-318 Engineering Atrium (Level 3)',
  pricing: '$5 (Members) | $11 (Non-members, includes membership for the year!)',
  teaser: [
    'Hot, stressed and over Uni already? Say less... we’ve got the perfect cooldown for you. Come chill with SSA at our Ice Kachang Night.',
    'Sweet, icy, colourful... but there’s a twist',
  ],
}

const pastEventCategories = ['All', 'Games', 'Community', 'Food', 'AGM']

export default function EventsPage() {
  const [selectedPastEventCategory, setSelectedPastEventCategory] = useState('All')

  return (
    <main className="flex flex-col gap-10 bg-ssa-yellow-light pb-16 text-ssa-grey md:gap-14 md:pb-24">
      <Hero
        title="Events"
        subtitle="Join us for exciting events, cultural celebrations, and community gatherings throughout the year."
        mascotImage="/mascot_eating.png"
        mascotWrapperClassName="-bottom-[90px]"
      />

      <section className="px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:gap-8">
          <h2
            className="font-[family-name:var(--font-averia)] font-bold text-ssa-grey"
            style={{ fontSize: 'clamp(0.8rem, 4vw, 3.125rem)', lineHeight: '0.95' }}
          >
            Upcoming Events
          </h2>

          <article className="relative mx-auto grid w-full max-w-[1214px] grid-cols-[51%_41%] justify-between gap-2 rounded-[1rem] bg-ssa-yellow px-4 py-3 shadow-[0_16px_45px_rgba(248,91,118,0.14)] md:gap-8 md:rounded-[2rem] md:px-10 md:py-10 lg:grid-cols-[57%_39%] xl:min-h-[500px] xl:px-[4.12%] xl:py-[5.7%]">
            <div className="flex min-w-0 flex-col gap-3 md:gap-[66px] xl:pr-4">
              <div className="space-y-2 md:space-y-4">
                <p
                  className="font-[family-name:var(--font-averia)] font-normal uppercase tracking-[0.06em] text-ssa-red"
                  style={{ fontSize: 'clamp(0.7rem, 3.8vw, 3.5rem)', lineHeight: '0.95' }}
                >
                  {upcomingEvent.title}
                </p>

                <div
                  className="flex w-full max-w-[541px] flex-col gap-1.5 font-[family-name:var(--font-averia)] text-ssa-grey md:gap-3 xl:h-[122px]"
                  style={{ fontSize: 'clamp(7px, 2vw, 20px)', lineHeight: '1.2' }}
                >
                  <div className="flex items-start gap-1.5 md:gap-3">
                    <Image
                      src="/events/clockicon.svg"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={18}
                      className="mt-0.5 ml-[1px] h-2.5 w-3 shrink-0 md:mt-1 md:ml-[1px] md:h-4 md:w-5"
                    />
                    <p className="text-ssa-grey">
                      {upcomingEvent.date} - {upcomingEvent.time}
                    </p>
                  </div>

                  <div className="flex items-start gap-1.5 md:gap-3">
                    <Image
                      src="/events/locationicon.svg"
                      alt=""
                      aria-hidden="true"
                      width={23}
                      height={20}
                      className="mt-0.5 h-2.5 w-3.5 shrink-0 md:mt-1 md:h-5 md:w-[23px]"
                    />
                    <p className="text-ssa-grey">{upcomingEvent.location}</p>
                  </div>

                  <div className="flex items-start gap-1.5 md:gap-3">
                    <Image
                      src="/events/staricon.svg"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      className="mt-0.5 ml-[1.4px] h-3 w-3 shrink-0 md:mt-1 md:ml-[1.4px] md:h-[22px] md:w-[22px]"
                    />
                    <p className="max-w-[22rem] text-ssa-grey">{upcomingEvent.pricing}</p>
                  </div>
                </div>
              </div>

              <p
                className="w-full max-w-[541px] font-[family-name:var(--font-averia)] text-ssa-grey xl:h-[153px] xl:pb-[50px]"
                style={{ fontSize: 'clamp(6.5px, 1.9vw, 25px)', lineHeight: '1.05' }}
              >
                <span className="text-ssa-grey">{upcomingEvent.teaser[0]}</span>
                <br />
                <span className="text-ssa-grey">{upcomingEvent.teaser[1]}</span>
                <span aria-hidden="true"> 👀</span>
              </p>
            </div>

            <div className="mt-3 flex w-[92%] max-w-[474px] flex-col gap-1.5 justify-self-end lg:mt-0 lg:w-full lg:self-start lg:justify-self-end xl:absolute xl:right-[50px] xl:top-[50px] xl:gap-4">
              <div className="aspect-[1110/792] w-full overflow-hidden rounded-[0.75rem] bg-[#7dc8ec] md:rounded-[1.75rem] lg:h-[322px] lg:w-[474px] lg:aspect-auto">
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
                className="inline-flex min-h-4 w-full items-center justify-between rounded-full border border-ssa-red bg-ssa-pink px-2.5 text-left font-[family-name:var(--font-averia)] text-[6px] font-bold uppercase tracking-[0.04em] text-ssa-red transition-colors duration-200 hover:bg-ssa-red hover:text-ssa-pink md:min-h-14 md:border-[3px] md:px-8 md:text-2xl"
              >
                <span>RSVP Now</span>
                <span aria-hidden="true" className="text-sm leading-none md:text-3xl">
                  →
                </span>
              </button>
            </div>
          </article>

          <section className="mt-16 flex flex-col gap-5 md:mt-24 md:gap-6 xl:mt-[311px]">
            <h2
              className="font-[family-name:var(--font-averia)] font-bold text-ssa-grey"
              style={{ fontSize: 'clamp(0.8rem, 4vw, 3.125rem)', lineHeight: '0.95' }}
            >
              Past Events
            </h2>

            <div className="w-full bg-[#fffaf0] px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-3 md:gap-4">
                <input
                  type="search"
                  placeholder="Search events..."
                  className="h-9 w-full rounded-full border border-[#f6b3be] bg-white px-4 py-1.5 font-[family-name:var(--font-averia)] text-[20px] text-ssa-grey placeholder:text-[#d9b7bd] focus:border-ssa-red focus:outline-none md:h-[57px] md:max-w-[1215px] md:px-5"
                />

                <div className="flex flex-wrap gap-2">
                  {pastEventCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedPastEventCategory(category)}
                      className={`rounded-full border-2 px-3 py-1 font-[family-name:var(--font-averia)] text-[10px] font-bold transition-colors duration-200 md:min-h-[62px] md:border-[3px] md:px-8 md:text-[25px] ${
                        selectedPastEventCategory === category
                          ? 'border-ssa-red bg-ssa-pink text-ssa-red'
                          : 'border-ssa-red bg-ssa-red text-ssa-yellow-light hover:bg-ssa-pink hover:text-ssa-red'
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
