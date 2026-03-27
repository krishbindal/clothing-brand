'use client'

import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, ChevronDown, Truck, RotateCcw, Shield, Star, Minus, Plus, ShoppingBag, Check, Maximize2, Activity, Flame, Sparkles, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'
import ImageZoom from '@/components/ui/ImageZoom'
import { useProducts } from '@/hooks'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import EmptyState from '@/components/ui/EmptyState'
import ProductPageSkeleton from '@/components/shop/ProductPageSkeleton'
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

const demoReviews = [
  {
    name: 'Rina K.',
    title: 'Luxurious feel, sharp silhouette',
    text: 'The drape and weight on this piece are unreal. Feels custom-tailored and the fabric barely wrinkles.',
    rating: 5,
    tag: 'Verified purchase',
    ago: '2 days ago',
  },
  {
    name: 'Elias M.',
    title: 'Street-ready but elevated',
    text: 'Layered this with a mesh base and the look is lethal. Subtle branding makes it feel like archive.',
    rating: 5,
    tag: 'Style mentor',
    ago: '5 days ago',
  },
  {
    name: 'Jules T.',
    title: 'Runs slightly oversized',
    text: 'I sized down for a closer fit. Stitching is immaculate and the hood structure holds its shape.',
    rating: 4,
    tag: 'Fit feedback',
    ago: '1 week ago',
  },
]

const purchaseNames = ['Aria', 'Max', 'Lena', 'Noah', 'Zara', 'Kai', 'Milan', 'Nova']

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { product, featuredProducts, isLoading, error, refetch } = useProducts({ slug: params.slug })
  const { products: pairingPool } = useProducts({
    category: product?.category,
    limit: 30,
    enabled: Boolean(product),
  })
  const { addProduct, recentlyViewed, isLoaded: recentsLoaded } = useRecentlyViewed()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selection, setSelection] = useState({ slug: '', color: '', size: '' })
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [immersiveOpen, setImmersiveOpen] = useState(false)
  const [liveViewers, setLiveViewers] = useState(() => 48 + Math.floor(Math.random() * 40))
  const [purchaseSignal, setPurchaseSignal] = useState<{ name: string; item: string } | null>(null)
  const touchStartX = useRef<number | null>(null)
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { addItem, items: cartItems } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = product ? isInWishlist(product.id) : false
  const isBestseller = product?.tags?.includes('bestseller')
  const isNewDrop = product?.tags?.includes('new-drop') || product?.tags?.includes('new')

  const productImages = useMemo(
    () =>
      product?.images?.length && product.images.length > 0
        ? product.images
        : [{ url: '', alt: product?.name || 'Product image', width: 800, height: 1000 }],
    [product]
  )
  const selectedColor =
    selection.slug === product?.slug ? selection.color : product?.colors?.[0]?.name || ''
  const selectedSize =
    selection.slug === product?.slug ? selection.size : product?.sizes?.[0]?.label || ''

  const discount = product?.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0

  const handleNextImage = () => {
    const total = Math.max(productImages.length, 1)
    setSelectedImage((prev) => (prev + 1) % total)
  }

  const handlePrevImage = () => {
    const total = Math.max(productImages.length, 1)
    setSelectedImage((prev) => (prev - 1 + total) % total)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0]?.clientX - touchStartX.current
    if (delta && Math.abs(delta) > 40) {
      if (delta > 0) {
        handlePrevImage()
      } else {
        handleNextImage()
      }
    }
    touchStartX.current = null
  }

  const recommendedProducts = useMemo(
    () => (featuredProducts || []).filter((item) => item.slug !== product?.slug).slice(0, 4),
    [featuredProducts, product?.slug],
  )

  const completeLookProducts = useMemo(() => {
    if (!product) return recommendedProducts
    const pool = pairingPool && pairingPool.length > 0 ? pairingPool : featuredProducts || []

    const scored = pool
      .filter((item) => item.slug !== product.slug)
      .map((item) => {
        const tagOverlap =
          item.tags?.filter((tag) => product.tags?.includes(tag)).length || 0
        const complement = item.category !== product.category ? 2 : 0
        const featureBonus = item.featured ? 1 : 0
        return { item, score: tagOverlap * 2 + complement + featureBonus }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item }) => item)

    return scored.length ? scored : recommendedProducts
  }, [featuredProducts, pairingPool, product, recommendedProducts])

  const smartPicks = useMemo(() => {
    const pool = pairingPool && pairingPool.length > 0 ? pairingPool : featuredProducts || []
    if (!pool.length) return recommendedProducts

    const interestTags = new Set<string>(product?.tags || [])
    const interestCategories = new Set<string>()
    const blockedSlugs = new Set<string>()

    if (product?.category) interestCategories.add(product.category)
    cartItems.forEach((item) => {
      blockedSlugs.add(item.product.slug)
      interestCategories.add(item.product.category)
      ;(item.product.tags || []).forEach((tag) => interestTags.add(tag))
    })

    pool
      .filter((item) => recentlyViewed.some((rv) => rv.slug === item.slug))
      .forEach((item) => {
        interestCategories.add(item.category)
        ;(item.tags || []).forEach((tag) => interestTags.add(tag))
      })

    const scored = pool
      .filter((item) => !blockedSlugs.has(item.slug) && item.slug !== product?.slug)
      .map((item) => {
        const tagHits = item.tags?.filter((tag) => interestTags.has(tag)).length || 0
        const categoryHit = interestCategories.has(item.category) ? 2 : 0
        return { item, score: tagHits * 2 + categoryHit + (item.featured ? 1 : 0) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item }) => item)

    return scored.length ? scored : recommendedProducts
  }, [cartItems, featuredProducts, pairingPool, product, recentlyViewed, recommendedProducts])

  useEffect(() => {
    const slugs = [...completeLookProducts, ...smartPicks].map((item) => `/products/${item.slug}`)
    slugs.forEach((slug) => router.prefetch(slug))
  }, [completeLookProducts, smartPicks, router])

  useEffect(() => {
    if (product) {
      addProduct(product)
    }
  }, [addProduct, product])

  useEffect(() => {
    // Reset to the first frame when switching products in place
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedImage(0)
  }, [product?.slug])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.floor(Math.random() * 6) - 2
        const next = Math.min(180, Math.max(18, prev + delta))
        return next
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!product) return
    const pool = [...(pairingPool || []), ...(featuredProducts || [])].filter(
      (item, idx, arr) =>
        item.slug !== product.slug && arr.findIndex((p) => p.slug === item.slug) === idx,
    )
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const interval = setInterval(() => {
      const target = pool[Math.floor(Math.random() * pool.length)] || product
      const purchaser = purchaseNames[Math.floor(Math.random() * purchaseNames.length)]
      setPurchaseSignal({ name: purchaser, item: target.name })
      timeoutId = setTimeout(() => setPurchaseSignal(null), 4200)
    }, 9000)

    return () => {
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [featuredProducts, pairingPool, product])

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
    return () => {
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return <ProductPageSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <EmptyState
            icon={ShoppingBag}
            title="Product unavailable"
            description={error || 'This piece could not be loaded right now. Try again or keep exploring the edit.'}
            actionLabel="Back to shop"
            actionHref="/shop"
          />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-sm text-brand-gold hover:text-brand-gold-light underline underline-offset-4 transition-colors"
            >
              Retry loading
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedSizeData = product.sizes?.find((s) => s.label === selectedSize)
  const lowStockCount = selectedSizeData?.stockCount ?? product.stockCount
  const isLowStock = lowStockCount !== undefined && lowStockCount > 0 && lowStockCount <= 3

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <AnimatePresence>
        {immersiveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setImmersiveOpen(false)}
              className="absolute top-6 right-6 z-50 inline-flex items-center gap-2 text-brand-gray-200 hover:text-brand-white"
            >
              <X size={18} />
              Close
            </button>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-4">
              <motion.div
                key={selectedImage}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) {
                    handleNextImage()
                  } else if (info.offset.x > 60) {
                    handlePrevImage()
                  }
                }}
                className="relative w-full max-w-6xl aspect-[4/5] rounded-2xl overflow-hidden border border-brand-border/60 bg-brand-card shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
              >
                {productImages[selectedImage]?.url ? (
                  <Image
                    src={productImages[selectedImage].url}
                    alt={productImages[selectedImage].alt || product.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-card to-brand-muted">
                    <span className="text-5xl font-display gold-text opacity-20 tracking-[0.3em]">
                      LUXE
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.3em] text-brand-gray-200 bg-brand-black/60 px-3 py-1.5 rounded-full">
                  Swipe to explore
                </div>
              </motion.div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {productImages.map((img, i) => (
                  <button
                    key={img.url + i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-16 aspect-[4/5] rounded-lg overflow-hidden border transition-all duration-200',
                      selectedImage === i
                        ? 'border-brand-gold shadow-[0_0_0_1px_rgba(201,168,76,0.4)]'
                        : 'border-brand-border/50 hover:border-brand-gold/60',
                    )}
                  >
                    {img.url ? (
                      <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-card flex items-center justify-center">
                        <span className="text-[9px] font-display gold-text opacity-30">LUXE</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div
              className="relative aspect-[4/5] rounded-xl overflow-hidden bg-brand-card group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                onClick={() => setImmersiveOpen(true)}
                className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] bg-brand-black/70 backdrop-blur-sm border border-brand-border/60 px-3 py-2 rounded-full text-brand-gray-200 hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <Maximize2 size={14} />
                Immersive
              </button>
              <ImageZoom zoomLevel={2.5} className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0.9, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    {productImages[selectedImage]?.url ? (
                      <Image
                        src={productImages[selectedImage].url}
                        alt={productImages[selectedImage].alt || product.name}
                        fill
                        priority={selectedImage === 0}
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-card via-brand-muted to-brand-darker flex items-center justify-center">
                        <span className="text-5xl font-display font-bold gold-text tracking-[0.3em] opacity-15 select-none">
                          LUXE
                        </span>
                      </div>
                    )}
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
                  Only {lowStockCount} left
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2.5">
                {productImages.map((img, i) => (
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
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.alt || product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-card to-brand-muted flex items-center justify-center">
                        <span className="text-[8px] font-display gold-text opacity-20 tracking-widest">LUXE</span>
                      </div>
                    )}
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

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {isNewDrop && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/30">
                    <Sparkles size={12} />
                    New Drop
                  </span>
                )}
                {isBestseller && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] bg-brand-white/10 text-brand-white px-3 py-1 rounded-full border border-brand-border/70">
                    <ShoppingBag size={12} />
                    Bestseller
                  </span>
                )}
                {product.tags?.includes('trending') && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] bg-brand-card/80 text-brand-gray-200 px-3 py-1 rounded-full border border-brand-border/70">
                    <Flame size={12} className="text-amber-300" />
                    Trending
                  </span>
                )}
                {isLowStock && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] bg-amber-500/15 text-amber-200 px-3 py-1 rounded-full border border-amber-500/40">
                    <Activity size={12} />
                    Only {lowStockCount} left
                  </span>
                )}
              </div>

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

              <div className="flex items-center gap-3 mt-3 text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                <Activity size={14} className="text-green-400" />
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-brand-gray-300">{liveViewers} people viewing now</span>
                {product.tags?.includes('hot') && (
                  <span className="inline-flex items-center gap-1 text-red-300">
                    <Flame size={14} />
                    Hot drop
                  </span>
                )}
                {product.tags?.includes('trending') && !product.tags?.includes('hot') && (
                  <span className="inline-flex items-center gap-1 text-brand-gold">
                    <Sparkles size={14} />
                    Trending
                  </span>
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
                      onClick={() =>
                        setSelection((prev) => ({
                          ...prev,
                          slug: product.slug,
                          color: color.name,
                        }))
                      }
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
                    onClick={() =>
                      size.available &&
                      setSelection((prev) => ({
                        ...prev,
                        slug: product.slug,
                        size: size.label,
                      }))
                    }
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
              {isLowStock && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-amber-300 mt-2.5 uppercase tracking-wide font-medium"
                >
                  ⚡ Only {lowStockCount} left{selectedSize ? ` in ${selectedSize}` : ''} — selling fast
                </motion.p>
              )}
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mt-2">
                <Flame size={14} />
                <span>Limited-time 10% off with code SAVE10 — ends tonight.</span>
              </div>
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
                <AnimatePresence>
                  {inWishlist && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.05 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 rounded-lg border border-brand-gold/40 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
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
            {completeLookProducts.map((item, i) => (
              <ProductCard key={item.id} product={item} priority={i < 2} />
            ))}
          </div>
        </div>

        {smartPicks.length > 0 && (
          <div className="mt-16 border-t border-brand-border/30 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
            >
              <div>
                <p className="section-overline">Tailored for you</p>
                <h3 className="text-display-xs font-display font-bold text-brand-white">
                  Based on your cart and browsing
                </h3>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-gray-500">
                Always updating live
              </span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {smartPicks.map((item, i) => (
                <ProductCard key={item.id} product={item} priority={i < 2} />
              ))}
            </div>
          </div>
        )}

        {recentsLoaded && recentlyViewed.length > 0 && (
          <div className="mt-16 border-t border-brand-border/30 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <p className="section-overline">Recently viewed</p>
                <h3 className="text-display-xs font-display font-bold text-brand-white">
                  Pick up where you left off
                </h3>
              </div>
              <Link href="/shop" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors hover-line">
                Explore more →
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {recentlyViewed.slice(0, 8).map((item) => (
                <Link
                  key={item.id}
                  prefetch
                  href={`/products/${item.slug}`}
                  className="group rounded-lg border border-brand-border/40 bg-brand-card/60 overflow-hidden transition-colors duration-300 hover:border-brand-gold/40"
                >
                  <div className="relative aspect-[4/5] bg-brand-dark">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-card to-brand-muted">
                        <span className="text-sm font-display gold-text opacity-20 tracking-[0.3em]">
                          LUXE
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium text-brand-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-brand-gray-500 uppercase tracking-[0.2em]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-brand-border/30 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="section-overline">Demo reviews</p>
              <h3 className="text-display-xs font-display font-bold text-brand-white">
                What the community is saying
              </h3>
              <p className="text-sm text-brand-gray-500 mt-1">
                Realistic-style reviews for sandbox mode — preview how social proof will look live.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-gray-300">
              <Star size={14} className="text-brand-gold" fill="currentColor" />
              4.9 / 5 · Trusted by enthusiasts
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoReviews.map((review) => (
              <div
                key={review.name}
                className="rounded-xl border border-brand-border/50 bg-brand-card/70 p-5 space-y-3 hover:border-brand-gold/35 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center text-sm font-semibold">
                      {review.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-brand-white font-medium text-sm">{review.name}</p>
                      <p className="text-xs text-brand-gray-500">{review.tag} · {review.ago}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={13} className="text-brand-gold" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-brand-white font-semibold text-sm">{review.title}</p>
                <p className="text-brand-gray-300 text-sm leading-relaxed">{review.text}</p>
                <div className="text-[11px] uppercase tracking-[0.3em] text-brand-gray-500">
                  Fit feedback · {review.rating}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {purchaseSignal && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-4 z-40 flex items-center gap-3 rounded-xl border border-brand-border/60 bg-brand-card/80 backdrop-blur-sm px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
          >
            <Sparkles size={16} className="text-brand-gold" />
            <div>
              <p className="text-sm text-brand-white font-medium">
                {purchaseSignal.name} just purchased {purchaseSignal.item}
              </p>
              <p className="text-xs text-brand-gray-500">Live social proof in demo mode</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
