import Hero from '@/components/Hero'
import GalleryGrid from '@/components/GalleryGrid'

const mockImages = [
  { id: 1, url: '/event-gallery/filler.svg', alt: 'photo 1' },
  { id: 2, url: '/event-gallery/filler.svg', alt: 'photo 2' },
  { id: 3, url: '/event-gallery/filler.svg', alt: 'photo 3' },
  { id: 4, url: '/event-gallery/filler.svg', alt: 'photo 4' },
  { id: 5, url: '/event-gallery/filler.svg', alt: 'photo 5' },
  { id: 6, url: '/event-gallery/filler.svg', alt: 'photo 6' },
  { id: 7, url: '/event-gallery/filler.svg', alt: 'photo 7' },
  { id: 8, url: '/event-gallery/filler.svg', alt: 'photo 8' },
  { id: 9, url: '/event-gallery/filler.svg', alt: 'photo 9' },
  { id: 10, url: '/event-gallery/filler.svg', alt: 'photo 10' },
  { id: 11, url: '/event-gallery/filler.svg', alt: 'photo 11' },
  { id: 12, url: '/event-gallery/filler.svg', alt: 'photo 12' },
  { id: 13, url: '/event-gallery/filler.svg', alt: 'photo 13' },
  { id: 14, url: '/event-gallery/filler.svg', alt: 'photo 14' },
  { id: 15, url: '/event-gallery/filler2.svg', alt: 'photo 15' },
]

export default async function GalleryPage({
  params,
}: {
  params: { eventID: string }
}) {
  const { eventID } = await params

  return (
    <main className="bg-ssa-yellow-light">
      <Hero
        title={eventID}
        subtitle="A home for people from the Little Red Dot."
        mascotImage="/ssa_nerd_merlion.svg"
      />
      {mockImages.length === 0 ? (
        <p className="text-center text-gray-500">No photos yet.</p>
      ) : (
        <GalleryGrid
          images={mockImages}
          eventTitle={eventID}
          eventDate="13 MARCH 2025"
        />
      )}
    </main>
  )
}
