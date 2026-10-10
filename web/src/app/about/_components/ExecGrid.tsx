'use client'

import { useExecs } from '@/hooks/useExecs'
import ExecCard from './ExecCard'
import { aboutHeadingFont, aboutParagraphFont } from './fonts'

type ExecGridProps = {
  title: string
  paragraphs: string[]
}

export default function ExecGrid({ title, paragraphs }: ExecGridProps) {
  const { execs, error } = useExecs()

  return (
    <section
      aria-labelledby="ssa-team-heading"
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-[17.675px] pb-[88px] pt-[48px] sm:px-8 md:px-12 md:pt-[64px] lg:px-16 xl:grid-cols-[351px_4px_minmax(0,1fr)] xl:gap-x-[48px] xl:px-[clamp(24px,6.8056vw,98px)] xl:pb-0 xl:pt-[133px]"
    >
      <div className="xl:pb-[184px]">
        <div className="xl:sticky xl:top-[88px]">
          <h2
            id="ssa-team-heading"
            className={`${aboutHeadingFont.className} text-[24px] font-bold leading-[31.992px] tracking-[-1px] text-[#f85b76] xl:leading-[32px]`}
          >
            {title}
          </h2>
          <div
            className={`${aboutParagraphFont.className} mt-[32px] space-y-[24px] text-[15px] font-normal leading-[23px] tracking-[-0.3px] text-black sm:text-[16px] sm:leading-[24px] sm:tracking-[-0.4px] xl:mt-[40px]`}
          >
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hidden self-stretch bg-black/[0.05] xl:block xl:mb-[184px]"
      />

      <div className="mt-[40px] xl:mt-0 xl:pb-[184px]">
        <div className="grid grid-cols-3 gap-[10px] md:grid-cols-4 xl:gap-x-[20px] xl:gap-y-[29px]">
          {execs.map((exec) => (
            <ExecCard
              key={exec.id}
              name={exec.name}
              role={exec.role}
              photo={exec?.photo}
            />
          ))}
        </div>
        {error && (
          <p className="sr-only" role="status">
            The team could not be loaded.
          </p>
        )}
      </div>
    </section>
  )
}
