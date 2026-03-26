'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const milestones = [
  { year: '2019', title: 'The Origin', note: 'LUXE launches with a single monochrome capsule collection.' },
  { year: '2022', title: 'Global Cult Following', note: 'Worn in 50+ countries by taste-makers, artists, and creators.' },
  { year: '2026', title: 'The Atelier Era', note: 'Limited drops engineered for precision, permanence, and presence.' },
]

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  const lineScale = useTransform(scrollYProgress, [0.15, 0.85], [0, 1])

  return (
    <section ref={ref} className="section-padding bg-brand-black overflow-hidden relative">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Visual */}
          <motion.div style={{ x }} className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-card to-brand-muted">
              {/* Abstract brand visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="w-56 h-56 border border-brand-gold/15 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-40 h-40 border border-brand-gold/10 rounded-full"
                />
                <div className="absolute w-20 h-20 bg-brand-gold/8 rounded-full blur-sm" />
                <span className="absolute text-6xl font-display font-bold gold-text tracking-[0.2em] select-none">
                  L
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/8 via-transparent to-brand-gold/4" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 -right-4 lg:-right-6 glass rounded-xl p-5 max-w-[210px] hover:border-brand-gold/30 transition-all duration-500"
            >
              <p className="text-3xl font-display font-bold gold-text">2019</p>
              <p className="text-sm text-brand-gray-400 mt-1 leading-relaxed">Founded in the heart of darkness</p>
            </motion.div>

            {/* Timeline */}
            <div className="relative mt-14 border border-brand-border rounded-xl bg-brand-dark/40 p-6 backdrop-blur-sm">
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-brand-gold/60 via-brand-gold/30 to-transparent origin-top"
              />
              <div className="space-y-6">
                {milestones.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pl-10 group"
                  >
                    <span className="absolute left-[14px] top-1.5 w-4 h-4 rounded-full border border-brand-gold/40 bg-brand-black group-hover:border-brand-gold group-hover:shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-all duration-500" />
                    <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold font-semibold">{item.year}</p>
                    <p className="text-brand-white text-sm leading-relaxed font-semibold mt-1">{item.title}</p>
                    <p className="text-brand-gray-500 text-xs leading-relaxed mt-1">{item.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-overline"
            >
              Our Story
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-display-md font-display font-bold text-brand-white leading-tight"
            >
              Born from the{' '}
              <span className="gold-text">Darkness</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5 text-brand-gray-400 leading-relaxed"
            >
              <p className="text-brand-gold/80 italic border-l-2 border-brand-gold/40 pl-5 text-[15px] leading-relaxed">
                &quot;Luxury is not volume. It&apos;s conviction, restraint, and detail that lasts.&quot;
              </p>
              <p className="text-[15px]">
                LUXE was born from a rebellion against the ordinary. We craft garments for those who
                understand that darkness isn&apos;t absence — it&apos;s presence. Every stitch is
                intentional, every silhouette deliberate.
              </p>
              <p className="text-[15px]">
                Our pieces are not just clothing. They are artifacts of an aesthetic philosophy — the
                intersection of luxury, function, and quiet power.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 gap-8 py-8 border-t border-b border-brand-border/60"
            >
              {[
                { value: '100%', label: 'Premium Materials' },
                { value: 'Ethical', label: 'Sourcing' },
                { value: 'Limited', label: 'Editions' },
              ].map((item) => (
                <div key={item.label} className="group">
                  <div className="text-lg font-display font-bold gold-text group-hover:scale-105 transition-transform duration-500 origin-left">
                    {item.value}
                  </div>
                  <div className="text-[10px] text-brand-gray-500 mt-1 uppercase tracking-[0.2em]">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link href="/about" className="btn-secondary inline-flex group gap-3">
                Read Our Story
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 ease-luxury group-hover:translate-x-2"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
