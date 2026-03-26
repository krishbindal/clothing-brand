'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ImageZoomProps {
  children: React.ReactNode
  zoomLevel?: number
  className?: string
}

export default function ImageZoom({ children, zoomLevel = 2.5, className = '' }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isZooming, setIsZooming] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => setIsZooming(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsZooming(false)
    setPosition({ x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          scale: isZooming ? zoomLevel : 1,
          x: isZooming ? `${-(position.x - 50) * (zoomLevel - 1)}%` : '0%',
          y: isZooming ? `${-(position.y - 50) * (zoomLevel - 1)}%` : '0%',
        }}
        transition={{
          type: 'tween',
          duration: isZooming ? 0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* Zoom hint */}
      <motion.div
        initial={false}
        animate={{ opacity: isZooming ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-4 right-4 z-10 pointer-events-none"
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] text-brand-gray-400 uppercase tracking-wider bg-brand-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-brand-border/30">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          Hover to zoom
        </span>
      </motion.div>
    </div>
  )
}
