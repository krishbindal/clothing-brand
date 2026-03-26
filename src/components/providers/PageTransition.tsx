'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const overlayVariants: Variants = {
  hidden: { scaleX: 0, originX: 0, opacity: 0.1 },
  enter: {
    scaleX: 1,
    originX: 0,
    opacity: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { scaleX: 0, originX: 1, opacity: 0, transition: { duration: 0.35 } },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="relative"
      >
        <motion.div
          variants={overlayVariants}
          className="pointer-events-none fixed inset-0 z-30 bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent"
        />
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
