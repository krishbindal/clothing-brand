'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { FirebaseApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseApp } from '@/lib/firebase/client'

export interface AuthUser {
  uid: string
  email: string | null
  name?: string | null
  photoURL?: string | null
  lastLogin?: string | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuth = useMemo(() => {
    try {
      return { app: getFirebaseApp(), error: null as string | null }
    } catch (error) {
      return {
        app: null,
        error: error instanceof Error ? error.message : 'Authentication unavailable',
      }
    }
  }, [])

  const [app] = useState<FirebaseApp | null>(initialAuth.app)
  const [configError] = useState<string | null>(initialAuth.error)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(!initialAuth.error)

  const auth = useMemo(() => (app ? getAuth(app) : null), [app])

  useEffect(() => {
    if (!auth) return undefined
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        lastLogin: firebaseUser.metadata?.lastSignInTime ?? null,
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const login = useCallback(
    async (email: string, password: string) => {
      if (!auth) {
        throw new Error(configError || 'Authentication not configured')
      }
      await signInWithEmailAndPassword(auth, email, password)
    },
    [auth, configError],
  )

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      if (!auth) {
        throw new Error(configError || 'Authentication not configured')
      }
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      if (credential.user && name) {
        await updateProfile(credential.user, { displayName: name })
      }
    },
    [auth, configError],
  )

  const loginWithGoogle = useCallback(async () => {
    if (!auth) {
      throw new Error(configError || 'Authentication not configured')
    }
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [auth, configError])

  const logout = useCallback(async () => {
    if (!auth) return
    await signOut(auth)
  }, [auth])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
    }),
    [loading, login, loginWithGoogle, logout, signup, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
