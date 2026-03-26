'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  footer?: ReactNode
  widthClassName?: string
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  widthClassName = 'max-w-lg',
}: ModalProps) {
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [handleEsc, open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
          >
            <div className={`w-full ${widthClassName} rounded-xl bg-brand-dark border border-brand-border/40 shadow-elevated`}>
              {(title || description) && (
                <div className="px-6 pt-5 pb-2 border-b border-brand-border/40">
                  {title && <h2 className="text-lg font-semibold text-brand-white">{title}</h2>}
                  {description && <p className="text-sm text-brand-gray-500 mt-1">{description}</p>}
                </div>
              )}
              <div className="p-6">{children}</div>
              {footer && <div className="px-6 py-4 border-t border-brand-border/40">{footer}</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
