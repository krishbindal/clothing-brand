'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Flame, Sparkles } from 'lucide-react'
import { liveCities, luxeActivityHeadlines } from '@/lib/liveSignals'
import { Product } from '@/types'

interface LiveActivityTickerProps {
  anchor?: string
  products?: Product[]
}

export default function LiveActivityTicker({ anchor = 'Worldwide', products = [] }: LiveActivityTickerProps) {
  const [index, setIndex] = useState(0)
  const [livePurchase, setLivePurchase] = useState('Someone from Delhi just joined early access')
  const productNames = useMemo(() => {
    if (products.length) return products.map((product) => product.name)
    return ['a limited silhouette', 'the next drop', 'a bespoke piece', 'the atelier queue']
  }, [products])
  const metrics = useMemo(() => {
    if (!products.length) return { viewers: 128, sold: 18 }
    const viewers = products.reduce((acc, product) => acc + (product.liveViewers ?? 0), 0) || 12
    const sold =
      products.reduce(
        (acc, product) =>
          acc + (product.salesVelocity ?? Math.max(1, Math.round(((product.soldCount ?? 50) || 50) / 60))),
        0,
      ) || 5
    return { viewers, sold }
  }, [products])

  useEffect(() => {
    const updatePurchase = () => {
      const city = liveCities[Math.floor(Math.random() * liveCities.length)]
      const item = productNames[Math.floor(Math.random() * productNames.length)]
      setLivePurchase(`Someone from ${city} just locked ${item}`)
    }

    updatePurchase()
    const interval = setInterval(updatePurchase, 6400)
    return () => clearInterval(interval)
  }, [productNames])

  const events = useMemo(() => {
    const headlined = luxeActivityHeadlines.map((headline) => ({
      icon: <Sparkles size={14} />,
      message: `${headline.emoji} ${headline.message}`,
      meta: headline.context,
      tone: 'text-brand-gold',
    }))

    return [
      { icon: <Flame size={14} />, message: `🔥 ${metrics.viewers} people browsing`, meta: 'High demand', tone: 'text-amber-200' },
      { icon: <Activity size={14} />, message: `${metrics.sold} checkouts in the last hour`, meta: anchor, tone: 'text-green-200' },
      { icon: <Sparkles size={14} />, message: livePurchase, meta: 'Drop radar', tone: 'text-brand-gold' },
      ...headlined,
    ]
  }, [anchor, livePurchase, metrics.sold, metrics.viewers])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length)
    }, 3600)
    return () => clearInterval(interval)
  }, [events.length])

  return (
    <div className="w-full bg-brand-darker/80 border-y border-brand-border/30 backdrop-blur-sm">
      <div className="container-wide py-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-brand-gray-300">
        <div className="flex items-center gap-2 rounded-full border border-brand-border/40 px-3 py-1 bg-brand-card/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300" />
          </span>
          Live
        </div>

        <div className="h-4 w-px bg-brand-border/40" />

        <div className="relative h-5 overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={events[index].message}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className={`flex items-center gap-1 ${events[index].tone}`}>
                {events[index].icon}
                {events[index].meta}
              </span>
              <span className="text-brand-gray-300 tracking-[0.2em]">{events[index].message}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
