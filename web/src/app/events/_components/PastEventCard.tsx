import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaCalendarDays, FaLocationDot } from 'react-icons/fa6'
import type { PastEvent, PastEventTag } from './pastEventsData'

interface PastEventCardProps {
  event: PastEvent
}

/**
 * Maps each tag to a Tailwind background utility from the project palette
 * (defined in globals.css). Keeps a tag's colour stable across cards.
 */
const TAG_COLOURS: Record<PastEventTag, string> = {
  Food: 'bg-ssa-red/80',
  Community: 'bg-ssa-red/80',
  Games: 'bg-ssa-red/80',
  AGM: 'bg-ssa-red/80',
}

function formatEventDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // ISO date-only strings are parsed as UTC; pin formatting to UTC so the
    // displayed day doesn't shift based on the user's local timezone.
    timeZone: 'UTC',
  })
}

export default function PastEventCard({ event }: Readonly<PastEventCardProps>) {
  const { slug, name, location, date, thumbnail, thumbnailAlt, tags } = event
  const formattedDate = formatEventDate(date)

  return (
    <Link
      href={`/events/${slug}/gallery`}
      aria-label={`See photos for ${name} on ${formattedDate} at ${location}`}
      className="group relative block aspect-[5/6] overflow-hidden rounded-2xl ring-[3px] ring-ssa-red-lighter transition-all duration-300 hover:ring-4 hover:ring-ssa-red focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ssa-red"
    >
      <Image
        src={thumbnail}
        alt={thumbnailAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px] group-hover:brightness-75"
      />

      {/* Top gradient + location */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent"
      />
      <div className="absolute left-5 top-5 flex items-center gap-2 text-white">
        <FaLocationDot className="h-5 w-5" aria-hidden="true" />
        <span className="font-averia text-base font-bold uppercase tracking-wide">
          {location}
        </span>
      </div>

      {/* Bottom gradient + info */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-white/90">
          <FaCalendarDays className="h-5 w-5" aria-hidden="true" />
          <time
            dateTime={date}
            className="font-averia text-base font-bold tracking-wide"
          >
            {formattedDate}
          </time>
        </div>
        <h3 className="font-averia text-3xl font-bold leading-tight text-white">
          {name}
        </h3>
        {tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className={`rounded-full px-4 py-1 font-averia text-base font-bold text-white ${TAG_COLOURS[tag]}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hover overlay: See Photos */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="flex items-center gap-2.5 rounded-full bg-ssa-red px-8 py-3.5 font-averia text-xl font-bold text-white shadow-lg">
          See Photos
          <FaArrowRight className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
