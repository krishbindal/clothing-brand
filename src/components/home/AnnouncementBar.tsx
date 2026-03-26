'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const announcements = [
  'Free shipping on orders over $150 · Use code LUXE10 for 10% off',
  'New SS25 Collection dropping weekly · Sign up for early access',
  'Limited edition drops sell out fast · Join the waitlist today',
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-brand-gold text-brand-black py-2.5 px-4 relative overflow-hidden">
      <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
        <div className="flex-1 overflow-hidden text-center">
          <div className="animate-ticker inline-flex whitespace-nowrap">
            {[...announcements, ...announcements].map((msg, i) => (
              <span key={i} className="mx-12 text-xs font-semibold uppercase tracking-widest">{msg}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
