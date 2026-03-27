import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-brand-border/40', className)} />
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-brand-border/40 bg-brand-card/70 overflow-hidden"
        >
          <Skeleton className="aspect-[4/5] w-full bg-gradient-to-br from-brand-card/40 to-brand-border/30" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
