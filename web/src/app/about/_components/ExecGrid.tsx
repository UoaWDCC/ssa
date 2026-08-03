'use client'

import { useQuery } from '@tanstack/react-query'
import ExecCard from './ExecCard'
import { aboutHeadingFont, aboutParagraphFont } from './fonts'

type Exec = {
  id: number
  name: string
  role: string
  photo: string | null
}

type AboutUsResponse = {
  execs: Exec[]
}

async function fetchExecs() {
  const response = await fetch('/api/about-us')

  if (!response.ok) {
    throw new Error(`About Us request failed: ${response.status}`)
  }

  return response.json() as Promise<AboutUsResponse>
}

export default function ExecGrid() {
  const { data, isError } = useQuery({
    queryKey: ['about-us', 'execs'],
    queryFn: fetchExecs,
  })

  return (
    <section
      aria-labelledby="ssa-team-heading"
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-[17.675px] pb-[88px] pt-[32px] sm:px-8 md:px-12 lg:px-16 xl:grid-cols-[351px_minmax(0,1fr)] xl:gap-[56px] xl:px-[clamp(24px,6.8056vw,98px)] xl:pb-0 xl:pt-[61px]"
    >
      <div className="xl:pb-[184px] xl:pt-[72px]">
        <div className="xl:sticky xl:top-[88px]">
          <h2
            id="ssa-team-heading"
            className={`${aboutHeadingFont.className} text-[24px] font-bold leading-[31.992px] tracking-[-1px] text-[#f85b76] xl:leading-[32px]`}
          >
            Meet the SSA Team
          </h2>
          <div
            className={`${aboutParagraphFont.className} mt-[40px] hidden space-y-[24px] text-[16.0008px] font-normal leading-[24px] tracking-[-0.4px] text-[#434242] xl:block`}
          >
            <p>
              We started off as a relatively small gathering of students years
              ago, for Singaporean and non-Singaporean students alike to find
              their “home away from home” during their time in University. Our
              club has since developed into a multicultural and diverse entity,
              and we organise cultural and social events to keep this spirit
              alive.
            </p>
            <p>
              As a committee members, we attend weekly committee meetings to
              plan and coordinate events with other fellow executives. We are a
              tight knit team and our aim is in upholding the SSA spirit and
              serving this community to the best of our ability.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[16px] xl:mt-[72px] xl:pb-[184px]">
        <div className="relative xl:pl-[49px]">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[-2px] top-0 hidden w-[4px] bg-black/[0.05] xl:block"
          />
          <div className="grid grid-cols-3 gap-[10px] md:grid-cols-4 xl:grid-cols-4 xl:gap-x-[20px] xl:gap-y-[29px]">
            {data?.execs.map((exec) => (
              <ExecCard
                key={exec.id}
                name={exec.name}
                role={exec.role}
                photo={exec.photo ?? undefined}
              />
            ))}
          </div>
          {isError && (
            <p className="sr-only" role="status">
              The team could not be loaded.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
