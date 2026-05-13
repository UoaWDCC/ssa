import Hero from '@/components/Hero'
import { HighlightCard } from '@/components/HighlightCard'

type Sponsor = {
  name: string
  logo: string
  websiteURL: string
  isSponsorOfTheWeek: boolean
  description: string
}

type SponsorCardContent = Sponsor & {
  eyebrow: string
  details: { text: string }[]
  badges: string[]
  ctaLabel: string
  imageAlt: string
}

// TO DO: Replace this mock data with CMS/API data once the Sponsor of the Week endpoint is available.
// Expected CMS fields: name, logo, websiteURL, isSponsorOfTheWeek, description.
// Extra fields below are presentational props used by HighlightCard.
const mockSponsorOfTheWeek: SponsorCardContent = {
  name: 'SIP N CHILL',
  logo: '/sponsors/sponsorcard.png', // Temporary local image until the CMS provides sponsor assets.
  websiteURL: '/sponsors', // Temporary placeholder link until the CMS provides a sponsor URL.
  isSponsorOfTheWeek: true,
  description:
    'This week we are highlighting a local spot for catching up over drinks, desserts, and a little breathing room between classes.',
  eyebrow: 'Sponsor of the Week',
  details: [
    { text: 'Student-friendly drinks and desserts' },
    { text: 'Exclusive SSA member deals' },
  ],
  badges: ['10% off', 'Show your SSA membership'],
  ctaLabel: 'Check us out!',
  imageAlt: 'Sip n Chill sponsor photo',
}

export default async function SponsorsPage() {
  // TO DO: Re-enable CMS fetching once the Sponsor of the Week endpoint
  // and returned image URLs are confirmed by the backend/CMS.
  const sponsorOfTheWeek = mockSponsorOfTheWeek

  return (
    <main className="flex flex-col gap-10 bg-ssa-yellow-light text-ssa-grey md:gap-14 lg:gap-[121px]">
      <Hero
        title="Sponsors"
        subtitle="Thank you to our amazing sponsors who make our events and activities possible."
        mascotImage="/ssa_nerd_merlion.svg"
        mascotAlt="SSA Nerd Merlion mascot"
      />
      <section className="px-6 pb-16 md:px-10 md:pb-24 lg:px-16">
        <HighlightCard
          eyebrow={sponsorOfTheWeek.eyebrow}
          title={sponsorOfTheWeek.name}
          details={sponsorOfTheWeek.details}
          badges={sponsorOfTheWeek.badges}
          description={<p>{sponsorOfTheWeek.description}</p>}
          ctaLabel={sponsorOfTheWeek.ctaLabel}
          ctaHref={sponsorOfTheWeek.websiteURL}
          imageSrc={sponsorOfTheWeek.logo}
          imageAlt={sponsorOfTheWeek.imageAlt}
        />
      </section>
    </main>
  )
}
