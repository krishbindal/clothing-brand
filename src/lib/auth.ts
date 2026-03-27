import NextAuth, { type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { getPrisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations/auth'

type AuthHandler = ReturnType<typeof NextAuth>

let authHandler: AuthHandler | null = null
let cachedOptions: NextAuthOptions | null = null

const buildProviders = () => {
  const providers = [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await getPrisma().user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        if (!user.emailVerified) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ]

  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (googleClientId && googleClientSecret) {
    providers.unshift(
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    )
  }

  return providers
}

export const getAuthOptions = (): NextAuthOptions => {
  if (!cachedOptions) {
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET

    if (!nextAuthUrl || !nextAuthSecret) {
      console.warn('NEXTAUTH_URL or NEXTAUTH_SECRET is not set. Auth routes may fail at runtime.')
    }

    cachedOptions = {
      adapter: PrismaAdapter(getPrisma()),
      session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      pages: {
        signIn: '/login',
        error: '/login',
        verifyRequest: '/verify-email',
      },
      providers: buildProviders(),
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id
            token.role = (user as unknown as { role?: string }).role
          }
          return token
        },
        async session({ session, token }) {
          if (token && session.user) {
            session.user.id = token.id as string
            ;(session.user as unknown as { role: string }).role = token.role as string
          }
          return session
        },
      },
      events: {
        async signIn({ user, account }) {
          // Update emailVerified for OAuth sign-ins
          if (account?.provider === 'google' && user.email) {
            await getPrisma().user
              .update({
                where: { email: user.email },
                data: { emailVerified: new Date() },
              })
              .catch(() => null)
          }
        },
      },
    }
  }

  return cachedOptions
}

const getAuthHandler = (): AuthHandler => {
  if (!authHandler) {
    authHandler = NextAuth(getAuthOptions())
  }
  return authHandler
}

export const handlers = {
  GET: (...args: Parameters<AuthHandler['handlers']['GET']>) => getAuthHandler().handlers.GET(...args),
  POST: (...args: Parameters<AuthHandler['handlers']['POST']>) =>
    getAuthHandler().handlers.POST(...args),
}

export const auth = (...args: Parameters<AuthHandler['auth']>) => getAuthHandler().auth(...args)

export const signIn = (...args: Parameters<AuthHandler['signIn']>) => getAuthHandler().signIn(...args)

export const signOut = (...args: Parameters<AuthHandler['signOut']>) =>
  getAuthHandler().signOut(...args)
