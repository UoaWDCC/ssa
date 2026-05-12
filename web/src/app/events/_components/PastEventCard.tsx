import Image from 'next/image'
import Link from 'next/link'
import ArrowRightIcon from './ArrowRightIcon'
import type { PastEvent, PastEventTag } from './pastEventsData'

interface PastEventCardProps {
  event: PastEvent
}

/**
 * Maps each tag to a Tailwind background utility from the project palette
 * (defined in globals.css). Keeps a tag's colour stable across cards.
 */
const TAG_COLOURS: Record<PastEventTag, string> = {
  Food: 'bg-ssa-red',
  Community: 'bg-ssa-red-light',
  Games: 'bg-ssa-red',
  AGM: 'bg-ssa-red-light',
}

function formatEventDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PastEventCard({ event }: Readonly<PastEventCardProps>) {
  const { slug, name, location, date, thumbnail, thumbnailAlt, tags } = event
  const formattedDate = formatEventDate(date)

  return (
    <Link
      href={`/events/${slug}/gallery`}
      aria-label={`See photos for ${name} on ${formattedDate} at ${location}`}
      className="group block overflow-hidden rounded-2xl bg-ssa-yellow-light ring-[3px] ring-ssa-red-lighter transition-all duration-300 hover:ring-4 hover:ring-ssa-red focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ssa-red"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75 group-hover:saturate-50"
        />

        {/* Date pill (top-right) */}
        <div className="absolute right-3 top-3">
          <time
            dateTime={date}
            className="rounded-full bg-ssa-yellow/90 px-3 py-1 font-averia text-xs font-bold text-ssa-black shadow-sm"
          >
            {formattedDate}
          </time>
        </div>

        {/* Hover overlay: See Photos */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-ssa-red/90 px-6 py-2.5 font-averia text-base font-bold text-white shadow-lg">
            See Photos
            <ArrowRightIcon />
          </span>
        </div>
      </div>

      {/* Info area */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-averia text-xl font-bold leading-tight text-ssa-black">
          {name}
        </h3>
        <p className="font-averia text-sm uppercase tracking-wide text-ssa-black/70">
          {location}
        </p>
        {tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className={`rounded-full px-3 py-0.5 font-averia text-xs font-bold text-white ${TAG_COLOURS[tag]}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
