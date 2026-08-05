import Image from 'next/image'
import Button from '@/components/Button'

/**
 * "Join SSA" pill on the homepage (Figma: join ssa pill (F)).
 *
 * Desktop is a 1:1 split — red copy panel beside a cream panel holding the
 * polaroids — at a fixed 380px tall. `gap-8` is the CTA's *minimum* clearance and
 * `mt-auto` soaks up any leftover height on top of it: at the design's 1214px the
 * copy fills the panel exactly, so the gap lands on Figma's 32px, and between
 * `lg` and ~1240px (where the narrower column wraps one line further) the panel
 * grows instead of crushing the CTA against the paragraph.
 * Below `lg` the two panels stack, since Figma has no mobile frame for this.
 */
export default function JoinCard() {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <section className="mx-auto grid w-full max-w-[1214px] overflow-hidden rounded-xl shadow-[0px_2px_2.67px_0.67px_rgba(84,84,84,0.25)] drop-shadow-[0px_0px_2.67px_rgba(140,136,128,0.3)] lg:grid-cols-2">
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
            color="salmon"
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
              sizes="(min-width: 640px) 410px, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
