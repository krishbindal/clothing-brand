'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const overlayY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.1])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black"
    >
      {/* Background Elements */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/10 via-brand-black/60 to-brand-black z-10" />
        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-35 z-10" />
        {/* Large background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,168,76,0.2),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,201,122,0.14),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_75%,rgba(201,168,76,0.08),transparent_30%)]" />
        <motion.div
          style={{ y: overlayY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-brand-gold/10 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[420px] h-[220px] rounded-full border border-brand-gold/20"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y: contentY }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-6 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/5"
        >
          <Sparkles size={12} />
          New Collection · SS25
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(3rem,10vw,8rem)] font-display font-bold leading-none tracking-tight"
        >
          <span className="block text-brand-white">WEAR</span>
          <span className="block gold-text">THE</span>
          <span className="block text-brand-white">FUTURE</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-brand-gray-300 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Precision-crafted silhouettes, deep tonal textures, and limited drops designed for those who lead with quiet force.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/shop" className="btn-primary group min-w-[220px]">
            Shop the Drop
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link href="/collections" className="btn-secondary min-w-[220px]">
            Discover the Atelier
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-14"
        >
          {[
            { value: '10K+', label: 'Customers' },
            { value: '200+', label: 'Pieces' },
            { value: '50+', label: 'Countries' },
            { value: '48h', label: 'Avg. Sellout' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center min-w-[110px] rounded-lg border border-brand-border bg-brand-dark/60 px-4 py-3 backdrop-blur-sm"
            >
              <div className="text-2xl sm:text-3xl font-display font-bold gold-text tracking-tight">{stat.value}</div>
              <div className="text-xs text-brand-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brand-gray-500 uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="p-2 rounded-full border border-brand-border bg-brand-dark/60"
        >
          <ArrowDown size={16} className="text-brand-gold/80" />
        </motion.div>
      </motion.div>
    </section>
  )
}
