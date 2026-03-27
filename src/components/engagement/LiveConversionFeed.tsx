'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, ShoppingBag, Sparkles } from 'lucide-react'
import { useProducts } from '@/hooks'
import type { Product } from '@/types'
import { demoProducts } from '@/lib/demoContent'
import { formatPrice } from '@/lib/utils'

const NAMES = ['Aria', 'Noah', 'Mila', 'Kian', 'Sarai', 'Luca', 'Nyx', 'Leo', 'Iman', 'Rhea', 'Someone']
const CITIES = ['Delhi', 'Paris', 'Copenhagen', 'New York', 'London', 'Seoul', 'Tokyo', 'Berlin', 'Toronto']
const ACTIONS = ['bought', 'secured the drop', 'checked out']

interface Signal {
  name: string
  city: string
  product: Product
  action: string
  viewers: number
  groupCount?: number
}

export default function LiveConversionFeed() {
  const { products } = useProducts({ limit: 24 })
  const pool = useMemo(() => (products && products.length ? products : demoProducts), [products])
  const [signal, setSignal] = useState<Signal | null>(null)
  const dismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCartSignal = signal ? Boolean(signal.groupCount || signal.action.includes('cart')) : false
  const isDropSignal = signal
    ? Boolean(
        signal.action.includes('drop') ||
          signal.action.includes('bought') ||
          signal.action.includes('checked out'),
      )
    : false
  const headline = signal
    ? signal.groupCount
      ? `${signal.groupCount} people in ${signal.city} added ${signal.product.name} to cart`
      : `${signal.name} in ${signal.city} ${signal.action} ${signal.product.name}`
    : ''

  useEffect(() => {
    if (!pool.length) return

    const emit = () => {
      const product = pool[Math.floor(Math.random() * pool.length)]
      if (!product) return
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
      const isGroup = Math.random() < 0.35
      const groupCount = 3 + Math.floor(Math.random() * 8)
      const viewers = 8 + Math.floor(Math.random() * 18)
      setSignal({
        name: isGroup ? 'Someone' : name,
        city,
        product,
        action: isGroup ? 'added to cart' : action,
        viewers,
        groupCount: isGroup ? groupCount : undefined,
      })
      if (dismissTimeout.current) clearTimeout(dismissTimeout.current)
      dismissTimeout.current = setTimeout(() => setSignal(null), 4600)
    }

    emit()
    const id = setInterval(emit, 9000)
    return () => {
      clearInterval(id)
      if (dismissTimeout.current) clearTimeout(dismissTimeout.current)
    }
  }, [pool])

  return (
    <AnimatePresence>
      {signal && (
        <motion.div
          key={signal.product.id}
          initial={{ opacity: 0, y: 24, x: 24 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-4 sm:right-8 z-40"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-brand-border/50 bg-brand-card/80 backdrop-blur-xl px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] min-w-[260px]">
            <div className="p-2 rounded-full bg-brand-gold/15 border border-brand-gold/30">
              {isCartSignal ? (
                <ShoppingBag size={16} className="text-brand-gold" />
              ) : isDropSignal ? (
                <Sparkles size={16} className="text-brand-gold" />
              ) : (
                <Flame size={16} className="text-amber-300" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-brand-white font-semibold">{headline}</p>
              <p className="text-xs text-brand-gray-400">
                {formatPrice(signal.product.price)} · {signal.city}
              </p>
              <div className="text-[11px] uppercase tracking-[0.3em] text-brand-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {signal.viewers} people viewing now · Hype rising
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
