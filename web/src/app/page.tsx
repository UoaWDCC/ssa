import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HomeCarousel from '@/components/HomeCarousel'
import InstagramFeed from '@/components/InstagramFeed'
import JoinCard from '@/components/JoinCard'
import UpcomingEventCard from '@/components/UpcomingEventCard'

export default function Home() {
  return (
    <main className="flex flex-col gap-10 overflow-x-hidden bg-ssa-background text-ssa-grey md:gap-14 lg:gap-30.25">
      <Hero
        title={"SINGAPORE\nSTUDENTS'\nASSOCIATION"}
        subtitle="A home for people from the Little Red Dot."
        ctaLabel="JOIN SSA!"
        ctaHref="/signup"
      />

      <section className="px-4 sm:px-6 lg:px-10">
        <UpcomingEventCard />
      </section>

      <HomeCarousel />
      <JoinCard />
      <InstagramFeed />
      <Footer />
    </main>
  )
}