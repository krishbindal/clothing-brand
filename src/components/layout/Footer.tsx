import Link from 'next/link'
import { Globe, Link2, Play } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Collections', href: '/collections' },
    { label: 'Sale', href: '/shop?filter=sale' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-display font-bold tracking-[0.3em] gold-text">
              LUXE
            </Link>
            <p className="text-brand-gray-500 text-sm mt-4 leading-relaxed">
              Premium dark luxury clothing for those who move beyond the ordinary.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: Globe, href: '#', label: 'Instagram' },
                { icon: Link2, href: '#', label: 'Twitter' },
                { icon: Play, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-gray-500 hover:text-brand-gold hover:border-brand-gold transition-all duration-200"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-brand-white font-semibold text-sm uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-gray-500 hover:text-brand-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray-600 text-xs">
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-brand-gray-600 text-xs">We accept:</p>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((card) => (
                <span key={card} className="text-xs text-brand-gray-600 border border-brand-border rounded px-1.5 py-0.5">
                  {card}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
