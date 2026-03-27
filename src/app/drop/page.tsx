import Link from 'next/link'
import { Metadata } from 'next'
import DropIntro from '@/components/DropIntro'
import ProductGrid from '@/components/shop/ProductGrid'
import LiveActivityTicker from '@/components/home/LiveActivityTicker'
import PersonalizedRail from '@/components/home/PersonalizedRail'
import { getBanner, getFeaturedProducts, getLatestDropProducts } from '@/lib/sanity'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Luxury Drop Engine | LUXE',
  description: 'Experience the Luxury Drop Engine — scheduled drops, live hype, and scarcity cues inspired by premium launches.',
}

export default async function DropPage() {
  const [banner, latestDrops, featured] = await Promise.all([
    getBanner(),
    getLatestDropProducts(),
    getFeaturedProducts(),
  ])

  const pool = (latestDrops?.length ? latestDrops : featured).slice(0, 12)
  const heroProducts = pool.slice(0, 6)
  const dropStats = pool.reduce(
    (acc, product) => {
      const viewers = product.liveViewers ?? 12
      const soldHour = product.salesVelocity ?? Math.max(1, Math.round(((product.soldCount ?? 60) || 60) / 60))
      const low = product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 3
      return {
        viewers: acc.viewers + viewers,
        soldHour: acc.soldHour + soldHour,
        lowStock: acc.lowStock + (low ? 1 : 0),
      }
    },
    { viewers: 0, soldHour: 0, lowStock: 0 },
  )

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="relative overflow-hidden border-b border-brand-border/30 bg-gradient-to-br from-brand-black via-brand-black to-brand-darker/80 pt-24 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_45%),radial-gradient(circle_at_50%_70%,rgba(201,168,76,0.06),transparent_40%)]" />
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-noise" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-brand-gold">
            <span className="inline-flex h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            Luxury Drop Engine
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-white leading-tight">
            {banner?.dropTitle || 'Enter the Drop'}
          </h1>
          <p className="max-w-3xl text-brand-gray-300 text-lg">
            Scheduled releases, live hype, and scarcity cues inspired by luxury launches. Join the queue, feel the countdown, and secure the drop before it vanishes.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn-primary px-6 py-3 text-sm uppercase tracking-[0.3em]">
              Enter Drop
            </Link>
            <Link
              href="/account"
              className="btn-secondary px-6 py-3 text-sm uppercase tracking-[0.3em] border border-brand-border/70"
            >
              Access Account
            </Link>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brand-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              Live now · {dropStats.viewers || 32} viewing
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <DropIntro products={heroProducts} banner={banner} collectionName={banner?.title} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-overline">Now live</p>
            <h2 className="section-title">The curated grid</h2>
            <p className="text-brand-gray-400 mt-2">
              Scarcity-aware badges surface what&apos;s trending, new, or at risk. Tap a tile to feel the hover glow and dive in.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs uppercase tracking-[0.25em] text-brand-gray-400">
            <div className="rounded-lg border border-brand-border/50 bg-brand-card/60 px-4 py-3">
              <p className="text-brand-gray-500">Viewing now</p>
              <p className="text-brand-white text-lg font-semibold">{dropStats.viewers || 32}</p>
            </div>
            <div className="rounded-lg border border-brand-border/50 bg-brand-card/60 px-4 py-3">
              <p className="text-brand-gray-500">Sold last hour</p>
              <p className="text-brand-white text-lg font-semibold">{dropStats.soldHour || 12}</p>
            </div>
            <div className="rounded-lg border border-brand-border/50 bg-brand-card/60 px-4 py-3">
              <p className="text-brand-gray-500">Low stock flags</p>
              <p className="text-brand-white text-lg font-semibold">{dropStats.lowStock}</p>
            </div>
          </div>
        </div>

        <ProductGrid products={pool.slice(0, 8)} priorityCount={4} />
      </section>

      <section className="border-t border-brand-border/30 bg-brand-dark/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="section-overline">Stay ahead</p>
            <h3 className="section-title">Live activity feed</h3>
            <p className="text-brand-gray-400 mt-2 max-w-2xl">
              Real-time toasts surface purchases, carts, and rush signals while you browse the drop.
            </p>
          </div>
          <Link href="/account/wishlist" className="btn-secondary px-5 py-2 text-[11px] uppercase tracking-[0.3em]">
            Save to wishlist
          </Link>
        </div>
        <LiveActivityTicker anchor="Luxury Drop" products={pool} />
      </section>

      <PersonalizedRail fallback={pool.slice(0, 6)} catalog={pool} />
    </div>
  )
}
