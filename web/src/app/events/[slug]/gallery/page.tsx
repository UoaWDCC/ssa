import GalleryGrid from '@/app/events/components/GalleryGrid'
import HeroGallery from '@/components/HeroGallery'
import { pastEvents } from '@/app/events/_components/pastEventsData'
import { getGalleryImages } from './galleryData'

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

function formatEventMonth(date: string): string {
  return new Intl.DateTimeFormat('en-NZ', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export default async function EventGalleryPage({
  params,
}: Readonly<GalleryPageProps>) {
  const { slug } = await params
  const event = pastEvents.find((pastEvent) => pastEvent.slug === slug)
  const eventTitle = event?.name ?? slug.replace(/-/g, ' ')
  const eventDate = event ? formatEventMonth(event.date) : ''
  const galleryImages = getGalleryImages(slug) ?? placeholderImages

  return (
    <main className="min-h-[60vh] bg-ssa-yellow-light">
      <HeroGallery title={eventTitle} eventDate={eventDate} />
      <GalleryGrid
        images={galleryImages}
        eventTitle={eventTitle}
        eventDate={eventDate}
      />
    </main>
  )
}
