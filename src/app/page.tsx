import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import AnnouncementBar from '@/components/home/AnnouncementBar'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import StorySection from '@/components/home/StorySection'
import ProductShowcase from '@/components/home/ProductShowcase'
import SocialProof from '@/components/home/SocialProof'
import NewsletterSection from '@/components/home/NewsletterSection'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'LUXE — Premium Fashion | Wear the Future',
  description: 'Discover premium dark luxury clothing. Exclusive drops, limited editions, and timeless pieces crafted for the discerning.',
}

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <HeroSection />
      <FeaturedCollection />
      <StorySection />
      <ProductShowcase />
      <SocialProof />
      <NewsletterSection />
      <Footer />
    </>
  )
}
