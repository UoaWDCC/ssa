import Footer from '@/components/Footer'
import HeroSplit from '@/components/HeroSplit'
import UpcomingEventCard from '@/components/UpcomingEventCard'
import { fetchSiteSettings } from '@/lib/siteSettings'

import PastEventsSection from './_components/PastEventsSection'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const siteSettings = await fetchSiteSettings()

  return (
    <main className="flex flex-col gap-10 bg-ssa-background text-ssa-grey md:gap-14 lg:gap-[121px]">
      <HeroSplit
        title={siteSettings.eventsHeroTitle}
        subtitle={siteSettings.eventsHeroSubtitle}
      />

      <section className="px-[21px] md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1250px] flex-col gap-5 md:gap-8">
          <UpcomingEventCard />
        </div>
      </section>

      <PastEventsSection />
      <Footer />
    </main>
  )
}
