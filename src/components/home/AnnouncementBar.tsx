'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const announcements = [
  'Free shipping on orders over $150 · Use code LUXE10 for 10% off',
  'New SS25 Collection dropping weekly · Sign up for early access',
  'Limited edition drops sell out fast · Join the waitlist today',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-black relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto py-2.5 px-4">
            <div className="flex-1 overflow-hidden text-center mask-edges">
              <div className="animate-ticker inline-flex whitespace-nowrap">
                {[...announcements, ...announcements].map((msg, i) => (
                  <span
                    key={i}
                    className="mx-12 text-[11px] font-semibold uppercase tracking-[0.15em]"
                  >
                    {msg}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 p-1 opacity-60 hover:opacity-100 transition-opacity duration-300"
              aria-label="Dismiss announcement"
            >
              <X size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
