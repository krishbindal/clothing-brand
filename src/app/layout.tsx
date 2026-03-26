import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'

export const metadata: Metadata = {
  title: {
    default: 'LUXE — Premium Fashion',
    template: '%s | LUXE',
  },
  description: 'Premium dark luxury clothing brand. Wear the Future.',
  keywords: ['luxury fashion', 'premium clothing', 'dark aesthetic', 'street luxury'],
  authors: [{ name: 'LUXE' }],
  creator: 'LUXE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LUXE',
    title: 'LUXE — Premium Fashion',
    description: 'Premium dark luxury clothing brand. Wear the Future.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXE — Premium Fashion',
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
      <body className="font-sans bg-brand-black text-brand-white antialiased">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <CartDrawer />
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
