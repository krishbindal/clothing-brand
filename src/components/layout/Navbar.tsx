'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, User, Menu, X, Search, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const navLinks = [
  { label: 'Shop', href: '/shop', hasDropdown: true },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
]

const shopDropdown = [
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Tops', href: '/shop?category=tops' },
  { label: 'Bottoms', href: '/shop?category=bottoms' },
  { label: 'Outerwear', href: '/shop?category=outerwear' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Sale', href: '/shop?filter=sale' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { itemCount, openCart } = useCart()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-border/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.span
                className="text-2xl font-display font-bold tracking-[0.3em] gold-text"
                whileHover={{ scale: 1.02 }}
              >
                LUXE
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <button
                      className="flex items-center gap-1 text-brand-gray-300 hover:text-brand-white text-sm font-medium tracking-wide transition-colors duration-200"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-brand-gray-300 hover:text-brand-white text-sm font-medium tracking-wide transition-colors duration-200 relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <div className="bg-brand-card border border-brand-border rounded-lg py-2 min-w-[180px] shadow-card">
                            {shopDropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 text-sm text-brand-gray-300 hover:text-brand-white hover:bg-brand-muted transition-colors duration-150"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/search" className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors">
                <Search size={20} />
              </Link>

              <Link href="/account/wishlist" className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors hidden sm:block">
                <Heart size={20} />
              </Link>

              {/* Cart Button */}
              <motion.button
                onClick={openCart}
                className="relative p-2 text-brand-gray-400 hover:text-brand-white transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-gold text-brand-black text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User */}
              {session ? (
                <div className="relative group hidden sm:block">
                  <button className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                    <div className="bg-brand-card border border-brand-border rounded-lg py-2 min-w-[160px] shadow-card">
                      <Link href="/account" className="block px-4 py-2 text-sm text-brand-gray-300 hover:text-brand-white hover:bg-brand-muted transition-colors">
                        My Account
                      </Link>
                      <Link href="/account/orders" className="block px-4 py-2 text-sm text-brand-gray-300 hover:text-brand-white hover:bg-brand-muted transition-colors">
                        Orders
                      </Link>
                      <hr className="my-1 border-brand-border" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-sm text-brand-gray-300 hover:text-brand-white hover:bg-brand-muted transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex btn-secondary py-2 px-4 text-xs">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-brand-gray-400 hover:text-brand-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-black pt-20"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-display font-semibold text-brand-white tracking-wide"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-brand-border" />
              {session ? (
                <>
                  <Link href="/account" className="text-lg text-brand-gray-300" onClick={() => setMobileOpen(false)}>My Account</Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }} className="text-lg text-brand-gray-300 text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg text-brand-gold font-semibold" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/signup" className="text-lg text-brand-gray-300" onClick={() => setMobileOpen(false)}>Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
