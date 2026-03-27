export default function ProductCardSkeleton() {
  return (
    <div className="group relative rounded-lg border border-brand-border/40 bg-brand-card overflow-hidden animate-pulse">
      <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-dark via-brand-card to-brand-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%)]" />
        <div className="absolute bottom-4 left-4 right-4 h-2 bg-brand-border/40 rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-3/4 bg-brand-border/50 rounded" />
        <div className="h-3 w-1/2 bg-brand-border/40 rounded" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 w-16 bg-brand-border/40 rounded" />
          <div className="h-3 w-12 bg-brand-border/30 rounded" />
        </div>
      </div>
    </div>
  )
}
