'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Flame, Sparkles } from 'lucide-react'

interface LiveActivityTickerProps {
  anchor?: string
}

export default function LiveActivityTicker({ anchor = 'Worldwide' }: LiveActivityTickerProps) {
  const [index, setIndex] = useState(0)
  const events = useMemo(
    () => [
      { icon: <Flame size={14} />, message: '24 shoppers eyeing the Noir Capsule', meta: 'Trending', tone: 'text-amber-200' },
      { icon: <Sparkles size={14} />, message: 'New drop moving fast — sizes are going', meta: 'New', tone: 'text-brand-gold' },
      { icon: <Activity size={14} />, message: '7 checkouts in the last 10 minutes', meta: anchor, tone: 'text-green-200' },
    ],
    [anchor],
  )

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
