type SkeletonProps = {
  className?: string
}

export default function Skeleton({ className = '' }: Readonly<SkeletonProps>) {
  return <div aria-hidden="true" className={`animate-shimmer ${className}`} />
}

export function SkeletonLine({ className = '' }: Readonly<SkeletonProps>) {
  return (
    <div className="flex h-6 items-center">
      <Skeleton className={`h-3 rounded-full ${className}`} />
    </div>
  )
}
