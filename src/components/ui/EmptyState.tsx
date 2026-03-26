import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 p-6 rounded-full bg-brand-card border border-brand-border"
      >
        <Icon size={40} className="text-brand-gray-500" strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-2xl font-display font-semibold text-brand-white mb-3 tracking-tight">
        {title}
      </h3>

      <p className="text-brand-gray-400 text-center max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-white text-brand-black font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-brand-gold transition-all duration-400 ease-luxury"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-white text-brand-black font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-brand-gold transition-all duration-400 ease-luxury"
            >
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
