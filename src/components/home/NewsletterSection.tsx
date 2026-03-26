'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
      setEmail('')
    } catch {
      setError('Unable to subscribe right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-brand-border/50 p-10 sm:p-14 lg:p-20 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(22,22,22,0.9) 0%, rgba(13,13,13,0.95) 100%)',
          }}
        >
          {/* Layered glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-gold/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-brand-gold/4 rounded-full blur-[80px] pointer-events-none" />

          {/* Decorative corners */}
          <div className="absolute top-5 left-5 w-12 h-12 border-t border-l border-brand-gold/15" />
          <div className="absolute bottom-5 right-5 w-12 h-12 border-b border-r border-brand-gold/15" />

          <div className="relative z-10">
            <p className="section-overline">Exclusive Access</p>
            <h2 className="text-display-sm sm:text-display-md font-display font-bold text-brand-white mb-5">
              Enter the Inner Circle
            </h2>
            <p className="text-brand-gray-400 max-w-md mx-auto mb-10 text-sm sm:text-[15px] leading-relaxed">
              Be the first to know about new drops, exclusive discounts, and
              behind-the-scenes access. No spam, just the dark stuff.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-3 glass-gold rounded-full px-7 py-4"
              >
                <CheckCircle size={18} className="text-brand-gold" />
                <span className="text-brand-gold font-medium text-sm">
                  You&apos;re in. Welcome to the circle.
                </span>
              </motion.div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input-dark flex-1 text-center sm:text-left"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                    className="btn-primary whitespace-nowrap disabled:opacity-60 group"
                  >
                    {isSubmitting ? (
                      'Joining...'
                    ) : (
                      <>
                        Join the Drop
                        <ArrowRight size={14} className="transition-transform duration-500 ease-luxury group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
                {error ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                ) : null}
                <p className="text-[11px] text-brand-gray-600 mt-4 tracking-wide">
                  By joining, you agree to receive marketing emails. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
