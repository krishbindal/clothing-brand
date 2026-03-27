import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-3">
            <Skeleton className="w-full aspect-[4/5] rounded-xl bg-brand-card/60" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="w-20 aspect-[4/5] rounded-lg bg-brand-card/50" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-16 w-full" />
            </div>

            <Skeleton className="h-px w-full bg-brand-border/60" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-3">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2 flex-wrap">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-11 w-16 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="aspect-[4/5] rounded-lg bg-brand-card/60" />
          ))}
        </div>
      </div>
    </div>
  )
}
