'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, User, Menu, X, Search, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user, logout } = useAuth()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ease-luxury ${
          scrolled
            ? 'bg-brand-black/90 backdrop-blur-xl border-b border-brand-border/30 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative group">
              <motion.span
                className="text-2xl font-display font-bold tracking-[0.3em] gold-text"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                LUXE
              </motion.span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-brand-gold to-brand-gold-light group-hover:w-full transition-all duration-500 ease-luxury" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-9">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <button
                      className="flex items-center gap-1.5 text-brand-gray-300 hover:text-brand-white text-[13px] font-medium tracking-wide transition-colors duration-300"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {link.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-300 ease-luxury ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-brand-gray-300 hover:text-brand-white text-[13px] font-medium tracking-wide transition-colors duration-300 hover-line"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <div className="glass rounded-xl py-2 min-w-[200px] shadow-elevated">
                            {shopDropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-5 py-2.5 text-[13px] text-brand-gray-300 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200 hover:pl-6"
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
            <div className="flex items-center gap-1">
              <Link
                href="/search"
                className="p-2.5 text-brand-gray-400 hover:text-brand-white transition-colors duration-300"
              >
                <Search size={19} />
              </Link>

              <Link
                href="/account/wishlist"
                className="p-2.5 text-brand-gray-400 hover:text-brand-white transition-colors duration-300 hidden sm:block"
              >
                <Heart size={19} />
              </Link>

              {/* Cart Button */}
              <motion.button
                onClick={openCart}
                className="relative p-2.5 text-brand-gray-400 hover:text-brand-white transition-colors duration-300"
                whileTap={{ scale: 0.92 }}
              >
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-brand-gold text-brand-black text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User */}
              {user ? (
                <div className="relative group hidden sm:block">
                  <button className="p-2.5 text-brand-gray-400 hover:text-brand-white transition-colors duration-300">
                    <User size={19} />
                  </button>
                  <div className="absolute right-0 top-full pt-3 hidden group-hover:block">
                    <div className="glass rounded-xl py-2 min-w-[170px] shadow-elevated">
                      <Link
                        href="/account"
                        className="block px-5 py-2.5 text-[13px] text-brand-gray-300 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-5 py-2.5 text-[13px] text-brand-gray-300 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                      >
                        Orders
                      </Link>
                      <hr className="my-1.5 border-brand-border/50" />
                      <button
                        onClick={() => void logout()}
                        className="block w-full text-left px-5 py-2.5 text-[13px] text-brand-gray-300 hover:text-brand-white hover:bg-brand-white/5 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center justify-center px-5 py-2 border border-brand-border text-brand-white text-xs font-medium uppercase tracking-[0.15em] rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all duration-400"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2.5 text-brand-gray-400 hover:text-brand-white transition-colors duration-300"
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
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 bg-brand-black border-l border-brand-border/30 md:hidden"
            >
              {/* Close button */}
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-brand-gray-400 hover:text-brand-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="px-8 py-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 text-2xl font-display font-semibold text-brand-white tracking-wide hover:text-brand-gold transition-colors duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <hr className="my-4 border-brand-border/50" />

                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="text-brand-gray-300 py-2 text-base hover:text-brand-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="text-brand-gray-300 py-2 text-base hover:text-brand-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        void logout()
                        setMobileOpen(false)
                      }}
                      className="text-brand-gray-300 py-2 text-base text-left hover:text-brand-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-brand-gold font-semibold py-2 text-base"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="text-brand-gray-300 py-2 text-base hover:text-brand-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
