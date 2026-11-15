import Skeleton from '@/components/Skeleton'

const CARD_COUNT = 6

function PastEventCardSkeleton() {
  return (
    <div className="relative aspect-[195/240] w-full max-w-[195px] overflow-hidden rounded-[6px] border-2 border-ssa-skeleton bg-ssa-white sm:aspect-[404/323] sm:max-w-[404px]">
      <div className="absolute inset-2.5 sm:inset-[22px]">
        <Skeleton className="absolute left-0 top-0 h-3 w-1/3 rounded-full" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2">
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-3.5 w-full rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-[18px] w-8 rounded-[2px] sm:h-[22px] sm:w-10" />
            <Skeleton className="h-[18px] w-14 rounded-[2px] sm:h-[22px] sm:w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PastEventsGridSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mt-14 grid grid-cols-[repeat(2,minmax(0,195px))] items-start justify-center gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
    >
      <span className="sr-only">Loading past events…</span>
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <PastEventCardSkeleton key={index} />
      ))}
    </div>
  )
}
