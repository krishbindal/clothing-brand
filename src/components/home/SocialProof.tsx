'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Alex M.',
    rating: 5,
    text: "The quality is unlike anything I've owned. Every detail screams craftsmanship. Pure luxury.",
    item: 'Void Hoodie',
    avatar: 'A',
  },
  {
    name: 'Jordan K.',
    rating: 5,
    text: 'Worth every penny. The fit is absolutely perfect — oversized without being sloppy.',
    item: 'Eclipse Jacket',
    avatar: 'J',
  },
  {
    name: 'Sam R.',
    rating: 5,
    text: "Finally a brand that takes darkness seriously. The fabric weight, the cut — I'm hooked.",
    item: 'Shadow Cargo Pants',
    avatar: 'S',
  },
]

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  return (
    <section ref={containerRef} className="section-padding bg-brand-darker overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="section-overline">Reviews</p>
          <h2 className="section-title">The Community Speaks</h2>
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="text-brand-gold" fill="currentColor" />
            ))}
            <span className="ml-3 text-brand-gray-400 text-sm">
              4.9 / 5 from 2,400+ reviews
            </span>
          </div>
        </motion.div>

        <motion.div style={{ x }} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-brand-card border border-brand-border rounded-xl p-7 hover:border-brand-gold/25 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
            >
              {/* Quote icon */}
              <Quote
                size={28}
                className="text-brand-gold/15 absolute top-6 right-6 group-hover:text-brand-gold/25 transition-colors duration-500"
              />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-brand-gold" fill="currentColor" />
                ))}
              </div>

              <p className="text-brand-gray-200 text-[15px] leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-brand-border/50">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center text-brand-gold text-xs font-bold">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <span className="text-brand-white font-medium text-sm block">{review.name}</span>
                  <span className="text-brand-gray-600 text-xs">Verified · {review.item}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
