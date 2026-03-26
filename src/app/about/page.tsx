'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Scissors, Sparkles, Eye } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
}

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true, margin: '-50px' },
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gold-radial opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-brand-gold text-sm uppercase tracking-[0.3em] mb-6 font-medium"
          >
            Est. 2024
          </motion.p>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-brand-white mb-8 tracking-tight leading-[0.95]">
            Where Luxury
            <br />
            Meets <span className="gold-text">Timelessness</span>
          </h1>

          <p className="text-brand-gray-300 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            We craft more than clothing &mdash; we create experiences that transcend seasons, moments
            that become memories, and garments that tell your story.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-brand-gold to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        {...fadeInUp}
        className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-16 origin-left"
          />

          <motion.h2
            {...fadeInUp}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-12 tracking-tight"
          >
            Our Story
          </motion.h2>

          <motion.div {...staggerContainer} className="space-y-8 text-brand-gray-300 text-lg leading-relaxed">
            <motion.p {...fadeInUp}>
              Born from a vision to redefine luxury fashion, LUXE emerged as a sanctuary for those
              who appreciate the finer things in life. We believe that true elegance lies not in
              excess, but in meticulous attention to every detail.
            </motion.p>

            <motion.p {...fadeInUp}>
              Each piece in our collection is thoughtfully designed to embody sophistication and
              timelessness. We draw inspiration from the golden age of craftsmanship, where quality
              was paramount and every garment told a story.
            </motion.p>

            <motion.p {...fadeInUp}>
              Our journey began with a simple question: What if clothing could be more than just
              fabric? What if it could be an expression of identity, a celebration of
              individuality, and a testament to refined taste?
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-brand-dark/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-brand-white text-center mb-20 tracking-tight"
          >
            What Defines Us
          </motion.h2>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                icon: Scissors,
                title: 'Craftsmanship',
                description:
                  'Every piece is meticulously crafted by skilled artisans who pour their expertise into every stitch, creating garments that stand the test of time.',
              },
              {
                icon: Sparkles,
                title: 'Excellence',
                description:
                  'We source only the finest materials from around the world, ensuring that quality is never compromised in pursuit of creating exceptional luxury pieces.',
              },
              {
                icon: Eye,
                title: 'Vision',
                description:
                  'Our designs transcend trends, focusing on timeless elegance that empowers individuals to express their unique style with confidence and grace.',
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                {...fadeInUp}
                className="group relative"
              >
                <div className="relative p-8 md:p-10 bg-brand-card border border-brand-border rounded-lg hover:border-brand-gold/40 transition-all duration-600 overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gold-radial opacity-0 group-hover:opacity-20 transition-opacity duration-600" />

                  <div className="relative z-10">
                    <div className="mb-6 inline-flex p-4 bg-brand-dark rounded-lg border border-brand-border group-hover:border-brand-gold/40 transition-colors duration-400">
                      <value.icon
                        size={32}
                        className="text-brand-gold"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-brand-white mb-4 tracking-tight">
                      {value.title}
                    </h3>

                    <p className="text-brand-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-16"
          />

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-10 tracking-tight leading-tight">
            Creating Tomorrow&apos;s
            <br />
            <span className="gold-text">Legacy Today</span>
          </h2>

          <p className="text-brand-gray-300 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
            We envision a world where luxury fashion is accessible to those who value quality over
            quantity, where every wardrobe piece is an investment in timeless style, and where
            personal expression knows no bounds.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16"
          >
            <Link
              href="/collections"
              className="inline-flex items-center justify-center px-10 py-4 bg-brand-white text-brand-black font-semibold text-sm uppercase tracking-[0.2em] rounded-sm hover:bg-brand-gold transition-all duration-400 ease-luxury shadow-elevated hover:shadow-gold"
            >
              Explore Collections
            </Link>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mt-16"
          />
        </motion.div>
      </section>
    </main>
  )
}
