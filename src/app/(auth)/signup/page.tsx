'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupFormData } from '@/lib/validations/auth'
import { useAuth } from '@/contexts/AuthContext'

const passwordRequirements = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[0-9]/, label: 'One number' },
  { regex: /[^A-Za-z0-9]/, label: 'One special character' },
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signup } = useAuth()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await signup(data.name, data.email, data.password)
      router.push('/account')
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-display font-bold tracking-[0.3em] gold-text">LUXE</Link>
          <h1 className="text-xl font-semibold text-brand-white mt-4">Create your account</h1>
          <p className="text-brand-gray-500 text-sm mt-1">Join the inner circle</p>
        </div>
        <div className="card-dark p-8 space-y-5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-brand-gray-400 uppercase tracking-wider mb-1.5">Name</label>
              <input {...register('name')} type="text" placeholder="Your name" className={`input-dark ${errors.name ? 'border-red-500/50' : ''}`} autoComplete="name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-brand-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="your@email.com" className={`input-dark ${errors.email ? 'border-red-500/50' : ''}`} autoComplete="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-brand-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={`input-dark pr-10 ${errors.password ? 'border-red-500/50' : ''}`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-brand-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-1.5">
                      <Check size={12} className={req.regex.test(password) ? 'text-green-400' : 'text-brand-gray-700'} />
                      <span className={`text-xs ${req.regex.test(password) ? 'text-green-400' : 'text-brand-gray-600'}`}>{req.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-brand-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="••••••••" className={`input-dark ${errors.confirmPassword ? 'border-red-500/50' : ''}`} autoComplete="new-password" />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full group">
              {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />Creating account...</span> : <>Create Account <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>}
            </button>
          </form>
          <p className="text-xs text-brand-gray-600 text-center">
            By creating an account, you agree to our{' '}<Link href="/terms" className="text-brand-gold hover:text-brand-gold-light">Terms</Link>{' '}and{' '}<Link href="/privacy" className="text-brand-gold hover:text-brand-gold-light">Privacy Policy</Link>
          </p>
        </div>
        <p className="text-center text-sm text-brand-gray-500 mt-6">
          Already have an account?{' '}<Link href="/login" className="text-brand-gold hover:text-brand-gold-light font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
