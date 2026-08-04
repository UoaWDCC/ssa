import GalleryGrid from '@/app/events/components/GalleryGrid'

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
  const eventTitle = slug.replace(/-/g, ' ')
  // TODO: pull the real event date once event data is available.
  const eventDate = 'March 2026'

  return (
    <main className="min-h-[60vh] bg-ssa-yellow-light">
      <div className="px-6 pt-16 text-center text-ssa-black">
        <h1 className="font-averia text-3xl font-bold capitalize sm:text-4xl">
          {eventTitle}
        </h1>
      </div>
      <GalleryGrid
        images={placeholderImages}
        eventTitle={eventTitle}
        eventDate={eventDate}
      />
    </main>
  )
}