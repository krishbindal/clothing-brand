import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { SessionProvider } from '@/components/providers/SessionProvider'
import LenisProvider from '@/components/providers/LenisProvider'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

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
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-brand-black text-brand-white antialiased">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <LenisProvider>
                <Navbar />
                <main>{children}</main>
                <CartDrawer />
                <Toaster />
              </LenisProvider>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
