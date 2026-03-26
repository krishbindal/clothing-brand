'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const overlayY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-brand-black"
    >
      {/* Video Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {/* Video element — autoplay muted loop */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster=""
        >
          {/* In production, replace with actual fashion video:
              <source src="/videos/hero.mp4" type="video/mp4" />
              For now, the fallback gradients create the cinematic look */}
        </video>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/5 via-brand-black/50 to-brand-black z-10" />
        <div className="absolute inset-0 bg-noise opacity-30 z-10" />

        {/* Cinematic gold orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(232,201,122,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_70%,rgba(201,168,76,0.06),transparent_35%)]" />

        {/* Central glow orb */}
        <motion.div
          style={{ y: overlayY }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/8 rounded-full blur-[180px]"
        />

        {/* Animated concentric rings */}
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-brand-gold/10"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1.02, 1, 1.02] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-brand-gold/5"
        />

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-gold/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Cinematic light sweeps */}
        <motion.div
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          className="absolute top-0 left-0 w-[200px] h-full bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent skew-x-[-20deg]"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Overline badge */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.3, ease: EASE_LUXURY }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 text-brand-gold text-[11px] font-semibold uppercase tracking-[0.45em] px-5 py-2.5 rounded-full border border-brand-gold/20 bg-brand-gold/5 backdrop-blur-sm">
            <Sparkles size={12} className="animate-breathe" />
            New Collection · SS25
          </span>
        </motion.div>

        {/* Main headline — staggered reveal */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-[clamp(3.5rem,12vw,9rem)] font-display font-bold leading-[0.85] tracking-tighter"
          >
            {['WEAR', 'THE', 'FUTURE'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: '120%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.5 + i * 0.15,
                  ease: EASE_LUXURY,
                }}
                className={`block ${i === 1 ? 'gold-text' : 'text-brand-white'}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE_LUXURY }}
          className="text-brand-gray-300 text-base sm:text-lg max-w-xl mx-auto mt-8 leading-relaxed font-light"
        >
          Precision-crafted silhouettes, deep tonal textures, and limited drops
          designed for those who lead with quiet force.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: EASE_LUXURY }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link href="/shop" className="btn-primary group min-w-[220px]">
            Shop the Drop
            <ArrowRight
              size={15}
              className="transition-transform duration-500 ease-luxury group-hover:translate-x-2"
            />
          </Link>
          <Link href="/collections" className="btn-secondary min-w-[220px]">
            Discover the Atelier
          </Link>
        </motion.div>

        {/* Stats — refined cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8, ease: EASE_LUXURY }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-16"
        >
          {[
            { value: '10K+', label: 'Customers' },
            { value: '200+', label: 'Pieces' },
            { value: '50+', label: 'Countries' },
            { value: '48h', label: 'Avg. Sellout' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 + i * 0.1, ease: EASE_LUXURY }}
              className="text-center min-w-[110px] sm:min-w-[130px] rounded-lg border border-brand-border/60 bg-brand-dark/40 px-5 py-3.5 backdrop-blur-md hover:border-brand-gold/30 hover:bg-brand-dark/60 transition-all duration-500 group"
            >
              <div className="text-2xl sm:text-3xl font-display font-bold gold-text tracking-tight group-hover:scale-105 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="text-[10px] text-brand-gray-500 uppercase tracking-[0.2em] mt-1.5">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] text-brand-gray-600 uppercase tracking-[0.4em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-brand-border/50 flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowDown size={14} className="text-brand-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
