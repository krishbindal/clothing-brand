'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // TODO: integrate with actual newsletter service
    setSubmitted(true)
  }

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-card to-brand-darker border border-brand-border p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Exclusive Access</p>
            <h2 className="text-display-sm sm:text-display-md font-display font-bold text-brand-white mb-4">
              Enter the Inner Circle
            </h2>
            <p className="text-brand-gray-400 max-w-lg mx-auto mb-8 text-sm sm:text-base">
              Be the first to know about new drops, exclusive discounts, and behind-the-scenes access. No spam, just the dark stuff.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-6 py-3"
              >
                <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                <span className="text-brand-gold font-medium text-sm">You&apos;re in. Welcome to the circle.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input-dark flex-1 text-center sm:text-left"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Join the Drop
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
