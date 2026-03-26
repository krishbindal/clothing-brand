'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, RotateCcw, Truck, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'

const CART_RECOMMENDATIONS: Product[] = [
  {
    id: 'rec-1',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rec-2',
    name: 'Shadow Cargo Pants',
    slug: 'shadow-cargo-pants',
    description: 'Technical cargo with deep pockets.',
    price: 195,
    images: [{ url: '', alt: 'Shadow Cargo Pants', width: 800, height: 1000 }],
    category: 'bottoms',
    sizes: [{ label: 'S', available: true }, { label: 'M', available: true }],
    colors: [{ name: 'Black', hex: '#111111', available: true }],
    materials: ['Cotton'],
    inStock: true,
    tags: ['bestseller'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const FREE_SHIPPING_THRESHOLD = 150

interface CartLineItemProps {
  item: ReturnType<typeof useCart>['items'][number]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  highlight?: boolean
}

function CartLineItem({ item, onUpdateQuantity, onRemove, highlight = false }: CartLineItemProps) {
  const handleDecrease = () => {
    const nextQty = Math.max(1, item.quantity - 1)
    onUpdateQuantity(item.id, nextQty)
  }

  const handleIncrease = () => {
    const nextQty = item.quantity + 1
    onUpdateQuantity(item.id, nextQty)
  }

  return (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: highlight ? 'rgba(201,168,76,0.06)' : 'transparent',
      }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 py-4 border-b border-brand-border/30 last:border-0 group rounded-md px-1"
    >
      <div className="relative w-20 h-[100px] rounded-lg overflow-hidden bg-brand-card flex-shrink-0">
        {item.product.images?.[0]?.url ? (
          <Image
            src={item.product.images[0].url}
            alt={item.product.images[0].alt || item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-card to-brand-muted flex items-center justify-center">
            <span className="text-xs font-display gold-text opacity-30 tracking-widest">LUXE</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-brand-white truncate">{item.product.name}</h3>
        <p className="text-xs text-brand-gray-500 mt-0.5">
          {item.size} · {item.color}
        </p>
        <p className="text-brand-gold font-semibold text-sm mt-1.5">
          {formatPrice(item.product.price * item.quantity)}
        </p>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center border border-brand-border/60 rounded-md overflow-hidden">
            <button
              onClick={handleDecrease}
              className="p-1.5 text-brand-gray-400 hover:text-brand-white hover:bg-brand-card transition-all duration-200"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs w-7 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-1.5 text-brand-gray-400 hover:text-brand-white hover:bg-brand-card transition-all duration-200"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-brand-gray-600 hover:text-red-400 transition-colors duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Remove item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CartEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center">
        <ShoppingBag size={24} className="text-brand-gray-600" />
      </div>
      <div>
        <p className="text-brand-gray-300 font-medium">Your cart is empty</p>
        <p className="text-brand-gray-600 text-sm mt-1">Add something to get started</p>
      </div>
      <button onClick={onClose} className="btn-primary mt-2">
        Continue Shopping
      </button>
    </div>
  )
}

function CartRecommendations({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gray-500 font-semibold">
        Complete the look
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {CART_RECOMMENDATIONS.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="rounded-lg border border-brand-border/40 bg-brand-card/60 p-2.5 hover:border-brand-gold/40 transition-all duration-400 group/rec"
          >
            <div className="relative w-full h-14 rounded bg-gradient-to-br from-brand-muted to-brand-dark overflow-hidden flex items-center justify-center">
              {product.images[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-[10px] font-display gold-text opacity-20 tracking-widest">
                  LUXE
                </span>
              )}
            </div>
            <p className="text-xs text-brand-white mt-2 truncate group-hover/rec:text-brand-gold transition-colors duration-300">
              {product.name}
            </p>
            <p className="text-xs text-brand-gold/80 font-medium">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const freeShipping = remaining <= 0
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousIdsRef = useRef<string[]>([])

  const estimatedDelivery = useMemo(() => {
    const format = (offset: number) => {
      const date = new Date()
      date.setDate(date.getDate() + offset)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return `${format(3)} - ${format(6)}`
  }, [])

  useEffect(() => {
    const prevIds = previousIdsRef.current
    const newItem = items.find((item) => !prevIds.includes(item.id))
    if (newItem) {
      setJustAddedId(newItem.id)
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
      highlightTimeoutRef.current = setTimeout(() => setJustAddedId(null), 1800)
    }
    previousIdsRef.current = items.map((item) => item.id)
  }, [items])

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    },
    []
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-brand-border/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/50">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-brand-gold" />
                <h2 className="text-base font-semibold tracking-wide">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs text-brand-gray-500 bg-brand-card px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors duration-300 hover:bg-brand-card rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shipping progress — moved to top for visibility */}
            {items.length > 0 && (
              <div className="px-6 py-3 border-b border-brand-border/30 bg-brand-black/30">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={13} className={freeShipping ? 'text-brand-gold' : 'text-brand-gray-500'} />
                  <p className="text-xs text-brand-gray-400">
                    {freeShipping
                      ? '✓ Free express shipping unlocked!'
                      : `Add ${formatPrice(remaining)} for free shipping`}
                  </p>
                </div>
                <div className="w-full h-1 bg-brand-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {justAddedId && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold"
                >
                  <Check size={14} />
                  Added to your cart
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
              {items.length === 0 ? (
                <CartEmptyState onClose={closeCart} />
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      highlight={justAddedId === item.id}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-brand-border/50 space-y-4 bg-gradient-to-t from-brand-dark to-brand-dark/80">
                <CartRecommendations onClose={closeCart} />

                {/* Subtotal */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-brand-gray-400 text-sm">Subtotal</span>
                  <span className="text-brand-white font-semibold text-lg">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-brand-gray-400">
                  <span>Estimated delivery</span>
                  <span className="text-brand-white">{estimatedDelivery}</span>
                </div>
                <p className="text-[11px] text-brand-gray-600">
                  Shipping and taxes calculated at checkout
                </p>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center justify-center"
                >
                  Proceed to Checkout
                </Link>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-brand-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-brand-gold/70" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw size={12} className="text-brand-gold/70" />
                    <span>30-day Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-brand-gold/70" />
                    <span>Fast Shipping</span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="btn-ghost w-full text-center text-xs"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
