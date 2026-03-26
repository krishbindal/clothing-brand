import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import AnnouncementBar from '@/components/home/AnnouncementBar'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import StorySection from '@/components/home/StorySection'
import ProductShowcase from '@/components/home/ProductShowcase'
import SocialProof from '@/components/home/SocialProof'
import NewsletterSection from '@/components/home/NewsletterSection'
import Footer from '@/components/layout/Footer'
import { getCollections, getFeaturedProducts, getHomepageContent } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default async function HomePage() {
  const [homepage, featuredProducts, collections] = await Promise.all([
    getHomepageContent(),
    getFeaturedProducts(),
    getCollections(),
  ])

  return (
    <>
      <AnnouncementBar />
      <HeroSection title={homepage?.heroTitle} subtitle={homepage?.heroSubtitle} />
      <FeaturedCollection items={collections} />
      <StorySection />
      <ProductShowcase products={featuredProducts} />
      <SocialProof />
      <NewsletterSection />
      <Footer />
    </>
  )
}
