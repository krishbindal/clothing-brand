'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PremiumLoader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem('luxe_loader_seen')
  })

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => {
      setVisible(false)
      try {
        window.localStorage.setItem('luxe_loader_seen', 'true')
      } catch {
        // ignore storage issues
      }
    }, 2300)
    return () => window.clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[12000] flex items-center justify-center bg-gradient-to-br from-black via-brand-black to-brand-darker"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              className="text-5xl sm:text-6xl font-display tracking-[0.4em] text-brand-white"
              animate={{ letterSpacing: ['0.2em', '0.5em', '0.3em'], opacity: [0.4, 1, 0.85] }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            >
              LUXE
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent blur-[40px]"
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -inset-6 rounded-full border border-brand-gold/20"
              animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.95, 1.05, 0.98] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
