import Hero from '@/components/Hero'
import Image from 'next/image'

const mockImages = [
  { id: 1, url: '/event-gallery/filler.svg', alt: 'photo 1' },
  { id: 2, url: '/event-gallery/filler.svg', alt: 'photo 2' },
  { id: 3, url: '/event-gallery/filler.svg', alt: 'photo 3' },
  { id: 4, url: '/event-gallery/filler.svg', alt: 'photo 4' }, //need to implement cms for photo
  { id: 5, url: '/event-gallery/filler.svg', alt: 'photo 5' },
  { id: 6, url: '/event-gallery/filler.svg', alt: 'photo 6' },
  { id: 7, url: '/event-gallery/filler.svg', alt: 'photo 7' },
  { id: 8, url: '/event-gallery/filler.svg', alt: 'photo 8' },
  { id: 9, url: '/event-gallery/filler.svg', alt: 'photo 9' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-8xl mx-auto w-full px-30 py-30">
          {mockImages.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-3xl shadow-[0_3px_4px_1px_rgba(0,0,0,0.25),0_4px_10px_0px_rgba(255,255,255,0.30)]"
            >
              <div className="rounded-3x1 overflow-hidden h-full w-full">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
