import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaClock, FaLocationDot } from 'react-icons/fa6'
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
  const { id, name, location, date, thumbnail, thumbnailAlt, tags } = event
  const formattedDate = formatEventDate(date)

  return (
    <article className="w-full max-w-[195px] sm:max-w-[404px]">
      <Link
        href={`/events/${id}/gallery`}
        aria-label={`See photos for ${name} on ${formattedDate} at ${location}`}
        className="group/card relative block aspect-[195/240] touch-manipulation overflow-hidden rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ssa-red sm:aspect-[404/323]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[6px] border-[1.6px] border-ssa-cream transition-[filter] duration-300 ease-out group-hover/card:blur-[4px] group-focus-within/card:blur-[4px]">
          <Image
            src={thumbnail}
            alt={thumbnailAlt}
            fill
            unoptimized={
              /^https?:\/\//.test(thumbnail) || thumbnail.startsWith('/api/')
            }
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 404px"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ssa-black/35 transition-colors duration-300 ease-out group-hover/card:bg-ssa-black/50 group-focus-within/card:bg-ssa-black/50"
          />

          <div className="absolute inset-3 text-ssa-yellow-light sm:inset-6">
            <div className="absolute left-0 top-0 flex items-center gap-1">
              <FaLocationDot
                className="size-[11px] shrink-0 sm:size-[13px]"
                aria-hidden="true"
              />
              <span className="font-dm-mono text-[11px] font-normal uppercase leading-3 tracking-[0.04em] sm:text-[14px] sm:leading-4">
                {location}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0">
              <div className="flex items-center gap-1">
                <FaClock
                  className="size-[9px] shrink-0 sm:size-[11px]"
                  aria-hidden="true"
                />
                <time
                  dateTime={date}
                  className="font-dm-mono text-[11px] font-normal uppercase leading-3 tracking-[0.04em] sm:text-[14px] sm:leading-4"
                >
                  {formattedDate}
                </time>
              </div>

              <h3 className="mt-1 font-inter text-base font-bold leading-5 tracking-[-0.51px] sm:text-[21px] sm:leading-[26px] sm:tracking-[-0.67px]">
                {name}
              </h3>

              {tags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex h-[18px] items-center justify-center rounded-[2px] bg-ssa-background/80 px-2 font-dm-mono text-[9px] font-normal uppercase leading-none tracking-[0.04em] text-ssa-muted-grey backdrop-blur-[4px] sm:h-[22px] sm:text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover/card:opacity-100 group-focus-visible/card:opacity-100 [@media(any-hover:hover)]:flex"
        >
          <span className="inline-flex h-12 w-[calc(100%_-_24px)] max-w-[178px] items-center justify-center rounded-full bg-ssa-red font-be-vietnam-pro text-base font-semibold text-ssa-white">
            <span className="relative inline-flex items-center pr-[1.8em]">
              <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 overflow-hidden">
                <FaArrowRight className="size-4 -translate-x-full transition-transform duration-300 ease-out group-hover/card:translate-x-0 group-focus-visible/card:translate-x-0" />
              </span>
              <span className="transition-transform duration-300 ease-out group-hover/card:translate-x-[1.8em] group-focus-visible/card:translate-x-[1.8em]">
                SEE PHOTOS
              </span>
              <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 overflow-hidden">
                <FaArrowRight className="size-4 transition-transform duration-300 ease-out group-hover/card:translate-x-full group-focus-visible/card:translate-x-full" />
              </span>
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}
