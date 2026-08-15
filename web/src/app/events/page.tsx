import { FaClock, FaLocationDot } from 'react-icons/fa6'

import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'

import PastEventsSection from './_components/PastEventsSection'

export default function EventsPage() {
  return (
    <main className="flex flex-col gap-10 bg-ssa-background text-ssa-grey md:gap-14 lg:gap-[121px]">
      <Hero
        title="Events"
        subtitle="Join us for exciting events, cultural celebrations, and community gatherings throughout the year."
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />

      <section className="px-[21px] md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1250px] flex-col gap-5 md:gap-8">
          <HighlightCard
            eyebrow="Upcoming Event"
            title="Ice Kachang"
            details={[
              {
                icon: FaLocationDot,
                text: '401-318 Engineering Atrium (Level 3)',
              },
              {
                icon: FaClock,
                text: '2nd April - 6:00 PM',
              },
            ]}
            badges={[
              '$5 MEMBERS',
              { text: '$11 NON-MEMBERS', variant: 'light' },
            ]}
            description={
              <p>
                Hot, stressed and over Uni already?
                <br />
                Say less... we’ve got the perfect cooldown for you. Come chill
                with SSA at our Ice Kachang Night. Sweet, icy, colourful… but
                there’s a twist.
              </p>
            }
            ctaLabel="RSVP"
            ctaHref="/events/ice-kachang/rsvp"
            imageSrc="/events/highlight_mascot.png"
            imageAlt="Ice Kachang event artwork"
          />
        </div>
      </section>

      <PastEventsSection />
      <Footer />
    </main>
  )
}
