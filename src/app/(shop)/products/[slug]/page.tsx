'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, ChevronDown, Truck, RotateCcw, Shield, Star, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { cn } from '@/lib/utils'

// Sample product - in prod this would be fetched from Sanity/DB
const SAMPLE_PRODUCT: Product = {
  id: '3',
  name: 'Void Hoodie',
  slug: 'void-hoodie',
  description: 'The darkness you wear. Our signature Void Hoodie is crafted from a premium 80/20 cotton-polyester blend with a brushed ultra-soft fleece interior. Oversized silhouette with dropped shoulders, kangaroo pocket, and tonal LUXE branding.',
  price: 245,
  comparePrice: 295,
  images: [
    { url: '', alt: 'Void Hoodie Front', width: 800, height: 1000 },
    { url: '', alt: 'Void Hoodie Back', width: 800, height: 1000 },
    { url: '', alt: 'Void Hoodie Detail', width: 800, height: 1000 },
  ],
  category: 'tops',
  collection: 'Void Series',
  sizes: [
    { label: 'XS', available: false, stockCount: 0 },
    { label: 'S', available: true, stockCount: 3 },
    { label: 'M', available: true, stockCount: 8 },
    { label: 'L', available: true, stockCount: 12 },
    { label: 'XL', available: true, stockCount: 5 },
    { label: 'XXL', available: false, stockCount: 0 },
  ],
  colors: [
    { name: 'Void Black', hex: '#080808', available: true },
    { name: 'Charcoal', hex: '#2a2a2a', available: true },
  ],
  materials: ['80% Cotton', '20% Polyester', 'Brushed fleece interior'],
  inStock: true,
  stockCount: 28,
  tags: ['bestseller', 'new'],
  featured: true,
  rating: 4.9,
  reviewCount: 342,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

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

const RECOMMENDED_PRODUCTS: Product[] = [
  {
    id: 'rp-1',
    name: 'Shadow Cargo Pants',
    slug: 'shadow-cargo-pants',
    description: 'Technical cargo with deep pockets.',
    price: 195,
    images: [{ url: '', alt: 'Shadow Cargo Pants', width: 800, height: 1000 }],
    category: 'bottoms',
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }],
    colors: [{ name: 'Black', hex: '#0A0A0A', available: true }],
    materials: ['Cotton'],
    inStock: true,
    tags: ['bestseller'],
    featured: true,
    rating: 4.8,
    reviewCount: 216,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rp-2',
    name: 'Eclipse Jacket',
    slug: 'eclipse-jacket',
    description: 'Structured outerwear with gold hardware.',
    price: 425,
    images: [{ url: '', alt: 'Eclipse Jacket', width: 800, height: 1000 }],
    category: 'outerwear',
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }],
    colors: [{ name: 'Charcoal', hex: '#1a1a1a', available: true }],
    materials: ['Wool'],
    inStock: true,
    tags: ['limited'],
    featured: true,
    rating: 4.9,
    reviewCount: 142,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rp-3',
    name: 'Noir Long Sleeve',
    slug: 'noir-long-sleeve',
    description: 'Extended-length luxury longsleeve.',
    price: 115,
    images: [{ url: '', alt: 'Noir Long Sleeve', width: 800, height: 1000 }],
    category: 'tops',
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }],
    colors: [{ name: 'Black', hex: '#0A0A0A', available: true }],
    materials: ['Cotton'],
    inStock: true,
    tags: ['new'],
    featured: false,
    rating: 4.7,
    reviewCount: 91,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params for Next.js 15+
  const { slug } = use(params)
  void slug // used for future DB lookup; sample data is shown in dev

  const product = SAMPLE_PRODUCT
  if (!product) notFound()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem(product, quantity, selectedSize, selectedColor)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const selectedSizeData = product.sizes?.find((s) => s.label === selectedSize)
  const isLowStock = selectedSizeData && selectedSizeData.stockCount && selectedSizeData.stockCount <= 3

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brand-gray-500">
          <Link href="/" className="hover:text-brand-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-white transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-white transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-gray-300">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brand-card"
              layoutId={`product-${product.id}`}
            >
              {/* Placeholder gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-card via-brand-muted to-brand-darker flex items-center justify-center">
                <span className="text-4xl font-display font-bold gold-text tracking-widest opacity-20">
                  LUXE
                </span>
              </div>
              {isLowStock && (
                <div className="absolute top-4 left-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Only {selectedSizeData?.stockCount} left
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 aspect-[4/5] rounded-lg overflow-hidden bg-brand-card border-2 transition-all duration-200 ${
                      selectedImage === i ? 'border-brand-gold' : 'border-transparent hover:border-brand-gray-600'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-card to-brand-muted" />
                    <span className="sr-only">{img.alt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              {product.tags?.includes('bestseller') && (
                <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em]">Bestseller</span>
              )}
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-white mt-1">
                {product.name}
              </h1>
              {product.collection && (
                <p className="text-brand-gray-500 text-sm mt-1">{product.collection}</p>
              )}

              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-semibold text-brand-white">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-lg text-brand-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mt-3">
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
                  <span className="text-sm text-brand-gray-400">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

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
                        'w-8 h-8 rounded-full border-2 transition-all duration-200 relative',
                        selectedColor === color.name
                          ? 'border-brand-gold scale-110'
                          : 'border-transparent hover:border-brand-gray-400',
                        !color.available && 'opacity-40 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 rounded-full border-2 border-brand-black scale-75" />
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
                <Link href="/size-guide" className="text-xs text-brand-gold hover:text-brand-gold-light underline underline-offset-2">
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
                      'min-w-[3rem] h-12 px-3 border rounded-lg text-sm font-medium transition-all duration-150 relative',
                      selectedSize === size.label
                        ? 'bg-brand-gold border-brand-gold text-brand-black shadow-gold'
                        : size.available
                        ? 'border-brand-border text-brand-gray-300 hover:border-brand-gray-400 hover:text-brand-white'
                        : 'border-brand-border/30 text-brand-gray-700 cursor-not-allowed'
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
                <p className="text-xs text-brand-gray-600 mt-2">Please select a size to continue</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-brand-gray-400 hover:text-brand-white hover:bg-brand-muted transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-brand-gray-400 hover:text-brand-white hover:bg-brand-muted transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedSize || !product.inStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 h-12 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300',
                  !selectedSize || !product.inStock
                    ? 'bg-brand-muted text-brand-gray-600 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light hover:shadow-gold'
                )}
                whileTap={{ scale: selectedSize && product.inStock ? 0.98 : 1 }}
              >
                <ShoppingBag size={18} />
                {!product.inStock ? 'Out of Stock' : addedToCart ? 'Added!' : 'Add to Cart'}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'w-12 h-12 flex items-center justify-center border rounded-lg transition-all duration-200',
                  inWishlist
                    ? 'bg-brand-gold/10 border-brand-gold text-brand-gold'
                    : 'border-brand-border text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </motion.button>

              {/* Share */}
              <button className="w-12 h-12 flex items-center justify-center border border-brand-border rounded-lg text-brand-gray-400 hover:text-brand-white hover:border-brand-gray-400 transition-all duration-200">
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-brand-border">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Over $150' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30 days' },
                { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <Icon size={20} className="text-brand-gold mb-1" />
                  <span className="text-xs text-brand-white font-medium">{label}</span>
                  <span className="text-xs text-brand-gray-600">{sub}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-3">
              {accordionData.map((item) => (
                <div key={item.title} className="border border-brand-border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.title ? null : item.title)
                    }
                    className="w-full flex items-center justify-between px-4 py-4 text-sm font-medium text-brand-white hover:bg-brand-muted transition-colors"
                  >
                    {item.title}
                    <ChevronDown
                      size={16}
                      className={`text-brand-gray-500 transition-transform duration-200 ${
                        openAccordion === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.title && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-brand-gray-400 leading-relaxed">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-brand-border pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-brand-gold text-xs uppercase tracking-[0.3em]">Complete the Look</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-white mt-2">
                Curated to pair with {product.name}
              </h2>
            </div>
            <Link href="/shop" className="text-sm text-brand-gray-400 hover:text-brand-gold transition-colors">
              View full edit
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RECOMMENDED_PRODUCTS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dark p-4 hover:border-brand-gold/40 transition-colors"
              >
                <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-brand-card to-brand-muted flex items-center justify-center">
                  <span className="text-2xl font-display gold-text opacity-30">LUXE</span>
                </div>
                <p className="text-brand-white font-medium mt-4">{item.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-brand-gold font-semibold">{formatPrice(item.price)}</span>
                  <span className="text-xs text-brand-gray-500">
                    {item.rating} · {item.reviewCount} reviews
                  </span>
                </div>
                <Link href={`/products/${item.slug}`} className="btn-secondary w-full justify-center mt-4 py-2 text-xs">
                  View Piece
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
