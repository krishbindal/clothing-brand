import { motion } from 'framer-motion'

export default function Loader({ fullScreen = false }: { fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-12 h-12"
      >
        <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full" />
        <div className="absolute inset-2 border-r-2 border-brand-white/40 rounded-full" />
        <div className="absolute inset-4 border-b-2 border-brand-gold/60 rounded-full" />
      </motion.div>
      <motion.p 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[10px] tracking-[0.3em] uppercase font-medium text-brand-gold"
      >
        Loading...
      </motion.p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/80 backdrop-blur-md">
        {content}
      </div>
    )
  }

  return (
    <div className="w-full py-20 flex items-center justify-center">
      {content}
    </div>
  )
}
