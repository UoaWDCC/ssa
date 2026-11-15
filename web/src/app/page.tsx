import { Suspense } from 'react'

import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HomeCarousel from '@/components/HomeCarousel'
import InstagramFeed from '@/components/InstagramFeed'
import JoinCard from '@/components/JoinCard'
import JoinCardSkeleton from '@/components/JoinCardSkeleton'
import UpcomingEventCard from '@/components/UpcomingEventCard'
import { fetchSiteSettings } from '@/lib/siteSettings'

export const dynamic = 'force-dynamic'

async function JoinSection() {
  const siteSettings = await fetchSiteSettings()

  return (
    <JoinCard
      title={siteSettings.homeJoinTitle}
      paragraphs={siteSettings.homeJoinParagraphs}
    />
  )
}

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
      <Suspense fallback={<JoinCardSkeleton />}>
        <JoinSection />
      </Suspense>
      <InstagramFeed />
      <Footer />
    </main>
  )
}
