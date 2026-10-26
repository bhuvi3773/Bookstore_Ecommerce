import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { books, getBookById } from '../data/books'
import { findCoupon } from '../data/coupons'
import type { Book, BookFormat, CartItem, Coupon, DemoUser, Order, WishlistItem } from '../types'
import { getFormatPrice } from '../utils/pricing'

export interface StoreActionResult {
  ok: boolean
  message: string
}

interface StoreContextValue {
  cart: CartItem[]
  wishlist: WishlistItem[]
  orders: Order[]
  recentlyViewed: string[]
  user: DemoUser | null
  coupon: Coupon | null
  cartOpen: boolean
  cartCount: number
  addToCart: (bookId: string, quantity?: number, format?: BookFormat) => StoreActionResult
  updateCartQuantity: (bookId: string, quantity: number, format?: BookFormat) => StoreActionResult
  removeFromCart: (bookId: string, format?: BookFormat) => void
  toggleWishlist: (bookId: string) => boolean
  isInWishlist: (bookId: string) => boolean
  isInCart: (bookId: string) => boolean
  clearCart: () => void
  addOrder: (order: Order) => void
  applyCoupon: (code: string) => StoreActionResult
  removeCoupon: () => void
  markViewed: (bookId: string) => void
  openCart: () => void
  closeCart: () => void
  signIn: (user: DemoUser) => void
  signOut: () => void
  getBook: (bookId: string) => Book | undefined
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

const CART_KEY = 'bookstore_cart'
const WISHLIST_KEY = 'bookstore_wishlist'
const ORDERS_KEY = 'bookstore_orders'
const RECENT_KEY = 'bookstore_recently_viewed'
const COUPON_KEY = 'bookstore_coupon'
const USER_KEY = 'bookstore_demo_user'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function sanitiseCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return []
  const merged: CartItem[] = []
  value.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return
    const candidate = entry as Partial<CartItem>
    const book = typeof candidate.bookId === 'string' ? getBookById(candidate.bookId) : undefined
    if (!book) return
    const format = book.format.includes(candidate.format as BookFormat)
      ? (candidate.format as BookFormat)
      : book.format[0]
    const requested = Number(candidate.quantity)
    const quantity = Math.min(Math.max(1, Number.isFinite(requested) ? Math.round(requested) : 1), book.stock)
    if (book.stock <= 0) return
    const existing = merged.find((item) => item.bookId === book.id && (item.format ?? book.format[0]) === format)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, book.stock)
    } else {
      merged.push({ bookId: book.id, quantity, format })
    }
  })
  return merged
}

function sanitiseWishlist(value: unknown): WishlistItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry): entry is WishlistItem => Boolean(entry) && typeof entry === 'object' && typeof (entry as WishlistItem).bookId === 'string')
    .filter((entry) => Boolean(getBookById(entry.bookId)))
}

function sanitiseOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is Order => Boolean(entry) && typeof entry === 'object' && typeof (entry as Order).id === 'string' && Array.isArray((entry as Order).items))
}

function lineMatches(item: CartItem, bookId: string, format?: BookFormat) {
  if (item.bookId !== bookId) return false
  if (!format) return true
  const book = getBookById(bookId)
  return (item.format ?? book?.format[0]) === format
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => sanitiseCart(readStorage<unknown>(CART_KEY, [])))
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => sanitiseWishlist(readStorage<unknown>(WISHLIST_KEY, [])))
  const [orders, setOrders] = useState<Order[]>(() => sanitiseOrders(readStorage<unknown>(ORDERS_KEY, [])))
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const value = readStorage<unknown>(RECENT_KEY, [])
    if (!Array.isArray(value)) return []
    return value.filter((id): id is string => typeof id === 'string' && Boolean(getBookById(id))).slice(0, 8)
  })
  const [couponCode, setCouponCode] = useState<string>(() => readStorage<string>(COUPON_KEY, ''))
  const [user, setUser] = useState<DemoUser | null>(() => readStorage<DemoUser | null>(USER_KEY, null))
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  useEffect(() => {
    localStorage.setItem(COUPON_KEY, JSON.stringify(couponCode))
  }, [couponCode])

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }, [user])

  const coupon = useMemo(() => (couponCode ? findCoupon(couponCode) ?? null : null), [couponCode])

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const addToCart = (bookId: string, quantity = 1, format?: BookFormat): StoreActionResult => {
      const book = getBookById(bookId)
      if (!book) return { ok: false, message: 'This book is no longer available.' }
      if (book.stock <= 0) return { ok: false, message: 'This title is currently out of stock.' }

      const selectedFormat = format && book.format.includes(format) ? format : book.format[0]
      const existing = cart.find((item) => lineMatches(item, bookId, selectedFormat))
      const currentQuantity = existing?.quantity ?? 0
      const available = Math.max(0, book.stock - currentQuantity)

      if (available <= 0) {
        return { ok: false, message: `Only ${book.stock} ${book.stock === 1 ? 'copy' : 'copies'} available — your bag is at the limit.` }
      }

      const toAdd = Math.min(Math.max(1, Math.round(quantity)), available)
      setCart((prev) => {
        const found = prev.find((item) => lineMatches(item, bookId, selectedFormat))
        if (found) {
          return prev.map((item) =>
            lineMatches(item, bookId, selectedFormat)
              ? { ...item, quantity: Math.min(item.quantity + toAdd, book.stock), format: selectedFormat }
              : item,
          )
        }
        return [...prev, { bookId, quantity: toAdd, format: selectedFormat }]
      })

      const capped = toAdd < Math.max(1, Math.round(quantity))
      return {
        ok: true,
        message: capped
          ? `Added ${toAdd} ${toAdd === 1 ? 'copy' : 'copies'} — that is all we have in stock.`
          : `Added “${book.title}” to your bag.`,
      }
    }

    const updateCartQuantity = (bookId: string, quantity: number, format?: BookFormat): StoreActionResult => {
      const book = getBookById(bookId)
      if (!book) return { ok: false, message: 'This book is no longer available.' }
      const next = Math.max(1, Math.round(quantity))
      if (next > book.stock) {
        setCart((prev) => prev.map((item) => (lineMatches(item, bookId, format) ? { ...item, quantity: book.stock } : item)))
        return { ok: false, message: `Only ${book.stock} ${book.stock === 1 ? 'copy is' : 'copies are'} available.` }
      }
      setCart((prev) => prev.map((item) => (lineMatches(item, bookId, format) ? { ...item, quantity: next } : item)))
      return { ok: true, message: 'Bag updated.' }
    }

    return {
      cart,
      wishlist,
      orders,
      recentlyViewed,
      user,
      coupon,
      cartOpen,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart: (bookId, format) => {
        setCart((prev) => prev.filter((item) => !lineMatches(item, bookId, format)))
      },
      toggleWishlist: (bookId) => {
        const exists = wishlist.some((item) => item.bookId === bookId)
        setWishlist((prev) => (exists ? prev.filter((item) => item.bookId !== bookId) : [...prev, { bookId }]))
        return !exists
      },
      isInWishlist: (bookId) => wishlist.some((item) => item.bookId === bookId),
      isInCart: (bookId) => cart.some((item) => item.bookId === bookId),
      clearCart: () => {
        setCart([])
        setCouponCode('')
      },
      addOrder: (order) => setOrders((prev) => [order, ...prev]),
      applyCoupon: (code) => {
        const found = findCoupon(code)
        if (!found) return { ok: false, message: 'That code is not recognised. Try one of the demo codes below.' }
        const subtotal = cart.reduce((sum, item) => {
          const book = getBookById(item.bookId)
          return book ? sum + getFormatPrice(book, item.format) * item.quantity : sum
        }, 0)
        if (subtotal < found.minSubtotal) {
          return { ok: false, message: `${found.code} needs a minimum subtotal of ₹${found.minSubtotal.toLocaleString('en-IN')}.` }
        }
        setCouponCode(found.code)
        return { ok: true, message: `${found.code} applied — ${found.description}.` }
      },
      removeCoupon: () => setCouponCode(''),
      markViewed: (bookId) => {
        if (!getBookById(bookId)) return
        setRecentlyViewed((prev) => [bookId, ...prev.filter((id) => id !== bookId)].slice(0, 8))
      },
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      signIn: (nextUser) => setUser(nextUser),
      signOut: () => setUser(null),
      getBook: (bookId) => books.find((book) => book.id === bookId),
    }
  }, [cart, wishlist, orders, recentlyViewed, user, coupon, cartOpen])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
