import { FaClock, FaLocationDot } from 'react-icons/fa6'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'
import InstagramFeed from '@/components/InstagramFeed'

export default function Home() {
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
      <InstagramFeed />
      <Footer />
    </main>
  )
}
