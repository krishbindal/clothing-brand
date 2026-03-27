'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'

const easeLuxury = [0.22, 1, 0.36, 1] as const

const dropItems = [
  { title: 'Obsidian Layer Jacket', meta: 'Limited 120', code: 'DROP·01' },
  { title: 'Shadowline Trench', meta: 'Stormweave Shell', code: 'DROP·02' },
  { title: 'Veil Knit Set', meta: 'Featherlight', code: 'DROP·03' },
  { title: 'Noir Utility Vest', meta: 'Modular', code: 'DROP·04' },
  { title: 'Glassline Blazer', meta: 'Structured Satin', code: 'DROP·05' },
  { title: 'Midnight Column Dress', meta: 'Cut on bias', code: 'DROP·06' },
]

const container = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
}

const card = {
  initial: { y: -200, opacity: 0, rotate: -4 },
  animate: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: easeLuxury },
  },
}

export default function DropIntro() {
  const [isActive, setIsActive] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf: number | null = null

    const markPlayed = (shouldActivate: boolean) => {
      raf = window.requestAnimationFrame(() => {
        if (shouldActivate) {
          setIsActive(true)
        }
        setHasPlayed(true)
      })
    }

    try {
      const seen = window.localStorage.getItem('hasSeenDropIntro')
      if (!seen) {
        window.localStorage.setItem('hasSeenDropIntro', 'true')
        markPlayed(true)
      } else {
        markPlayed(false)
      }
    } catch {
      markPlayed(true)
    }

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf)
      }
    }
  }, [])

  useEffect(() => {
    if (!isActive) return
    const timeout = window.setTimeout(() => setIsActive(false), 2400)
    return () => window.clearTimeout(timeout)
  }, [isActive])

  const featured = useMemo(() => dropItems.slice(0, 6), [])
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 600], [0, -70])
  const glowOpacity = useSpring(0.45, { stiffness: 80, damping: 18 })

  useEffect(() => {
    if (!hasPlayed) return
    glowOpacity.set(isActive ? 0 : 0.45)
  }, [glowOpacity, hasPlayed, isActive])

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)', transition: { duration: 0.7, ease: easeLuxury } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black via-brand-black/95 to-brand-black/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(201,168,76,0.08),transparent_40%),radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(201,168,76,0.06),transparent_40%)] blur-[90px]" />
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-soft-light" />
            <div className="absolute inset-0 backdrop-blur-[18px]" />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={{ opacity: 0.9, letterSpacing: '0.35em' }}
                transition={{ duration: 0.6, ease: easeLuxury }}
                className="text-xs uppercase tracking-[0.35em] text-brand-gold"
              >
                New collection · Limited drop
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easeLuxury, delay: 0.15 }}
                className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-brand-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
              >
                NEW COLLECTION DROPPED
              </motion.h1>

              <motion.div
                variants={container}
                initial="initial"
                animate="animate"
                className="mt-10 grid w-full max-w-4xl grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                {featured.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={card}
                    className="relative overflow-hidden rounded-lg border border-brand-border/50 bg-brand-card/70 px-4 py-6 backdrop-blur-2xl shadow-card-hover"
                    style={{ zIndex: 20 - index }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-brand-gold/10 opacity-60" />
                    <div className="absolute inset-0 bg-noise opacity-10" />
                    <div className="relative z-10 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-brand-gray-500">
                        <span>{item.code}</span>
                        <span className="text-brand-gold">{item.meta}</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-brand-white leading-tight">
                        {item.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] z-10 bg-gradient-to-b from-brand-gold/12 via-brand-gold/6 to-transparent blur-[120px]"
        style={{ y: parallaxY, opacity: hasPlayed ? glowOpacity : 0 }}
      />
    </>
  )
}
