import Skeleton, { SkeletonLine } from '@/components/Skeleton'

const PARAGRAPH_LINES = 7

export default function JoinCardSkeleton() {
  return (
    <div className="px-[21px] md:px-10 lg:px-16">
      <section
        role="status"
        aria-busy="true"
        className="mx-auto grid w-full max-w-[1250px] overflow-hidden rounded-xl border-2 border-ssa-skeleton bg-ssa-white lg:grid-cols-2"
      >
        <span className="sr-only">Loading…</span>

        <div className="flex flex-col gap-8 p-[22px] sm:p-[30px] lg:min-h-[376px] lg:p-[34px]">
          <div className="flex flex-col gap-2">
            <div className="flex h-8 items-center">
              <Skeleton className="h-6 w-full rounded-full" />
            </div>
            <div>
              {Array.from({ length: PARAGRAPH_LINES }, (_, index) => (
                <SkeletonLine key={index} className="w-full" />
              ))}
            </div>
          </div>

          <Skeleton className="mt-auto h-11 w-full rounded-full" />
        </div>

        <div className="flex items-center justify-center px-6 py-8 lg:p-[34px]">
          <div className="relative aspect-[410/312] w-full max-w-[410px]">
            <Skeleton className="absolute left-[2%] top-[4%] h-[88%] w-[46%] -rotate-[8deg] rounded-[2px]" />
            <Skeleton className="absolute right-[2%] top-[8%] h-[84%] w-[46%] rotate-[6deg] rounded-[2px]" />
          </div>
        </div>
      </section>
    </div>
  )
}
