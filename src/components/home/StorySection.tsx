'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section ref={ref} className="section-padding bg-brand-black overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <motion.div style={{ x }} className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-card to-brand-muted">
              {/* Abstract brand visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-brand-gold/30 rounded-full" />
                <div className="absolute w-32 h-32 border border-brand-gold/20 rounded-full" />
                <div className="absolute w-16 h-16 bg-brand-gold/10 rounded-full" />
                <span className="absolute text-5xl font-display font-bold gold-text tracking-widest">L</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-brand-card border border-brand-border rounded-xl p-5 max-w-[200px]"
            >
              <p className="text-3xl font-display font-bold gold-text">2019</p>
              <p className="text-sm text-brand-gray-400 mt-1">Founded in the heart of darkness</p>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em]"
            >
              Our Story
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-display-md font-display font-bold text-brand-white leading-tight"
            >
              Born from the{' '}
              <span className="gold-text">Darkness</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-brand-gray-400 leading-relaxed"
            >
              <p>
                LUXE was born from a rebellion against the ordinary. We craft garments for those who understand that darkness isn&apos;t absence — it&apos;s presence. Every stitch is intentional, every silhouette deliberate.
              </p>
              <p>
                Our pieces are not just clothing. They are artifacts of an aesthetic philosophy — the intersection of luxury, function, and quiet power.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-6 py-6 border-t border-b border-brand-border"
            >
              {[
                { value: '100%', label: 'Premium Materials' },
                { value: 'Ethical', label: 'Sourcing' },
                { value: 'Limited', label: 'Editions' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-lg font-display font-bold gold-text">{item.value}</div>
                  <div className="text-xs text-brand-gray-500 mt-0.5 uppercase tracking-wide">{item.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/about" className="btn-secondary inline-flex">
                Read Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
