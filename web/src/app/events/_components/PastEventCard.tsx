import Image from 'next/image'
import Link from 'next/link'
import { FaClock, FaLocationDot } from 'react-icons/fa6'
import type { PastEvent } from './pastEventsData'

interface PastEventCardProps {
  event: PastEvent
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
      className="group relative block aspect-[404/323] w-full max-w-[404px] overflow-hidden rounded-[6px] border-[1.6px] border-cream transition-[filter] duration-300 ease-out hover:blur-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red"
    >
      <Image
        src={thumbnail}
        alt={thumbnailAlt}
        fill
        sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 50vw, 404px"
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/35 transition-colors duration-300 ease-out group-hover:bg-black/50"
      />

      <div className="absolute inset-6 text-ssa-yellow-light">
        <div className="absolute left-0 top-0 flex items-center gap-1">
          <FaLocationDot className="size-[11px] shrink-0" aria-hidden="true" />
          <span className="font-dm-mono text-xs font-normal uppercase leading-4 tracking-[0.04em]">
            {location}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="flex items-center gap-1">
            <FaClock className="size-[11px] shrink-0" aria-hidden="true" />
            <time
              dateTime={date}
              className="font-dm-mono text-xs font-normal uppercase leading-4 tracking-[0.04em]"
            >
              {formattedDate}
            </time>
          </div>

          <h3 className="mt-1 font-inter text-[21px] font-bold leading-[26px] tracking-[-0.67px]">
            {name}
          </h3>

          {tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex h-[22px] items-center justify-center rounded-[2px] bg-[#fffbf4]/80 px-2 font-dm-mono text-xs font-normal uppercase leading-none tracking-[0.04em] text-grey backdrop-blur-[4px]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  )
}
