'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { Product } from '@/types'
import type { SanityBanner } from '@/lib/sanity/types'
import { formatPrice } from '@/lib/utils'

const easeLuxury = [0.22, 1, 0.36, 1] as const
const DROP_LIMIT = 6
const MIN_RECENT_DAYS = 3
const MAX_RECENT_DAYS = 7

type DropIntroProps = {
  products?: Product[]
  banner?: SanityBanner | null
  collectionName?: string
}

function getDaysSince(date: string): number | null {
  const value = new Date(date).getTime()
  if (!Number.isFinite(value)) return null
  return (Date.now() - value) / (1000 * 60 * 60 * 24)
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((v) => v.toString().padStart(2, '0')).join(':')
}

const container = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
}

const card = {
  initial: (custom: { tilt: number; index: number }) => ({
    y: -240,
    opacity: 0,
    rotate: custom.tilt,
    scale: 0.95,
    boxShadow: '0 0 0 rgba(201,168,76,0)',
  }),
  animate: (custom: { tilt: number; index: number }) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    boxShadow: [
      '0 0 0 rgba(201,168,76,0)',
      '0 26px 80px rgba(201,168,76,0.35)',
      '0 18px 40px rgba(0,0,0,0.4)',
    ],
    transition: { duration: 0.95, ease: easeLuxury, delay: 0.25 + custom.index * 0.09 },
  }),
}

export default function DropIntro({ products, banner, collectionName }: DropIntroProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'drop' | 'done'>('idle')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [hasSkipped, setHasSkipped] = useState(false)

  const dropProducts = useMemo(() => (products || []).slice(0, DROP_LIMIT), [products])
  const decoratedProducts = useMemo(() => {
    return dropProducts.map((product, index) => {
      const ageDays = getDaysSince(product.createdAt)
      const isRecent = ageDays !== null && ageDays >= MIN_RECENT_DAYS && ageDays <= MAX_RECENT_DAYS
      const tag =
        product.tags?.includes('new') || isRecent
          ? 'New'
          : product.tags?.includes('trending') || product.featured
          ? 'Trending'
          : null
      const tilt = (index % 2 === 0 ? -1 : 1) * (3 + (index % 4))
      return { product, index, tag, tilt, ageDays, isRecent }
    })
  }, [dropProducts])

  const hasRecentProducts = decoratedProducts.some(({ isRecent }) => isRecent)
  const hasFeaturedBanner = Boolean(banner?.featured)
  const dropTimestamp = banner?.dropDate ? new Date(banner.dropDate).getTime() : null
  const isScheduledDrop = Boolean(banner?.isDropActive && dropTimestamp)
  const hasInventoryForDrop = dropProducts.length >= 3
  const shouldPlay =
    (isScheduledDrop && hasInventoryForDrop) || (!hasSkipped && hasInventoryForDrop && (hasRecentProducts || hasFeaturedBanner))
  const waitingViewers = useMemo(
    () => dropProducts.reduce((acc, item) => acc + (item.liveViewers ?? 0), 0) || 18,
    [dropProducts]
  )

  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 600], [0, -70])
  const glowOpacity = useSpring(0.45, { stiffness: 80, damping: 18 })

  useEffect(() => {
    glowOpacity.set(isOverlayVisible ? 0 : hasPlayed ? 0.45 : 0)
  }, [glowOpacity, hasPlayed, isOverlayVisible])

  useEffect(() => {
    if (isScheduledDrop || !shouldPlay || isOverlayVisible || phase !== 'idle') return

    if (typeof window === 'undefined') return

    const seen = window.localStorage.getItem('hasSeenDropIntro')
    const skipped = window.localStorage.getItem('skipDropIntro')
    let cleanup: (() => void) | undefined

    if (skipped) {
      const frame = window.requestAnimationFrame(() => {
        setHasSkipped(true)
        setHasPlayed(true)
      })
      cleanup = () => window.cancelAnimationFrame(frame)
    } else if (seen) {
      const frame = window.requestAnimationFrame(() => setHasPlayed(true))
      cleanup = () => window.cancelAnimationFrame(frame)
    } else {
      const raf = window.requestAnimationFrame(() => {
        setIsOverlayVisible(true)
        setPhase('countdown')
        setCountdown(3)
      })
      cleanup = () => window.cancelAnimationFrame(raf)
      try {
        window.localStorage.setItem('hasSeenDropIntro', 'true')
      } catch {
        // ignore storage errors
      }
    }

    return cleanup
  }, [isScheduledDrop, shouldPlay, isOverlayVisible, phase])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (shouldPlay || hasPlayed) return
    const frame = window.requestAnimationFrame(() => setHasPlayed(true))
    return () => window.cancelAnimationFrame(frame)
  }, [hasPlayed, shouldPlay])

  useEffect(() => {
    if (!isScheduledDrop || !dropTimestamp || !hasInventoryForDrop) return
    if (hasSkipped) return
    if (typeof window === 'undefined') return

    const tick = () => {
      const remaining = dropTimestamp - Date.now()
      setTimeLeftMs(remaining)
      if (remaining <= 0) {
        setPhase('drop')
        setHasPlayed(true)
        setIsOverlayVisible(true)
      } else {
        setIsOverlayVisible(true)
        setPhase('countdown')
      }
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [dropTimestamp, hasInventoryForDrop, hasSkipped, isScheduledDrop])

  useEffect(() => {
    if (isScheduledDrop || !isOverlayVisible || phase !== 'countdown' || countdown === null) return
    if (countdown <= 0) {
      const frame = window.requestAnimationFrame(() => {
        setPhase('drop')
        setCountdown(null)
        setHasPlayed(true)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    const timer = window.setTimeout(() => setCountdown((prev) => (prev ? prev - 1 : 0)), 900)
    return () => window.clearTimeout(timer)
  }, [countdown, isOverlayVisible, isScheduledDrop, phase])

  useEffect(() => {
    if (phase !== 'drop') return
    const timer = window.setTimeout(() => {
      setPhase('done')
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'done') return
    const timer = window.setTimeout(() => {
      setIsOverlayVisible(false)
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [phase])

  const handleSkip = () => {
    setHasSkipped(true)
    setIsOverlayVisible(false)
    setPhase('done')
    setCountdown(null)
    setTimeLeftMs(null)
    setHasPlayed(true)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('skipDropIntro', 'true')
      } catch {
        // ignore storage errors
      }
    }
  }

  const showShopCta = phase === 'drop' || phase === 'done'
  const overlayTitle = banner?.dropTitle || collectionName || banner?.title || 'New Collection Dropped'
  const overlayEyebrow = banner?.eyebrow || 'New collection · Limited drop'
  const overlaySubtitle =
    banner?.subtitle ||
    (isScheduledDrop
      ? 'Launching soon. Claim your slot before the atelier opens to the public.'
      : 'Precision-crafted silhouettes and live drops curated by the atelier. Watch the latest pieces land in real time.')
  const countdownLabel =
    isScheduledDrop && timeLeftMs !== null && timeLeftMs > 0
      ? formatCountdown(timeLeftMs)
      : countdown !== null
      ? `00:0${Math.max(0, countdown)}`
      : null

  return (
    <>
      <AnimatePresence>
        {isOverlayVisible && (
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

            <button
              type="button"
              onClick={handleSkip}
              className="absolute right-4 top-4 z-30 rounded-full border border-brand-border/60 bg-brand-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-brand-gray-300 hover:border-brand-gold/50 hover:text-brand-gold transition-colors"
            >
              Skip
            </button>

            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={{ opacity: 0.9, letterSpacing: '0.35em' }}
                transition={{ duration: 0.6, ease: easeLuxury }}
                className="text-xs uppercase tracking-[0.35em] text-brand-gold"
              >
                {overlayEyebrow}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easeLuxury, delay: 0.15 }}
                className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-brand-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
              >
                {overlayTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ duration: 0.8, ease: easeLuxury, delay: 0.25 }}
                className="mt-4 max-w-3xl text-sm sm:text-base text-brand-gray-300"
              >
                {overlaySubtitle}
              </motion.p>

              {countdownLabel && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: easeLuxury, delay: 0.35 }}
                  className="mt-6 rounded-2xl border border-brand-border/60 bg-brand-card/70 px-6 py-4 text-center shadow-card-hover"
                >
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Launching Soon</p>
                  <p className="mt-2 font-display text-3xl sm:text-4xl text-brand-white tracking-tight">
                    {countdownLabel}
                  </p>
                  <p className="mt-2 text-xs text-brand-gray-400">
                    {isScheduledDrop
                      ? `${waitingViewers}+ people waiting · ${dropProducts.length} looks ready`
                      : 'Runway warming up for the next drop'}
                  </p>
                </motion.div>
              )}

              <div className="relative mt-10 w-full max-w-5xl">
                <AnimatePresence>
                  {phase === 'drop' && (
                    <motion.div
                      className="pointer-events-none absolute inset-x-8 top-10 z-0 h-64 rounded-full bg-brand-gold/15 blur-[120px]"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.5, scale: 1.05 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1, ease: easeLuxury }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  variants={container}
                  initial="initial"
                  animate={phase === 'drop' ? 'animate' : 'initial'}
                  className="relative z-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
                >
                  {decoratedProducts.map(({ product, tag, tilt, index }) => {
                    const image = product.images?.[0]
                    const codeLabel = `DROP·0${index + 1}`
                    const badgeLabel = tag || (product.tags?.includes('trending') ? 'Trending' : 'New')
                    return (
                      <motion.div
                        key={product.id || product.slug || index}
                        variants={card}
                        custom={{ tilt, index }}
                        className="group relative overflow-hidden rounded-xl border border-brand-border/50 bg-brand-card/70 px-3 py-4 backdrop-blur-2xl shadow-card-hover"
                        style={{ zIndex: 20 - index }}
                        whileHover={{ rotate: tilt * 0.12, y: -8, scale: 1.015 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-brand-gold/10 opacity-60" />
                        <div className="absolute inset-0 bg-noise opacity-10" />

                        <div className="relative z-10 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-brand-gray-500">
                            <span>{codeLabel}</span>
                            <span className="text-brand-gold">{product.collection || 'Limited'}</span>
                          </div>

                          <div className="overflow-hidden rounded-lg border border-brand-border/60 bg-brand-black/60 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
                            <div
                              className="relative aspect-[3/4] w-full bg-gradient-to-b from-brand-black via-brand-black/80 to-brand-black/90"
                              style={
                                image?.url
                                  ? {
                                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.35)), url(${image.url})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                    }
                                  : undefined
                              }
                            >
                              {!image?.url && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-brand-gray-500">
                                  Imagery incoming
                                </div>
                              )}
                              {tag && (
                                <span className="absolute left-3 top-3 rounded-full bg-brand-gold/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                                  {tag}
                                </span>
                              )}
                              {phase === 'drop' && (
                                <motion.div
                                  className="absolute inset-x-6 bottom-4 h-12 rounded-full bg-brand-gold/20 blur-2xl"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 0.7, scale: 1 }}
                                  transition={{ duration: 0.8, ease: easeLuxury, delay: 0.2 }}
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div className="text-left space-y-1">
                              <p className="text-sm sm:text-base md:text-lg font-semibold text-brand-white leading-tight line-clamp-2">
                                {product.name}
                              </p>
                              {Number.isFinite(product.price) && product.price > 0 && (
                                <p className="text-xs text-brand-gray-300">{formatPrice(product.price)}</p>
                              )}
                            </div>
                            <span className="rounded-full border border-brand-border/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-gray-400">
                              {badgeLabel}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>

              {showShopCta && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: easeLuxury, delay: 0.25 }}
                  className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
                >
                  <Link
                    href="/shop"
                    onClick={handleSkip}
                    className="inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-black shadow-[0_12px_40px_rgba(201,168,76,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(201,168,76,0.4)]"
                  >
                    Shop Now
                  </Link>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="rounded-full border border-brand-border/70 bg-brand-card/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-brand-gray-200 transition hover:border-brand-gold/50 hover:text-brand-gold"
                  >
                    Skip animation
                  </button>
                </motion.div>
              )}
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
