export type BookFormat = 'Paperback' | 'Hardcover' | 'eBook' | 'Audiobook'

export interface Book {
  id: string
  slug: string
  title: string
  author: string
  category: string
  subcategory?: string
  price: number
  originalPrice?: number
  cover: string
  rating: number
  reviewsCount: number
  isbn: string
  publisher: string
  pages: number
  language: string
  format: BookFormat[]
  stock: number
  bestseller?: boolean
  newArrival?: boolean
  editorPick?: boolean
  description: string
  highlights: string[]
}

export interface CartItem {
  bookId: string
  quantity: number
}

export interface WishlistItem {
  bookId: string
}

export interface Address {
  id: string
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Order {
  id: string
  items: { book: Book; quantity: number }[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  coupon?: string
  address: Address
  paymentMethod: string
  deliveryMethod: string
  status: 'confirmed' | 'processing' | 'shipped'
  createdAt: string
}
