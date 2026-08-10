import Link from 'next/link'

interface GalleryPageProps {
  params: Promise<{ slug: string }>
}

export default async function EventGalleryPage({
  params,
}: Readonly<GalleryPageProps>) {
  const { slug } = await params

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-ssa-background px-6 py-16 text-center text-ssa-black">
      <h1 className="font-averia text-3xl font-bold sm:text-4xl">
        Gallery coming soon
      </h1>
      <p className="font-averia text-base text-ssa-black/70">
        The photo gallery for{' '}
        <span className="font-bold">{slug.replace(/-/g, ' ')}</span> is not
        available yet. Check back later!
      </p>
      <Link
        href="/events"
        className="mt-4 inline-flex items-center rounded-full bg-ssa-red px-6 py-2.5 font-averia text-base font-bold text-white transition-colors hover:bg-ssa-red-light"
      >
        Back to Events
      </Link>
    </main>
  )
}
