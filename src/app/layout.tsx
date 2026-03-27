import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { AuthProvider } from '@/components/providers/AuthProvider'
import LenisProvider from '@/components/providers/LenisProvider'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import PageTransition from '@/components/layout/PageTransition'
import LiveConversionFeed from '@/components/engagement/LiveConversionFeed'
import PremiumLoader from '@/components/layout/PremiumLoader'
import GoldenCursor from '@/components/ui/GoldenCursor'

export const metadata: Metadata = {
  title: {
    default: 'LUXE — Premium Fashion | Wear the Future',
    template: '%s | LUXE',
  },
  description: 'Premium dark luxury clothing brand. Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force.',
  keywords: ['luxury fashion', 'premium clothing', 'dark aesthetic', 'street luxury', 'designer streetwear'],
  authors: [{ name: 'LUXE' }],
  creator: 'LUXE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LUXE',
    title: 'LUXE — Premium Fashion | Wear the Future',
    description: 'Premium dark luxury clothing brand. Precision-crafted silhouettes, deep tonal textures, and limited drops.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXE — Premium Fashion | Wear the Future',
    description: 'Premium dark luxury clothing brand. Wear the Future.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans bg-brand-black text-brand-white antialiased" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LenisProvider>
                <PremiumLoader />
                <GoldenCursor />
                <Navbar />
                <PageTransition>
                  <main>{children}</main>
                </PageTransition>
                <CartDrawer />
                <LiveConversionFeed />
                <Toaster />
                <AnalyticsTracker />
              </LenisProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
