import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { books } from '../data/books'
import type { Book, CartItem, Order, WishlistItem } from '../types'

interface StoreContextValue {
  cart: CartItem[]
  wishlist: WishlistItem[]
  orders: Order[]
  addToCart: (bookId: string, quantity?: number) => void
  updateCartQuantity: (bookId: string, quantity: number) => void
  removeFromCart: (bookId: string) => void
  toggleWishlist: (bookId: string) => void
  isInWishlist: (bookId: string) => boolean
  isInCart: (bookId: string) => boolean
  clearCart: () => void
  addOrder: (order: Order) => void
  getBook: (bookId: string) => Book | undefined
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

const CART_KEY = 'bookstore_cart'
const WISHLIST_KEY = 'bookstore_wishlist'
const ORDERS_KEY = 'bookstore_orders'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    wishlist,
    orders,
    addToCart: (bookId, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.bookId === bookId)
        if (existing) {
          return prev.map((item) => (item.bookId === bookId ? { ...item, quantity: item.quantity + quantity } : item))
        }
        return [...prev, { bookId, quantity }]
      })
    },
    updateCartQuantity: (bookId, quantity) => {
      setCart((prev) =>
        prev
          .map((item) => (item.bookId === bookId ? { ...item, quantity: Math.max(1, quantity) } : item))
          .filter((item) => item.quantity > 0),
      )
    },
    removeFromCart: (bookId) => {
      setCart((prev) => prev.filter((item) => item.bookId !== bookId))
    },
    toggleWishlist: (bookId) => {
      setWishlist((prev) => {
        if (prev.some((item) => item.bookId === bookId)) {
          return prev.filter((item) => item.bookId !== bookId)
        }
        return [...prev, { bookId }]
      })
    },
    isInWishlist: (bookId) => wishlist.some((item) => item.bookId === bookId),
    isInCart: (bookId) => cart.some((item) => item.bookId === bookId),
    clearCart: () => setCart([]),
    addOrder: (order) => setOrders((prev) => [order, ...prev]),
    getBook: (bookId) => books.find((book) => book.id === bookId),
  }), [cart, wishlist, orders])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
