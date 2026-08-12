import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  detail: string
  price: number
  image: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  restoreItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem('we-cart')
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart)

  const persist = (next: CartItem[]) => {
    setItems(next)
    try {
      window.localStorage.setItem('we-cart', JSON.stringify(next))
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
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      addItem,
      restoreItem: (item: CartItem) => persist([...items.filter((current) => current.id !== item.id), item]),
      removeItem: (id: string) => persist(items.filter((item) => item.id !== id)),
      updateQuantity: (id: string, quantity: number) =>
        persist(
          items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        ),
      clearCart: () => persist([]),
    }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
