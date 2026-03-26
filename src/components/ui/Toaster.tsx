'use client'

import { useState, useCallback, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastContextType {
  toast: (type: Toast['type'], message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within Toaster')
  return context
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    ;(window as Window & { toast?: ToastContextType['toast'] }).toast = toast
  }, [toast])

  const icons = {
    success: <CheckCircle size={16} className="text-green-400 flex-shrink-0" />,
    error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
    info: <AlertCircle size={16} className="text-brand-gold flex-shrink-0" />,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg px-4 py-3 shadow-card min-w-[280px] max-w-sm"
            >
              {icons[t.type]}
              <p className="text-sm text-brand-white flex-1">{t.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="p-0.5 text-brand-gray-500 hover:text-brand-white transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
