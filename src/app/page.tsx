import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import PersonalizedRail from '@/components/home/PersonalizedRail'
import DynamicSpotlight from '@/components/home/DynamicSpotlight'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import LiveActivityTicker from '@/components/home/LiveActivityTicker'
import EmptyState from '@/components/ui/EmptyState'
import {
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getHomepageBanner,
  getNewArrivals,
  getTrendingProducts,
} from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const [banner, arrivals, trending, featured, products, categories] = await Promise.all([
    getHomepageBanner(),
    getNewArrivals(),
    getTrendingProducts(),
    getFeaturedProducts(),
    getAllProducts(),
    getCategories(),
  ])
  const safeProducts = products || []
  const featuredProducts = featured?.length ? featured : safeProducts.filter((p) => p.featured)
  const trendingProducts = trending?.length
    ? trending
    : featuredProducts.length
    ? featuredProducts.slice(0, 6)
    : safeProducts.slice(0, 6)
  const newArrivals = arrivals?.length ? arrivals : safeProducts.slice(0, 8)
  const heroCollection = featuredProducts.length ? featuredProducts.slice(0, 8) : newArrivals
  const personalizedFallback =
    safeProducts.length > 0 ? safeProducts : [...newArrivals, ...trendingProducts].slice(0, 12)
  const heroTitle = banner?.title || 'WEAR THE FUTURE'
  const heroImage = banner?.image
  const heroCtaHref = banner?.link || '/shop'

  if (!safeProducts.length && !newArrivals.length && !trendingProducts.length) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="max-w-3xl w-full">
          <EmptyState
            title="No products available yet"
            description="We’re syncing the catalog from Sanity. Check back soon or explore our collections."
            actionLabel="Browse collections"
            actionHref="/collections"
          />
        </div>
      </main>
    )
  }

  return (
    <main className="bg-brand-black">
      <HeroSection
        title={heroTitle}
        subtitle="Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force."
        imageUrl={heroImage}
        primaryCtaHref={heroCtaHref}
        primaryCtaLabel="Shop the banner edit"
        secondaryCtaHref="/collections"
        secondaryCtaLabel="Explore collections"
      />

      <LiveActivityTicker />

      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
          <div className="flex flex-col gap-6">
            <p className="section-overline">Just dropped</p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <h2 className="section-title">New Arrivals</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gray-400">
                Fresh from Sanity CMS · {(newArrivals || []).length || 8} pieces
              </span>
            </div>
            <ProductGrid
              products={newArrivals}
              priorityCount={3}
              showSkeletons={!newArrivals.length}
              skeletonCount={8}
            />
          </div>

          <div className="flex flex-col gap-6">
            <p className="section-overline">Trending now</p>
            <h2 className="section-title">Most wanted silhouettes</h2>
            <ProductGrid
              products={trendingProducts}
              priorityCount={2}
              showSkeletons={!trendingProducts.length}
              skeletonCount={6}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-black relative py-24 sm:py-32 overflow-hidden border-t border-brand-border/30">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col mb-16 items-center text-center">
            <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-brand-gold/30 block"></span>
              The Collection
              <span className="w-8 h-px bg-brand-gold/30 block"></span>
            </p>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-brand-white tracking-tight">
              Latest Arrivals
            </h2>
          </div>

          <ProductGrid
            products={heroCollection}
            showSkeletons={!heroCollection.length}
            skeletonCount={4}
          />
        </div>
      </section>

      <DynamicSpotlight products={safeProducts.length ? safeProducts : heroCollection} />

      <CategoryShowcase categories={categories || []} fallbackProducts={safeProducts} />

      <PersonalizedRail fallback={personalizedFallback} catalog={safeProducts} />

      <Footer />
    </main>
  )
}
