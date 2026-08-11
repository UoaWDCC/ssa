import Image from 'next/image'

interface HeroProps {
  title: string
  subtitle: string
}

const containerStyles =
  'relative items-end justify-start min-h-[14rem] pb-12 pt-6 sm:items-center sm:justify-center sm:min-h-[clamp(18rem,45svh,28rem)] sm:py-10 md:py-12'

const titleStyles = 'text-ssa-white text-[48px] leading-[56px] tracking-[-2px]'

const subtitleStyles =
  'text-ssa-white font-normal text-[16px] max-w-2xl leading-[24px] tracking-[-0.4px]'

const orchidDuoStyles =
  'absolute bottom-[-2rem] right-[-8%] z-[-1] h-52 w-auto pointer-events-none select-none sm:bottom-0 sm:right-[5%] sm:h-14 md:h-44 lg:h-52'

export default function HeroSplit({ title, subtitle }: Readonly<HeroProps>) {
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
      <div className="relative z-10 w-full sm:pl-8 md:pl-12 lg:pl-12">
        <h1
          className={`font-be-vietnam-pro font-bold break-words ${titleStyles}`}
        >
          {title}
        </h1>
        <p
          className={`hidden font-inter leading-tight wrap-break-word sm:block ${subtitleStyles}`}
        >
          {subtitle}
        </p>
      </div>

      <Image
        src="/OrchidDuo.svg"
        alt="Orchid duo decoration"
        width={1200}
        height={1200}
        aria-hidden="true"
        className={`${orchidDuoStyles} opacity-70 sm:opacity-100`}
      />
    </div>
  )
}
