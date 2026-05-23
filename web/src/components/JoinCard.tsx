import Link from 'next/link'

export default function JoinCard() {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <section className="mx-auto w-full max-w-230 overflow-hidden rounded-4xl bg-ssa-card shadow-[0px_3px_4px_1px_#00000040,1px_-5px_4.3px_0px_#D5D5D54D]">
        <div className="flex min-h-60 flex-col md:flex-row">
          <div className="flex flex-1 flex-col justify-between gap-4 bg-ssa-red p-5 sm:p-6 md:p-7 lg:p-8">
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

          <div className="flex flex-1 items-center justify-center bg-ssa-white p-4 sm:p-5 md:p-6 lg:p-7">
            <div className="flex aspect-4/3 w-full max-w-70 items-center justify-center rounded-2xl border-2 border-dashed border-ssa-muted-gold/40 bg-white text-center shadow-inner sm:max-w-80 lg:max-w-90">
              <span className="px-4 font-averia text-xl font-bold text-ssa-muted-gold sm:text-2xl">
                Placeholder image
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
