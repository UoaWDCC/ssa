import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa6'

interface HeroProps {
  title: string
  eventDate: string
}

const containerStyles =
  'relative items-center justify-center min-h-[14rem] pb-12 pt-6 sm:min-h-[clamp(18rem,45svh,28rem)] sm:py-10 md:py-12'

const breadcrumbStyles =
  'text-ssa-white font-inter font-normal text-[13px] leading-[18px] tracking-[-0.2px]'

const titleStyles =
  'text-ssa-white uppercase text-[48px] leading-[56px] tracking-[-2px]'

const subtitleStyles =
  'text-ssa-white font-normal text-[16px] max-w-2xl leading-[24px] tracking-[-0.4px]'

export default function HeroSplit({ title, eventDate }: Readonly<HeroProps>) {
  return (
    <div
      className={`relative isolate flex w-full overflow-hidden rounded-b-2xl px-4 sm:px-8 md:rounded-b-3xl md:px-10 lg:px-14 ${containerStyles}`}
      style={{
        background: `
      linear-gradient(
        151deg,
        var(--color-footer-pink-1) 30%,
        var(--color-footer-pink-2) 45%,
        var(--color-footer-pink-3) 65%,
        var(--color-footer-peach-1) 82%,
        var(--color-footer-peach-2) 88%,
        var(--color-footer-peach-3) 94%,
        var(--color-footer-peach-4) 95%,
        var(--color-footer-cream) 100%
      )
    `,
      }}
    >
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className={`mb-2 flex items-center gap-2 ${breadcrumbStyles}`}>
          <Link
            href="/events"
            className="hover:underline font-dm-mono uppercase opacity-50"
          >
            Events
          </Link>
          <FaChevronRight className="text-[9px] opacity-50" />
          <span className="font-dm-mono uppercase">{title}</span>
        </div>
        <h1
          className={`font-be-vietnam-pro font-bold break-words ${titleStyles}`}
        >
          {title}
        </h1>
        <p
          className={`hidden font-dm-mono leading-tight wrap-break-word sm:block ${subtitleStyles}`}
        >
          {eventDate}
        </p>
      </div>
    </div>
  )
}
