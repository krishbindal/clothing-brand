'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type CursorState = {
  x: number
  y: number
}

export default function GoldenCursor() {
  const [pos, setPos] = useState<CursorState>({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    document.body.classList.add('luxe-cursor')

    const handleMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY })
    }

    const handleEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const dataLabel = target.dataset.cursor || target.dataset.cursorText
      if (dataLabel) {
        setLabel(dataLabel.toUpperCase())
        setActive(true)
        return
      }
      if (target.closest('a, button')) {
        setLabel('OPEN')
        setActive(true)
      }
    }

    const handleLeave = () => {
      setActive(false)
      setLabel(null)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleEnter)
    document.addEventListener('mouseout', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout', handleLeave)
      document.body.classList.remove('luxe-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed z-[11000] h-2 w-2 rounded-full bg-brand-gold pointer-events-none mix-blend-screen"
        animate={{ x: pos.x - 1, y: pos.y - 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.5 }}
      />
      <motion.div
        aria-hidden
        className="fixed z-[10999] pointer-events-none flex items-center justify-center text-[10px] font-semibold tracking-[0.25em] text-brand-black"
        animate={{
          x: pos.x - 24,
          y: pos.y - 24,
          width: active ? 48 : 26,
          height: active ? 48 : 26,
          opacity: active ? 0.85 : 0.4,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
      >
        <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-2xl" />
        <div className="absolute inset-0 rounded-full border border-brand-gold/60 backdrop-blur-[8px] bg-brand-gold/20 shadow-[0_0_0_1px_rgba(201,168,76,0.3)]" />
        {label && active && <span className="relative text-[9px] text-brand-black">{label}</span>}
      </motion.div>
    </>
  )
}
