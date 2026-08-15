import type { Metadata } from 'next'

import RsvpForm from './_components/RsvpForm'

export const metadata: Metadata = {
  title: 'RSVP for Ice Kachang | SSA',
  description:
    'RSVP for the Singapore Students’ Association Ice Kachang night.',
}

export default function IceKachangRsvpPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] bg-ssa-background font-inter text-ssa-grey">
      <div className="mx-auto w-full max-w-[1250px] px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-0">
        <div className="grid items-stretch gap-10 lg:grid-cols-[15.5rem_1px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[18rem_1px_minmax(0,1fr)] xl:gap-12">
          <aside aria-labelledby="rsvp-title" className="lg:min-h-[520px]">
            <h1
              id="rsvp-title"
              className="font-be-vietnam-pro text-[clamp(2.5rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.05em] text-ssa-red"
            >
              RSVP
            </h1>
            <p className="mt-4 max-w-[30ch] text-base leading-6">
              Hot, stressed and over Uni already? Say less… we’ve got the
              perfect cooldown for you. Come chill with SSA at our Ice Kachang
              Night. Sweet, icy, colourful… but there’s a twist.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:mt-16 lg:grid-cols-1">
              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Event name
                </dt>
                <dd className="mt-1 text-base leading-6">Ice Kachang</dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Date
                </dt>
                <dd className="mt-1 text-base leading-6">
                  <time dateTime="2026-04-02T18:00:00+13:00">
                    2 April 2026 · 6:00 pm
                  </time>
                </dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Location
                </dt>
                <dd className="mt-1 max-w-[30ch] text-base leading-6">
                  401-318 Engineering Atrium (Level 3)
                </dd>
              </div>

              <div>
                <dt className="font-dm-mono text-xs font-medium uppercase tracking-[0.06em] text-ssa-form-accent">
                  Price
                </dt>
                <dd className="mt-1 grid max-w-[14rem] grid-cols-[1fr_auto] gap-x-6 text-base leading-6">
                  <span>Member</span>
                  <span>$5</span>
                  <span>Non-member</span>
                  <span>$11</span>
                </dd>
              </div>
            </dl>
          </aside>

          <div aria-hidden="true" className="hidden bg-[#e9e1d5] lg:block" />

          <RsvpForm />
        </div>
      </div>
    </main>
  )
}
