import Image from 'next/image'
import Button from '@/components/Button'

// The polaroid is capped at 410px wide, which it reaches as soon as the viewport
// clears 500px — 410 plus the 90px the wrapper's `px-[21px]` and the cream panel's
// own `px-6` take out of it. Narrower than that it is genuinely fluid, so quoting
// `100vw` there would overstate the width and pull a larger source than needed.
const POLAROID_SIZES = '(min-width: 500px) 410px, calc(100vw - 90px)'

/**
 * "Join SSA" pill on the homepage (Figma: join ssa pill (F)).
 *
 * Desktop is a 1:1 split — red copy panel beside a cream panel holding the
 * polaroids. 380px is a floor (`lg:min-h-[380px]`), not a fixed height: `gap-8`
 * is the CTA's *minimum* clearance and `mt-auto` soaks up any leftover height on
 * top of it, so once the card reaches its cap the copy fills the panel and it
 * lands on Figma's 380px with a 32px gap, while between `lg` and ~1240px (where
 * the narrower column wraps one line further) the panel grows past 380px instead
 * of crushing the CTA against the paragraph.
 *
 * The wrapper mirrors the home page's shared container — same gutters as the
 * highlight card and carousel above and the Instagram feed below — so all four
 * blocks share one pair of left/right edges rather than each picking its own.
 * Below `lg` the two panels stack, since Figma has no mobile frame for this.
 */
export default function JoinCard() {
  return (
    <div className="px-[21px] md:px-10 lg:px-16">
      <section className="mx-auto grid w-full max-w-[1250px] overflow-hidden rounded-xl shadow-[0px_2px_2.67px_0.67px_rgba(84,84,84,0.25)] drop-shadow-[0px_0px_2.67px_rgba(140,136,128,0.3)] lg:grid-cols-2">
        <div className="flex flex-col gap-8 bg-ssa-red p-6 sm:p-8 lg:min-h-[380px] lg:p-9">
          <div className="flex flex-col gap-2">
            <h2 className="font-be-vietnam-pro text-2xl font-bold leading-8 tracking-[-1px] text-ssa-yellow-light">
              Join SSA
            </h2>
            <div className="flex flex-col gap-6 font-inter text-base leading-6 tracking-[-0.4px] text-ssa-yellow-light">
              <p>
                The Singapore Students&apos; Association (SSA) is run by a
                committee of students from The University of Auckland and
                Auckland University of Technology. We&apos;re a home away from
                home for anyone looking to be part of a friendly and welcoming
                community.
              </p>
              <p>
                Through social events, good food, and a shared love for
                Singaporean culture, we bring people together, whether
                you&apos;re from Singapore or simply keen to meet new people and
                get involved.
              </p>
            </div>
          </div>

          <Button
            href="/signup"
            size="long"
            color="red-light"
            className="mt-auto tracking-[-0.02em]"
          >
            SIGN UP!
          </Button>
        </div>

        <div className="flex items-center justify-center bg-ssa-yellow-light px-6 py-8 lg:p-[34px]">
          <div className="relative aspect-[410/312] w-full max-w-[410px]">
            <Image
              src="/polaroid.png"
              alt="Polaroid photos of SSA members at past events"
              fill
              sizes={POLAROID_SIZES}
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
