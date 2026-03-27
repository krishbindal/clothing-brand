'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="min-h-screen will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
