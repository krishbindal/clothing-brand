'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Clock3, Flame } from 'lucide-react'

const activityMessages = [
  'Just now: Capsule added to cart',
  'Viewing: Limited Atelier Jacket',
  '3 left in stock: Midnight Puffer',
  'New drop alert: Shadowline Collection',
  'Trending: Layered knit set',
]

export default function LiveActivityTicker() {
  const [count, setCount] = useState(() => 120 + Math.floor(Math.random() * 40))
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const countInterval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1
        const next = prev + delta
        return Math.min(Math.max(next, 90), 180)
      })
    }, 2600)

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % activityMessages.length)
    }, 4000)

    return () => {
      clearInterval(countInterval)
      clearInterval(messageInterval)
    }
  }, [])

  const currentMessage = useMemo(() => activityMessages[messageIndex], [messageIndex])

  return (
    <div className="border-y border-brand-border/30 bg-brand-darker/70 backdrop-blur-md">
      <div className="container-wide py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-brand-gray-200">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gray-400">Live right now</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-brand-border/40 bg-brand-card/60">
            <Activity size={14} className="text-brand-gold" />
            <span className="text-sm font-medium text-brand-white">{count} people browsing</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-brand-border/40 bg-brand-card/60">
            <Clock3 size={14} className="text-brand-gray-300" />
            <span className="text-xs uppercase tracking-[0.25em] text-brand-gray-300">
              {currentMessage}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-brand-border/40 bg-brand-card/60">
            <Flame size={14} className="text-red-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-red-200">Moving fast</span>
          </div>
        </div>
      </div>
    </div>
  )
}
