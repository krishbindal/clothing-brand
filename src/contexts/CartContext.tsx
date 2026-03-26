'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
} from 'react'
import { CartItem, Product } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { logEvent } from '@/lib/analytics'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size: string; color: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] }

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity: number, size: string, color: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }

    case 'ADD_ITEM': {
      const { product, quantity, size, color } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      )

      if (existingIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        }
        return { ...state, items: updatedItems }
      }

      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        product,
        quantity,
        size,
        color,
      }
      return { ...state, items: [...state.items, newItem] }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.id !== id) }
      }
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const storageKey = useMemo(
    () => (user ? `cart:${user.uid}` : 'cart:guest'),
    [user],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(storageKey)
    const guestStored = user ? localStorage.getItem('cart:guest') : null
    const legacyStored = !stored ? localStorage.getItem('cart') : null

    try {
      if (stored) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) as CartItem[] })
        return
      }

      if (guestStored && user) {
        const guestItems = JSON.parse(guestStored) as CartItem[]
        dispatch({ type: 'HYDRATE', payload: guestItems })
        localStorage.setItem(storageKey, JSON.stringify(guestItems))
        localStorage.removeItem('cart:guest')
        return
      }

      if (legacyStored) {
        const legacyItems = JSON.parse(legacyStored) as CartItem[]
        dispatch({ type: 'HYDRATE', payload: legacyItems })
        localStorage.setItem(storageKey, JSON.stringify(legacyItems))
        localStorage.removeItem('cart')
        return
      }
    } catch {
      localStorage.removeItem(storageKey)
    }

    dispatch({ type: 'HYDRATE', payload: [] })
  }, [storageKey, user])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify(state.items))
  }, [state.items, storageKey])

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const addItem = (product: Product, quantity: number, size: string, color: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } })
    dispatch({ type: 'OPEN_CART' })
    logEvent('ADD_TO_CART', {
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      productId: product.id,
      metadata: { quantity, size, color, price: product.price },
      userId: user?.uid,
    }).catch(() => null)
  }

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' })
  const openCart = () => dispatch({ type: 'OPEN_CART' })
  const closeCart = () => dispatch({ type: 'CLOSE_CART' })

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
