import GalleryGrid from '@/app/events/components/GalleryGrid'
import HeroGallery from '@/components/HeroGallery'
import { pastEvents } from '../../_components/pastEventsData'

interface GalleryPageProps {
  params: Promise<{ slug: string }>
}

// TODO: replace with real data once the backend tables are wired up (per Joe:
// use a static array for now).
const placeholderImages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  url: i % 2 === 0 ? '/carousel_one.jpg' : '/carousel_two.jpg',
  alt: `Event photo ${i + 1}`,
}))

export default async function EventGalleryPage({
  params,
}: Readonly<GalleryPageProps>) {
  const { slug } = await params
  const event = pastEvents.find((item) => item.slug === slug)
  const eventTitle = event?.name ?? slug.replace(/-/g, ' ')
  // TODO: pull the real event date once event data is available.
  const eventDate = '11/03/26'

  return (
    <main className="min-h-[60vh] bg-ssa-yellow-light">
      <HeroGallery title={eventTitle} eventDate={eventDate} />
      <GalleryGrid
        images={placeholderImages}
        eventTitle={eventTitle}
        eventDate={eventDate}
      />
    </main>
  )
}
