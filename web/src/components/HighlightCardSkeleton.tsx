import Skeleton, { SkeletonLine } from '@/components/Skeleton'

type HighlightCardSkeletonProps = {
  variant: 'sponsor' | 'event'
}

export default function HighlightCardSkeleton({
  variant,
}: Readonly<HighlightCardSkeletonProps>) {
  const isEvent = variant === 'event'

  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto flex w-full max-w-[360px] flex-col overflow-hidden rounded-xl border-2 border-ssa-skeleton bg-ssa-white p-[22px] md:max-w-[720px] xl:grid xl:max-w-[1250px] xl:grid-cols-2 xl:gap-9 xl:p-[34px]"
    >
      <span className="sr-only">
        {isEvent ? 'Loading upcoming event…' : 'Loading sponsor of the week…'}
      </span>

      <Skeleton className="hidden rounded-[16px] xl:block" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div>
          <div className="flex h-4 items-center">
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
          <div className="mt-[2px] flex h-7 items-center">
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>

          <div className="mt-1 flex gap-2">
            {isEvent ? (
              <>
                <Skeleton className="h-[22px] w-12 rounded-[2px]" />
                <Skeleton className="h-[22px] w-24 rounded-[2px]" />
              </>
            ) : (
              <Skeleton className="h-[22px] w-28 rounded-[2px]" />
            )}
          </div>

          {isEvent && (
            <div className="mt-4 flex flex-col gap-1 xl:mt-8 xl:gap-0">
              <SkeletonLine className="w-48" />
              <SkeletonLine className="w-32" />
            </div>
          )}
        </div>

        <div className="mt-4">
          {Array.from({ length: isEvent ? 3 : 2 }, (_, index) => (
            <SkeletonLine key={index} className="w-full" />
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Skeleton className="h-11 w-full max-w-[566px] rounded-full md:max-w-none xl:max-w-[566px]" />
        </div>
      </div>
    </div>
  )
}
