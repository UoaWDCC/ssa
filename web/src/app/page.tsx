import { FaClock, FaLocationDot } from 'react-icons/fa6'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'
import InstagramFeed from '@/components/InstagramFeed'
import JoinCard from '@/components/JoinCard'
import HomeCarousel from '@/components/HomeCarousel'

export default function Home() {
  return (
    <main className="flex flex-col gap-10 bg-ssa-background text-ssa-grey md:gap-14 lg:gap-30.25">
      <Hero
        title={"SINGAPORE\nSTUDENTS'\nASSOCIATION"}
        subtitle="A home for people from the Little Red Dot."
        ctaLabel="JOIN SSA!"
        ctaHref="/signup"
      />
      <section className="px-[21px] md:px-10 lg:px-16">
        <HighlightCard
          eyebrow="Upcoming Event"
          title="Ice Kachang"
          details={[
            {
              icon: FaLocationDot,
              text: '401-318 Engineering Atrium (Level 3)',
            },
            { icon: FaClock, text: '2nd April - 6:00 PM' },
          ]}
          badges={['$5 Members', { text: '$11 Non-Members', variant: 'light' }]}
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
      <JoinCard />
      {/* Image Carousel */}
      <HomeCarousel />
      <InstagramFeed />
      <Footer />
    </main>
  )
}
