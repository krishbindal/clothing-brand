'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, ChevronDown, Truck, RotateCcw, Shield, Star, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'
import ImageZoom from '@/components/ui/ImageZoom'
const accordionData = [
  {
    title: 'Details & Materials',
    content: 'Crafted from premium 80% cotton, 20% polyester blend. Brushed fleece interior for ultimate softness. Dropped shoulders, relaxed fit, kangaroo pocket. Tonal LUXE embroidery on chest. Machine wash cold, tumble dry low.',
  },
  {
    title: 'Fit & Sizing',
    content: "This piece is designed for an oversized silhouette. We recommend sizing down if you prefer a more fitted look. Model is 6'1\" and wears size M.",
  },
  {
    title: 'Shipping & Returns',
    content: 'Free standard shipping on orders over $150. Express shipping available. Returns accepted within 30 days of delivery. Items must be unworn with original tags.',
  },
]

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = product ? isInWishlist(product.id) : false

  const discount = product?.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0

  const handleAddToCart = () => {
    if (!product || !selectedSize) return
    addItem(product, Math.max(1, quantity), selectedSize, selectedColor || product.colors?.[0]?.name || '')
    setAddedToCart(true)
    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current)
    }
    addFeedbackTimeoutRef.current = setTimeout(() => setAddedToCart(false), 2000)
  }

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    async function loadProduct() {
      const { slug } = params
      try {
        const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Failed to load product')
        const payload = (await response.json()) as { product: Product | null; featuredProducts: Product[] }
        if (!mounted) return
        if (!payload.product) {
          router.replace('/shop')
          return
        }
        setProduct(payload.product)
        setRecommendedProducts(
          (payload.featuredProducts || [])
            .filter((item) => item.slug !== payload.product?.slug)
            .slice(0, 4)
        )
        setSelectedColor(payload.product?.colors?.[0]?.name || '')
        setSelectedSize(payload.product?.sizes?.[0]?.label || '')
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          if (mounted) {
            router.replace('/shop')
          }
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void loadProduct()

    return () => {
      mounted = false
      controller.abort()
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current)
      }
    }
  }, [params, router])

  if (isLoading) {
    return <div className="min-h-screen bg-brand-black pt-20" />
  }

  if (!product) {
    return <div className="min-h-screen bg-brand-black pt-20 text-brand-gray-300 px-4">Product unavailable. Please try again.</div>
  }

  const selectedSizeData = product.sizes?.find((s) => s.label === selectedSize)
  const isLowStock = selectedSizeData && selectedSizeData.stockCount && selectedSizeData.stockCount <= 3

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brand-gray-500">
          <Link href="/" className="hover:text-brand-white hover-line transition-colors">Home</Link>
          <span className="text-brand-gray-700">/</span>
          <Link href="/shop" className="hover:text-brand-white hover-line transition-colors">Shop</Link>
          <span className="text-brand-gray-700">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-white hover-line transition-colors capitalize">{product.category}</Link>
          <span className="text-brand-gray-700">/</span>
          <span className="text-brand-gray-300">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Main Image with Zoom */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-brand-card group">
              <ImageZoom zoomLevel={2.5} className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full bg-gradient-to-br from-brand-card via-brand-muted to-brand-darker flex items-center justify-center"
                  >
                    <motion.span
                      className="text-5xl font-display font-bold gold-text tracking-[0.3em] opacity-15 select-none"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      LUXE
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </ImageZoom>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.tags?.includes('bestseller') && (
                  <span className="bg-brand-gold text-brand-black text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
                    Bestseller
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase">
                    -{discount}% Off
                  </span>
                )}
              </div>

              {isLowStock && (
                <div className="absolute top-4 right-4 z-10 pointer-events-none bg-amber-500/90 text-brand-black text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wide animate-breathe">
                  Only {selectedSizeData?.stockCount} left
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2.5">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-20 aspect-[4/5] rounded-lg overflow-hidden bg-brand-card border-2 transition-all duration-300 ease-luxury hover:scale-[1.04]',
                      selectedImage === i
                        ? 'border-brand-gold shadow-[0_0_12px_rgba(201,168,76,0.25)]'
                        : 'border-transparent hover:border-brand-gray-600'
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-card to-brand-muted flex items-center justify-center">
                      <span className="text-[8px] font-display gold-text opacity-20 tracking-widest">LUXE</span>
                    </div>
                    <span className="sr-only">{img.alt}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info — sticky on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24 lg:self-start space-y-6"
          >
            {/* Title & Price */}
            <div>
              {product.collection && (
                <p className="text-brand-gold text-[11px] font-semibold uppercase tracking-[0.35em] mb-2">{product.collection}</p>
              )}
              <h1 className="text-display-sm sm:text-display-md font-display font-bold text-brand-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-semibold text-brand-white">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-brand-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                    <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
                      Save {formatPrice(product.comparePrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2.5 mt-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating!) ? 'text-brand-gold' : 'text-brand-gray-700'}
                        fill={i < Math.floor(product.rating!) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-brand-gray-400">{product.rating}</span>
                  <span className="text-xs text-brand-gray-600">({product.reviewCount} reviews)</span>
                </div>
              )}

              <p className="text-brand-gray-400 text-[15px] leading-relaxed mt-5">
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-brand-border/50" />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-gray-300 mb-3">
                  Color: <span className="text-brand-white">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      disabled={!color.available}
                      title={color.name}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 transition-all duration-300 ease-luxury relative',
                        selectedColor === color.name
                          ? 'border-brand-gold scale-110 shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                          : 'border-transparent hover:border-brand-gold/50 hover:scale-105',
                        !color.available && 'opacity-30 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 rounded-full border-2 border-brand-black scale-[0.7]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-brand-gray-300">
                  Size: <span className="text-brand-white">{selectedSize || 'Select'}</span>
                </p>
                <Link href="/size-guide" className="text-xs text-brand-gold hover:text-brand-gold-light underline underline-offset-2 transition-colors">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => size.available && setSelectedSize(size.label)}
                    disabled={!size.available}
                    className={cn(
                      'min-w-[3.5rem] h-12 px-4 border rounded-lg text-sm font-medium transition-all duration-300 ease-luxury relative',
                      selectedSize === size.label
                        ? 'bg-brand-gold border-brand-gold text-brand-black shadow-[0_0_16px_rgba(201,168,76,0.3)] scale-[1.03]'
                        : size.available
                        ? 'border-brand-border text-brand-gray-300 hover:border-brand-gray-400 hover:text-brand-white'
                        : 'border-brand-border/20 text-brand-gray-700 cursor-not-allowed'
                    )}
                  >
                    {size.label}
                    {!size.available && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-brand-gray-700 rotate-45 absolute" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-[11px] text-brand-gray-600 mt-2.5 uppercase tracking-wide">Please select a size to continue</p>
              )}
              {isLowStock && selectedSizeData && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-amber-300 mt-2.5 uppercase tracking-wide font-medium"
                >
                  ⚡ Only {selectedSizeData.stockCount} left in {selectedSize} — selling fast
                </motion.p>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-brand-gray-400 hover:text-brand-white hover:bg-brand-card transition-all duration-200"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-12 flex items-center justify-center text-brand-gray-400 hover:text-brand-white hover:bg-brand-card transition-all duration-200"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedSize || !product.inStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2.5 h-12 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-400',
                  !selectedSize || !product.inStock
                    ? 'bg-brand-muted text-brand-gray-600 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light hover:shadow-gold'
                )}
                whileTap={{ scale: selectedSize && product.inStock ? 0.98 : 1 }}
              >
                {!product.inStock ? (
                  <>Out of Stock</>
                ) : addedToCart ? (
                  <>
                    <Check size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart — {formatPrice(product.price * quantity)}
                  </>
                )}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'w-12 h-12 flex items-center justify-center border rounded-lg transition-all duration-300',
                  inWishlist
                    ? 'bg-brand-gold/10 border-brand-gold text-brand-gold'
                    : 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white'
                )}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </motion.button>

              {/* Share */}
              <button className="w-12 h-12 flex items-center justify-center border border-brand-border rounded-lg text-brand-gray-400 hover:text-brand-white hover:border-brand-gray-400 transition-all duration-200">
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-brand-border/50">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $150' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day window' },
                { icon: Shield, label: 'Secure Checkout', sub: 'SSL encrypted' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 rounded-full bg-brand-card border border-brand-border/50 flex items-center justify-center mb-2 group-hover:border-brand-gold/30 transition-colors duration-400">
                    <Icon size={17} className="text-brand-gold" />
                  </div>
                  <span className="text-xs text-brand-white font-medium">{label}</span>
                  <span className="text-[10px] text-brand-gray-600 mt-0.5">{sub}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {accordionData.map((item) => (
                <div key={item.title} className="border border-brand-border/60 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.title ? null : item.title)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-brand-white hover:bg-brand-card/60 transition-colors duration-300"
                  >
                    {item.title}
                    <ChevronDown
                      size={15}
                      className={cn(
                        'text-brand-gray-500 transition-transform duration-400 ease-luxury',
                        openAccordion === item.title && 'rotate-180 text-brand-gold'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-brand-gray-400 leading-relaxed">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <div className="mt-24 border-t border-brand-border/30 pt-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <p className="section-overline">Complete the Look</p>
              <h2 className="text-display-xs sm:text-display-sm font-display font-bold text-brand-white">
                Pairs perfectly with {product.name}
              </h2>
            </div>
            <Link href="/shop" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors hover-line">
              View full edit →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {recommendedProducts.map((item, i) => (
              <ProductCard key={item.id} product={item} priority={i < 2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
