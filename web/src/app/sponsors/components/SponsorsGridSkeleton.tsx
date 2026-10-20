import Skeleton from '@/components/Skeleton'

const TILE_COUNT = 24

export default function SponsorsGridSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mt-20 grid w-full grid-cols-3 gap-1.75 sm:gap-4 md:grid-cols-4 xl:grid-cols-6 xl:gap-[20.87px]"
    >
      <span className="sr-only">Loading sponsors…</span>
      {Array.from({ length: TILE_COUNT }, (_, index) => (
        <Skeleton key={index} className="aspect-square w-full rounded-[6px]" />
      ))}
    </div>
  )
}
