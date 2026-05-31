import Link from 'next/link'
import Image from 'next/image'

export default function JoinCard() {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <section className="mx-auto w-full max-w-[1214px] overflow-hidden rounded-[32px] bg-ssa-card shadow-[0px_3px_4px_1px_#00000040,1px_-5px_4.3px_0px_#D5D5D54D] lg:grid lg:min-h-[420px] lg:grid-cols-2">
        <div className="flex min-h-60 flex-col gap-4 bg-ssa-red p-6 sm:p-8 lg:min-h-0 lg:p-12 lg:pr-10">
          <div className="space-y-3">
            <h2 className="font-averia text-3xl font-bold leading-tight text-ssa-white sm:text-4xl lg:text-[2.4rem]">
              Join SSA
            </h2>
            <p className="font-averia max-w-md text-sm leading-6 text-ssa-white sm:text-base lg:text-lg">
              Sign up to Join SSA and get to know others in the community...
              Singapore Singapore Singapore.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-ssa-muted-gold bg-ssa-yellow-light px-4 py-2 font-averia text-sm font-bold text-ssa-muted-gold transition-transform duration-200 hover:-translate-y-0.5 hover:bg-ssa-yellow sm:px-5 sm:py-2.5 sm:text-base"
          >
            Sign Up! →
          </Link>
        </div>
        <div className="hidden bg-ssa-yellow-white lg:flex lg:min-w-0 lg:items-center lg:justify-center lg:p-4">
          <div className="relative h-full w-full max-w-[420px] overflow-hidden rounded-[20px]">
            <Image
              src="/polaroid.png"
              alt="Polaroid"
              fill
              sizes="(min-width: 1024px) 420px, 0px"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
