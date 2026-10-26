import type { Coupon } from '../types'

/**
 * Demo coupons. These are the only codes the checkout accepts and they are
 * intentionally documented in the cart and UI so the experience is honest.
 */
export const coupons: Coupon[] = [
  {
    code: 'WELCOME10',
    description: '10% off your first order over ₹999 (max ₹200 off)',
    type: 'percent',
    value: 10,
    minSubtotal: 999,
    maxDiscount: 200,
  },
  {
    code: 'READ15',
    description: '15% off orders over ₹1,499 (max ₹400 off)',
    type: 'percent',
    value: 15,
    minSubtotal: 1499,
    maxDiscount: 400,
  },
  {
    code: 'SHELF20',
    description: '20% off orders over ₹2,499 (max ₹650 off)',
    type: 'percent',
    value: 20,
    minSubtotal: 2499,
    maxDiscount: 650,
  },
  {
    code: 'FREESHIP',
    description: 'Free standard shipping on orders over ₹499',
    type: 'shipping',
    value: 0,
    minSubtotal: 499,
  },
]

export function findCoupon(code: string) {
  return coupons.find((coupon) => coupon.code.toUpperCase() === code.trim().toUpperCase())
}
