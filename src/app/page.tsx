import { Metadata } from 'next'
import Link from 'next/link'
import HeroSection from '@/components/home/HeroSection'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import PersonalizedRail from '@/components/home/PersonalizedRail'
import DynamicSpotlight from '@/components/home/DynamicSpotlight'
import AnnouncementBar from '@/components/home/AnnouncementBar'
import CategoryCarousel from '@/components/home/CategoryCarousel'
import LiveActivityTicker from '@/components/home/LiveActivityTicker'
import ProductShowcase from '@/components/home/ProductShowcase'
import SocialProof from '@/components/home/SocialProof'
import DropIntro from '@/components/DropIntro'
import {
  getAllProducts,
  getFeaturedProducts,
  getBanner,
  getCategories,
  getNewArrivals,
  getLatestDropProducts,
  urlFor,
} from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const [products, featured, banner, categories, newArrivals, latestDrops] = await Promise.all([
    getAllProducts(),
    getFeaturedProducts(),
    getBanner(),
    getCategories(),
    getNewArrivals(),
    getLatestDropProducts(),
  ])

  const safeProducts = products || []
  const safeFeatured = featured || []
  const safeArrivals = (newArrivals && newArrivals.length > 0 ? newArrivals : safeProducts).slice(0, 8)
  const dropProducts = (latestDrops && latestDrops.length > 0 ? latestDrops : safeArrivals).slice(0, 6)
  const featuredCollection =
    banner?.title || dropProducts[0]?.collection || dropProducts[0]?.category || 'Limited Drop'
  const spotlight = (safeFeatured.length ? safeFeatured : safeProducts).slice(0, 8)
  const trendingFallback = (safeFeatured.length ? safeFeatured : safeProducts).slice(0, 4)
  const arrivalsFallback = safeArrivals.slice(0, 4)
  const completeLook = (safeProducts.length ? safeProducts : safeArrivals).slice(0, 4)
  const heroImage =
    banner?.image && 'url' in banner.image && banner.image.url
      ? banner.image.url
      : banner?.image
      ? urlFor(banner.image).width(2000).height(1200).url()
      : undefined
  const hasCatalog = Boolean(
    safeProducts.length || safeFeatured.length || safeArrivals.length || dropProducts.length,
  )

  if (!hasCatalog) {
    return (
      <>
        <AnnouncementBar />
        <HeroSection
          title={banner?.title || 'LUXE — Wear the Future'}
          subtitle={
            banner?.subtitle ||
            'Add products in Sanity Studio to light up the catalog. Once published, drops, spotlights, and rails will render automatically.'
          }
          eyebrow={banner?.eyebrow || 'Catalog warming up'}
          ctaHref={banner?.cta?.href || '/admin'}
          ctaLabel={banner?.cta?.label || 'Go to admin'}
          imageUrl={heroImage}
        />
        <section className="bg-brand-black border-t border-brand-border/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
            <p className="section-overline">Awaiting inventory</p>
            <h2 className="section-title">No products found</h2>
            <p className="text-brand-gray-400 max-w-3xl">
              Connect Sanity credentials and publish products to populate the storefront. This page stays minimal until live data is available.
            </p>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const liveViewers =
    safeProducts.reduce((acc, product) => acc + (product.liveViewers ?? 0), 0) || 32
  const soldLastHour =
    safeProducts.reduce(
      (acc, product) =>
        acc + (product.salesVelocity ?? Math.max(1, Math.round(((product.soldCount ?? 60) || 60) / 70))),
      0,
    ) || 8
  const lowStockFlags = safeProducts.filter(
    (product) => product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 3,
  ).length

  return (
    <>
      <DropIntro products={dropProducts} banner={banner} collectionName={featuredCollection} />
      <AnnouncementBar />
      <LiveActivityTicker anchor="Global atelier" products={safeProducts.length ? safeProducts : spotlight} />

      <section className="bg-brand-black/80 border-b border-brand-border/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass rounded-lg px-4 py-3 border border-brand-border/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-500">Live now</p>
              <p className="text-brand-white font-semibold">🔥 {liveViewers} people viewing</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          </div>
          <div className="glass rounded-lg px-4 py-3 border border-brand-border/50 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-500">Velocity</p>
              <p className="text-brand-white font-semibold">{soldLastHour} sold in last hour</p>
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-brand-gold">Moving fast</span>
          </div>
          <Link
            href="/shop"
            className="glass rounded-lg px-4 py-3 border border-brand-border/50 flex items-center justify-between hover:border-brand-gold/30 transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-500">Collection</p>
              <p className="text-brand-white font-semibold">
                {lowStockFlags ? `${lowStockFlags} pieces at risk` : 'Nightfall Atelier'}
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold hover:text-brand-gold-light transition-colors hover-line">
              Explore
            </span>
          </Link>
        </div>
      </section>
      <HeroSection
        title={banner?.title || 'WEAR THE FUTURE'}
        subtitle={
          banner?.subtitle ||
          'Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force.'
        }
        eyebrow={banner?.eyebrow || 'New Collection · SS25'}
        ctaHref={banner?.cta?.href || '/shop'}
        ctaLabel={banner?.cta?.label || 'Shop Now'}
        imageUrl={heroImage}
      />

      <DynamicSpotlight products={spotlight} />

      <section className="bg-brand-black border-t border-brand-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
          <div className="flex flex-col gap-6">
            <p className="section-overline">Trending now</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">Most wanted silhouettes</h2>
              <span className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                🔥 12 people viewing right now
              </span>
            </div>
            <ProductGrid products={trendingFallback} priorityCount={2} />
          </div>

          <div className="flex flex-col gap-6">
            <p className="section-overline">New arrivals</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">Fresh drops, limited runs</h2>
              <span className="text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                5 sold in the last hour
              </span>
            </div>
            <ProductGrid products={arrivalsFallback} priorityCount={2} />
          </div>
        </div>
      </section>

      <ProductShowcase products={spotlight} />

      <CategoryCarousel categories={categories || []} />

      <section className="bg-brand-black relative py-20 sm:py-24 overflow-hidden border-t border-brand-border/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="section-overline">Complete the look</p>
              <h2 className="section-title">Stylist-picked pairings</h2>
              <p className="text-brand-gray-400 mt-3 max-w-2xl">
                Layer core pieces with statement silhouettes. Smart labels flag fresh drops, trending picks, and low stock so you never miss.
              </p>
            </div>
            {hasCatalog && (
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                <span className="px-3 py-1 rounded-full border border-brand-border/50">New</span>
                <span className="px-3 py-1 rounded-full border border-brand-border/50">Trending</span>
                <span className="px-3 py-1 rounded-full border border-brand-border/50">Low stock</span>
              </div>
            )}
          </div>

          <ProductGrid products={completeLook} priorityCount={1} />
        </div>
      </section>

      <SocialProof />

      <PersonalizedRail fallback={safeArrivals} catalog={safeProducts} />

      <Footer />
    </>
  )
}
