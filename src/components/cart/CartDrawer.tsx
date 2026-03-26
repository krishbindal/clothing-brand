'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, RotateCcw } from 'lucide-react'
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

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()
  const shippingThreshold = 150
  const remaining = Math.max(0, shippingThreshold - subtotal)
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-brand-border/80 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-gradient-to-b from-brand-dark to-brand-dark/90">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-gold" />
                <h2 className="text-lg font-semibold tracking-wide">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-sm text-brand-gray-400">({items.length})</span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-brand-gray-600" />
                  <div>
                    <p className="text-brand-gray-400 font-medium">Your cart is empty</p>
                    <p className="text-brand-gray-600 text-sm mt-1">Add something to get started</p>
                  </div>
                  <button onClick={closeCart} className="btn-primary mt-4">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex gap-4 py-4 border-b border-brand-border/50 last:border-0"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-24 rounded overflow-hidden bg-brand-card flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-brand-muted" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-brand-white truncate">{item.product.name}</h3>
                        <p className="text-xs text-brand-gray-400 mt-0.5">
                          {item.size} · {item.color}
                        </p>
                        <p className="text-brand-gold font-semibold text-sm mt-1">
                          {formatPrice(item.product.price)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-brand-border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-brand-gray-400 hover:text-brand-white hover:scale-[1.05] transition-all duration-150 ease-out"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-brand-gray-400 hover:text-brand-white hover:scale-[1.05] transition-all duration-150 ease-out"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-brand-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-brand-border space-y-4">
                <div className="rounded-lg border border-brand-border bg-brand-black/70 p-3">
                  <div className="flex items-center justify-between text-xs text-brand-gray-400 mb-2">
                    <span>Free shipping progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-brand-gray-500 mt-2">
                    {remaining > 0
                      ? `Add ${formatPrice(remaining)} for complimentary express shipping`
                      : 'You unlocked complimentary express shipping!'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-500">Complete the look</p>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {CART_RECOMMENDATIONS.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={closeCart}
                        className="rounded-lg border border-brand-border bg-brand-card p-2.5 sm:p-3 hover:border-brand-gold/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-250 ease-out"
                      >
                        <div className="relative w-full h-16 rounded bg-brand-muted overflow-hidden">
                          {product.images[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-muted to-brand-dark" />
                          )}
                        </div>
                        <p className="text-xs text-brand-white mt-2 truncate">{product.name}</p>
                        <p className="text-xs text-brand-gold">{formatPrice(product.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-brand-gray-400">Subtotal</span>
                  <span className="text-brand-white font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-brand-gray-500">Shipping and taxes calculated at checkout</p>
                <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
                  Proceed to Checkout
                </Link>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-brand-gold" />
                    <span>Secure SSL checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw size={12} className="text-brand-gold" />
                    <span>30-day returns</span>
                  </div>
                </div>
                <button onClick={closeCart} className="btn-ghost w-full text-center text-sm">
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
