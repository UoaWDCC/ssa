import Skeleton from '@/components/Skeleton'

const TILE_COUNT = 18
const DESKTOP_TILE_COUNT = 16

export default function ExecGridSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Loading team…
      </span>
      {Array.from({ length: TILE_COUNT }, (_, index) => (
        <Skeleton
          key={index}
          className={`aspect-square w-full rounded-[4px] xl:rounded-[6px]${
            index >= DESKTOP_TILE_COUNT ? ' md:hidden' : ''
          }`}
        />
      ))}
    </>
  )
}
