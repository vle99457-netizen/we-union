import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Price } from '../data/catalog'

export type CartItem = {
  id: string
  productSlug?: string
  name: string
  detail: string
  price: Price
  image: string
  quantity: number
  designId?: string
  proofVersion?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number | null
  hasPendingPricing: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  restoreItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'we-cart-v3'

function isPrice(value: unknown): value is Price {
  if (!value || typeof value !== 'object' || !('status' in value)) return false
  if (value.status === 'tbd') return true
  return (
    value.status === 'confirmed' &&
    'amount' in value &&
    typeof value.amount === 'number' &&
    'currency' in value &&
    value.currency === 'USD'
  )
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CartItem>
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.detail === 'string' &&
    typeof item.image === 'string' &&
    typeof item.quantity === 'number' &&
    isPrice(item.price)
  )
}

function readInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart)

  const persist = (next: CartItem[]) => {
    setItems(next)
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // The in-memory cart remains usable when browser storage is unavailable.
    }
  }

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.find((current) => current.id === item.id)
    const next = existing
      ? items.map((current) =>
          current.id === item.id ? { ...current, quantity: current.quantity + 1 } : current,
        )
      : [...items, { ...item, quantity: 1 }]
    persist(next)
  }

  const value = useMemo(
    () => {
      const hasPendingPricing = items.some((item) => item.price.status === 'tbd')
      const subtotal = hasPendingPricing
        ? null
        : items.reduce(
            (total, item) =>
              total + (item.price.status === 'confirmed' ? item.price.amount * item.quantity : 0),
            0,
          )

      return {
        items,
        count: items.reduce((total, item) => total + item.quantity, 0),
        subtotal,
        hasPendingPricing,
        addItem,
        restoreItem: (item: CartItem) =>
          persist([...items.filter((current) => current.id !== item.id), item]),
        removeItem: (id: string) => persist(items.filter((item) => item.id !== id)),
        updateQuantity: (id: string, quantity: number) =>
          persist(
            items.map((item) =>
              item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
            ),
          ),
        clearCart: () => persist([]),
      }
    },
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
