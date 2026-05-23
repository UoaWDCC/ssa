export default function JoinCard() {
  return (
    <section className="w-full overflow-hidden rounded-3xl border-2 border-ssa-muted-gold bg-ssa-white shadow-[0_12px_0_rgba(159,125,50,0.12)]">
      <div className="flex min-h-80 flex-col md:flex-row">
        <div className="flex flex-1 flex-col justify-between gap-6 bg-ssa-pink p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="space-y-4">
            <h2 className="font-averia text-4xl font-bold leading-tight text-ssa-black sm:text-5xl">
              Join SSA
            </h2>
            <p className="max-w-md text-base leading-7 text-ssa-black sm:text-lg">
              Sign up to Join SSA and get to know others in the community...
              Singapore Singapore Singapore.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center justify-center rounded-full border-2 border-ssa-muted-gold bg-ssa-yellow-light px-6 py-3 font-averia text-base font-bold text-ssa-muted-gold transition-transform duration-200 hover:-translate-y-0.5 hover:bg-ssa-yellow"
          >
            Sign Up! →
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center bg-ssa-white p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex aspect-4/3 w-full max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-ssa-muted-gold/40 bg-white text-center shadow-inner">
            <span className="px-6 font-averia text-2xl font-bold text-ssa-muted-gold sm:text-3xl">
              Placeholder image
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
