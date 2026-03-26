'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
  { name: 'Alex M.', rating: 5, text: "The quality is unlike anything I've owned. Pure luxury.", item: 'Void Hoodie' },
  { name: 'Jordan K.', rating: 5, text: 'Worth every penny. The fit is absolutely perfect.', item: 'Eclipse Jacket' },
  { name: 'Sam R.', rating: 5, text: "Finally a brand that takes darkness seriously. I'm hooked.", item: 'Shadow Cargo Pants' },
]

export default function SocialProof() {
  return (
    <section className="section-padding bg-brand-darker overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Reviews</p>
          <h2 className="text-display-md font-display font-bold text-brand-white">The Community Speaks</h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="text-brand-gold" fill="currentColor" />
            ))}
            <span className="ml-2 text-brand-gray-400 text-sm">4.9 / 5 from 2,400+ reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-dark p-6 hover:border-brand-gold/30 transition-colors duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-brand-gold" fill="currentColor" />
                ))}
              </div>
              <p className="text-brand-gray-300 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <span className="text-brand-white font-medium text-sm">{review.name}</span>
                <span className="text-brand-gray-600 text-xs">{review.item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
