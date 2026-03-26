import Link from 'next/link'

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

const socialLinks = [
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'Twitter', href: '#', icon: 'X' },
  { label: 'TikTok', href: '#', icon: 'TK' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-brand-border/50 relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-display font-bold tracking-[0.3em] gold-text">
              LUXE
            </Link>
            <p className="text-brand-gray-500 text-sm mt-5 leading-relaxed max-w-[250px]">
              Premium dark luxury clothing for those who move beyond the ordinary.
            </p>
            <div className="flex gap-3 mt-7">
              {socialLinks.map(({ href, label, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-gray-500 text-xs font-semibold tracking-wider hover:text-brand-gold hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-400"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-brand-white font-semibold text-xs uppercase tracking-[0.2em] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-gray-500 hover:text-brand-white text-sm transition-colors duration-300 hover-line inline-block"
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
        <div className="border-t border-brand-border/40 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-brand-gray-600 text-xs tracking-wide">
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-brand-gray-600 text-xs">We accept</p>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((card) => (
                <span
                  key={card}
                  className="text-[10px] text-brand-gray-500 border border-brand-border/50 rounded px-2 py-0.5 font-medium"
                >
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
