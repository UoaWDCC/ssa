import Image from 'next/image'
import { FaClock, FaLocationDot } from 'react-icons/fa6'
import Button from '@/components/Button'
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
    <article className="group/card relative aspect-[195/240] w-full max-w-[195px] overflow-hidden rounded-[6px] focus-within:ring-2 focus-within:ring-ssa-red sm:aspect-[404/323] sm:max-w-[404px]">
      <div className="absolute inset-0 overflow-hidden rounded-[6px] border-[1.6px] border-ssa-cream transition-[filter] duration-300 ease-out group-hover/card:blur-[4px] group-focus-within/card:blur-[4px]">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 404px"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/35 transition-colors duration-300 ease-out group-hover/card:bg-black/50 group-focus-within/card:bg-black/50"
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
                    className="inline-flex h-[18px] items-center justify-center rounded-[2px] bg-[rgba(255,251,244,0.8)] px-2 font-dm-mono text-[9px] font-normal uppercase leading-none tracking-[0.04em] text-ssa-grey backdrop-blur-[4px] sm:h-[22px] sm:text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100">
        <Button
          href={`/events/${slug}/gallery`}
          aria-label={`See photos for ${name} on ${formattedDate} at ${location}`}
          size="short"
          variant="filled"
          color="red"
          arrow
          arrowSide="right"
          className="shrink-0 font-semibold text-white"
          style={{
            width: 'min(178px, calc(100% - 24px))',
            height: '48px',
            padding: 0,
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          SEE PHOTOS
        </Button>
      </div>
    </article>
  )
}
