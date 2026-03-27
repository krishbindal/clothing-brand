'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, Truck, RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'
import { checkoutSchema, CheckoutFormData } from '@/lib/validations/checkout'

type RazorpayPaymentResponse = {
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
}

type RazorpayFailureResponse = {
  error?: {
    description?: string
  }
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: RazorpayFailureResponse) => void) => void
    }
  }
}

const FREE_SHIPPING_THRESHOLD = 150
const TAX_RATE = 0.08

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>(
    'idle',
  )
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountMessage, setDiscountMessage] = useState<string | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12
  const tax = subtotal * TAX_RATE
  const total = Math.max(0, subtotal + shipping + tax - discountAmount)
  const labelClass = 'block text-xs text-brand-gray-500 uppercase tracking-[0.2em] mb-1.5'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      shippingAddress: {
        firstName: '',
        lastName: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
      },
      saveAddress: true,
    },
  })

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email)
    }
  }, [setValue, user?.email])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?callbackUrl=/checkout')
    }
  }, [authLoading, router, user])

  useEffect(() => {
    const scriptUrl = 'https://checkout.razorpay.com/v1/checkout.js'
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`)

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        setIsRazorpayReady(true)
      } else {
        existing.addEventListener('load', () => setIsRazorpayReady(true))
      }
      return
    }

    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.dataset.loaded = 'false'
    script.onload = () => {
      script.dataset.loaded = 'true'
      setIsRazorpayReady(true)
    }
    script.onerror = () => setError('Unable to load payment gateway. Please refresh and try again.')
    document.body.appendChild(script)
  }, [])

  const handleOrderSave = useMemo(
    () => async (payload: CheckoutFormData, payment: { orderId?: string; paymentId?: string; signature?: string }) => {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            subtotal,
            tax,
            shipping,
            total,
            discountCode,
            discountAmount,
            email: payload.email,
            shippingAddress: payload.shippingAddress,
            userId: user?.uid,
            payment,
          }),
        })
      } catch (storeError) {
        console.error('Order persistence failed:', storeError)
      }
    },
    [discountAmount, discountCode, items, shipping, subtotal, tax, total, user?.uid],
  )

  const applyDiscount = async (codeOverride?: string) => {
    const normalized = (codeOverride ?? discountCode).trim()
    if (!normalized) {
      setDiscountMessage('Enter a code to apply.')
      setDiscountAmount(0)
      return
    }

    setDiscountLoading(true)
    setDiscountMessage(null)
    try {
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized, subtotal }),
      })
      const data = (await response.json()) as {
        valid?: boolean
        amount?: number
        value?: number
        type?: 'PERCENTAGE' | 'FIXED'
      }

      if (!response.ok || !data.valid || !data.amount) {
        setDiscountAmount(0)
        setDiscountMessage('Code not valid or expired.')
        return
      }

      setDiscountAmount(data.amount)
      setDiscountCode(normalized)
      setDiscountMessage(
        `Applied ${normalized.toUpperCase()} — ${
          data.type === 'PERCENTAGE' ? `${data.value}% off` : `${formatPrice(data.amount)} off`
        }`,
      )
    } catch (err) {
      console.error('Apply discount failed', err)
      setDiscountMessage('Unable to apply code right now.')
    } finally {
      setDiscountLoading(false)
    }
  }

  const onSubmit = async (payload: CheckoutFormData) => {
    if (!items.length) {
      setError('Add items to your cart before checking out.')
      return
    }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setError('Payment is temporarily unavailable. Missing Razorpay configuration.')
      return
    }

    setError(null)
    setPaymentStatus('processing')

    try {
      const orderResponse = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'INR',
          notes: {
            email: payload.email,
            city: payload.shippingAddress.city,
          },
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Unable to create order. Please try again.')
      }

      const order = (await orderResponse.json()) as { id: string; amount: number; currency: string }
      setOrderId(order.id)

      if (!isRazorpayReady || !window.Razorpay) {
        throw new Error('Payment gateway not ready. Please wait a moment and retry.')
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LUXE',
        description: 'Secure checkout',
        order_id: order.id,
        prefill: {
          name: `${payload.shippingAddress.firstName} ${payload.shippingAddress.lastName}`.trim(),
          email: payload.email,
        },
        notes: {
          address: `${payload.shippingAddress.line1} ${payload.shippingAddress.line2 || ''}`.trim(),
        },
        theme: { color: '#c9a84c' },
        handler: async (response: RazorpayPaymentResponse) => {
          setPaymentStatus('success')
          await handleOrderSave(payload, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          })
          clearCart()
          const successParams = order.id ? `?orderId=${order.id}` : ''
          router.push(`/checkout/success${successParams}`)
        },
      })

      razorpay.on('payment.failed', (resp: RazorpayFailureResponse) => {
        setPaymentStatus('failed')
        setError(resp?.error?.description || 'Payment failed. Please try another method.')
      })

      razorpay.open()
    } catch (err) {
      setPaymentStatus('failed')
      setError(err instanceof Error ? err.message : 'Payment could not be completed.')
    }
  }

  if (authLoading || (!user && authLoading)) {
    return <div className="min-h-screen bg-brand-black" />
  }

  if (!authLoading && !user) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gray-400">
        Redirecting to sign in...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-white tracking-tight">
              Checkout
            </h1>
            <span className="text-sm text-brand-gray-500">Secure payment powered by Razorpay</span>
          </motion.div>

          <div className="card-dark border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between flex-col sm:flex-row gap-3">
            <div>
              <p className="text-amber-300 text-sm font-semibold uppercase tracking-[0.2em]">
                Limited-time offer
              </p>
              <p className="text-sm text-brand-white">
                Use code <span className="font-semibold">SAVE10</span> to unlock 10% off. Ends tonight.
              </p>
            </div>
            <button
              type="button"
              onClick={() => applyDiscount('SAVE10')}
              className="btn-primary px-5"
            >
              Apply SAVE10
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, title: 'SSL Secure', desc: 'Encrypted checkout' },
              { icon: Truck, title: 'Fast Shipping', desc: 'Ships in 24-48h' },
              { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day window' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 border border-brand-border/50 rounded-lg px-4 py-3 bg-brand-card/30"
              >
                <Icon size={18} className="text-brand-gold" />
                <div>
                  <p className="text-sm text-brand-white font-medium">{title}</p>
                  <p className="text-xs text-brand-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className="card-dark p-6 space-y-4">
              <h2 className="text-lg font-semibold text-brand-white">Contact</h2>
              <div>
                <label className="block text-xs text-brand-gray-500 uppercase tracking-[0.2em] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input-dark"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </section>

            <section className="card-dark p-6 space-y-4">
              <h2 className="text-lg font-semibold text-brand-white">Shipping address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First name</label>
                  <input className="input-dark" {...register('shippingAddress.firstName')} />
                  {errors.shippingAddress?.firstName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input className="input-dark" {...register('shippingAddress.lastName')} />
                  {errors.shippingAddress?.lastName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <input className="input-dark" {...register('shippingAddress.line1')} />
                {errors.shippingAddress?.line1 && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.shippingAddress.line1.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Apartment, suite, etc. (optional)</label>
                <input className="input-dark" {...register('shippingAddress.line2')} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input className="input-dark" {...register('shippingAddress.city')} />
                  {errors.shippingAddress?.city && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input className="input-dark" {...register('shippingAddress.state')} />
                  {errors.shippingAddress?.state && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Postal code</label>
                  <input className="input-dark" {...register('shippingAddress.postalCode')} />
                  {errors.shippingAddress?.postalCode && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Country</label>
                  <input className="input-dark" {...register('shippingAddress.country')} />
                  {errors.shippingAddress?.country && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.shippingAddress.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Phone (optional)</label>
                  <input className="input-dark" {...register('shippingAddress.phone')} />
                </div>
              </div>
            </section>

            <section className="card-dark p-6 space-y-3">
              <div className="flex items-end gap-3 flex-col sm:flex-row">
                <div className="flex-1 w-full">
                  <label className="block text-xs text-brand-gray-500 uppercase tracking-[0.2em] mb-1.5">
                    Discount code
                  </label>
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="input-dark w-full"
                    placeholder="SAVE10"
                    autoCapitalize="characters"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void applyDiscount()}
                  disabled={discountLoading}
                  className="btn-secondary w-full sm:w-auto px-5"
                >
                  {discountLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {discountMessage && (
                <p className="text-xs text-brand-gray-300">
                  {discountMessage}
                </p>
              )}
            </section>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
                <CheckCircle2 size={16} />
                <span className="text-sm">
                  Payment confirmed. {orderId ? `Order ${orderId} created.` : 'Order created.'}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={paymentStatus === 'processing' || !isRazorpayReady}
              className="btn-primary w-full md:w-auto px-8"
            >
              {paymentStatus === 'processing' ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </form>
        </div>

        <aside className="card-dark p-6 space-y-4 h-fit sticky top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-white">Order summary</h2>
            <span className="text-sm text-brand-gray-400">{items.length} items</span>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {items.length === 0 ? (
              <p className="text-brand-gray-500">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-brand-border/40 pb-3"
                >
                  <div>
                    <p className="text-sm text-brand-white font-medium">{item.product.name}</p>
                    <p className="text-xs text-brand-gray-500">
                      {item.size} · {item.color}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-brand-gray-500 hover:text-brand-white"
                        type="button"
                      >
                        −
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-brand-gray-500 hover:text-brand-white"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-white text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 mt-1"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2 text-sm text-brand-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-white font-semibold text-base pt-2 border-t border-brand-border/40">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="text-xs text-brand-gray-500">
            Orders over {formatPrice(FREE_SHIPPING_THRESHOLD)} ship free. Shipping & taxes are
            estimated and finalized at payment.
            <br />
            Cart reservations are held for 10 minutes during this flash offer.
          </div>
        </aside>
      </div>
    </main>
  )
}
