import type { Book, BookFormat, Coupon, DeliveryMethod } from '../types'

export function getFormatPrice(book: Book, format?: BookFormat) {
  const selected = format ?? book.format[0]
  const base = book.format[0]

  if (selected === base) return book.price
  if (selected === 'eBook') return Math.max(99, Math.round(book.price * 0.65))
  if (selected === 'Audiobook') return Math.max(149, Math.round(book.price * 0.85))
  if (selected === 'Hardcover') return book.price + 200
  if (selected === 'Paperback') return Math.max(99, book.price - 150)
  return book.price
}

export function getCheapestPrice(book: Book) {
  return Math.min(...book.format.map((format) => getFormatPrice(book, format)))
}

export interface PricedLine {
  book: Book
  quantity: number
  format?: BookFormat
  unitPrice: number
  lineTotal: number
}

export interface OrderTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
  itemCount: number
  freeShippingRemaining: number
  standardShipping: number
  couponApplied: boolean
  couponMessage?: string
}

export const FREE_SHIPPING_THRESHOLD = 1499
export const STANDARD_SHIPPING = 99
export const EXPRESS_SHIPPING = 149

export function calculateTotals(
  lines: PricedLine[],
  coupon: Coupon | null,
  delivery: DeliveryMethod = 'standard',
): OrderTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  const standardShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING
  let shipping = delivery === 'express' ? EXPRESS_SHIPPING : standardShipping
  let discount = 0
  let couponApplied = false
  let couponMessage: string | undefined

  if (coupon) {
    if (subtotal < coupon.minSubtotal) {
      couponMessage = `Add ${formatAmount(coupon.minSubtotal - subtotal)} more to use ${coupon.code}.`
    } else if (coupon.type === 'percent') {
      discount = Math.round(subtotal * (coupon.value / 100))
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
      couponApplied = true
    } else if (coupon.type === 'shipping') {
      if (delivery === 'standard') {
        shipping = 0
        couponApplied = true
      } else {
        couponMessage = 'This code applies to standard shipping only.'
      }
    }
  }

  const total = Math.max(0, subtotal - discount + shipping)
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return {
    subtotal,
    discount,
    shipping,
    total,
    itemCount,
    freeShippingRemaining,
    standardShipping,
    couponApplied,
    couponMessage,
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getPaymentLabel(method: string) {
  const labels: Record<string, string> = {
    cod: 'Cash on delivery',
    upi: 'UPI (demo)',
    card: 'Card (demo)',
    netbanking: 'Net banking (demo)',
  }
  return labels[method] ?? method
}

export function getDeliveryLabel(method: string) {
  return method === 'express' ? 'Express delivery' : 'Standard delivery'
}

export function getExpectedDelivery(createdAt: string, method: string) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + (method === 'express' ? 2 : 5))
  return date
}
