import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { DeliveryMethod } from '../types'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../components/ui/Toast'
import { BookCover } from '../components/ui/BookCover'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { formatINR } from '../utils/format'
import {
  EXPRESS_SHIPPING,
  calculateTotals,
  getDeliveryLabel,
  getFormatPrice,
  getPaymentLabel,
  type PricedLine,
} from '../utils/pricing'
import { isValidEmail, isValidPhone, isValidPincode, required } from '../utils/validation'

interface CheckoutForm {
  email: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  country: string
  delivery: DeliveryMethod
  payment: string
  giftNote: string
}

type StepKey = 'email' | 'fullName' | 'phone' | 'addressLine1' | 'city' | 'state' | 'pincode' | 'country'

const steps = ['Contact', 'Address', 'Delivery', 'Payment', 'Review'] as const

const payments = [
  { id: 'upi', title: 'UPI', note: 'Pay by UPI app — demo only', icon: 'phone' as const },
  { id: 'card', title: 'Credit or debit card', note: 'No card details are collected', icon: 'credit-card' as const },
  { id: 'netbanking', title: 'Net banking', note: 'Choose your bank — demo only', icon: 'lock' as const },
  { id: 'cod', title: 'Cash on delivery', note: 'Pay when your books arrive — demo only', icon: 'truck' as const },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, coupon, clearCart, addOrder, getBook } = useStore()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<StepKey, string>>>({})
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    delivery: 'standard',
    payment: 'upi',
    giftNote: '',
  })

  useDocumentTitle('Checkout')

  const lines: PricedLine[] = useMemo(
    () =>
      cart.flatMap((item) => {
        const book = getBook(item.bookId)
        if (!book) return []
        const unitPrice = getFormatPrice(book, item.format)
        return [{ book, quantity: item.quantity, format: item.format, unitPrice, lineTotal: unitPrice * item.quantity }]
      }),
    [cart, getBook],
  )

  const totals = calculateTotals(lines, coupon, form.delivery)

  const setField = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key as StepKey]
        return next
      })
    }
  }

  const validateStep = (target: number) => {
    const nextErrors: Partial<Record<StepKey, string>> = {}
    if (target === 1) {
      if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address, such as reader@example.com.'
      if (!required(form.fullName, 2)) nextErrors.fullName = 'Please tell us who the books are for.'
      if (!isValidPhone(form.phone)) nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
    }
    if (target === 2) {
      if (!required(form.addressLine1, 4)) nextErrors.addressLine1 = 'Enter a street address.'
      if (!required(form.city, 2)) nextErrors.city = 'Enter a city.'
      if (!required(form.state, 2)) nextErrors.state = 'Enter a state.'
      if (!isValidPincode(form.pincode)) nextErrors.pincode = 'Enter a valid 6-digit pincode.'
      if (!required(form.country, 2)) nextErrors.country = 'Enter a country.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const continueTo = (target: number) => {
    if (!validateStep(step)) return
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = (target: number) => {
    setErrors({})
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const placeOrder = async (event: FormEvent) => {
    event.preventDefault()
    if (placing) return

    for (const target of [1, 2]) {
      if (!validateStep(target)) {
        setStep(target)
        return
      }
    }

    setPlacing(true)
    await new Promise((resolve) => window.setTimeout(resolve, 900))

    const createdAt = new Date().toISOString()
    const orderId = `HB-${Date.now().toString().slice(-6)}`
    addOrder({
      id: orderId,
      items: lines.map((line) => ({
        book: line.book,
        quantity: line.quantity,
        format: line.format,
        unitPrice: line.unitPrice,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      coupon: coupon?.code,
      address: {
        id: `addr-${Date.now()}`,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
      },
      paymentMethod: form.payment,
      deliveryMethod: form.delivery,
      status: 'confirmed',
      createdAt,
    })
    clearCart()
    showToast('Demo order placed. Your confirmation is ready.', 'success')
    navigate(`/order-confirmation/${orderId}`)
  }

  if (lines.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="sr-only">Checkout</h1>
          <EmptyState
            icon="bag"
            eyebrow="Checkout"
            title="There is nothing to check out yet"
            description="Your bag is empty. Add a book first — your order summary will appear here once there is something worth wrapping."
            action={
              <div className="empty-state__buttons">
                <Link to="/books" className="btn btn--primary">Browse all books</Link>
                <Link to="/wishlist" className="btn btn--outline">View your wishlist</Link>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  const progress = ((step - 1) / (steps.length - 1)) * 100
  const addressLine = [form.addressLine1, form.addressLine2, form.city, form.state, form.pincode, form.country]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="checkout-page">
      <div className="container">
        <PageHeader
          eyebrow="Checkout"
          title="A few details, then your books"
          description="This is a complete frontend demonstration. No payment is taken and no order is fulfilled."
          backTo="/cart"
          backLabel="Back to bag"
        />

        <ol className="checkout-steps" aria-label="Checkout progress">
          {steps.map((label, index) => {
            const number = index + 1
            const state = number < step ? 'is-complete' : number === step ? 'is-active' : ''
            return (
              <li key={label} className={state}>
                <button
                  type="button"
                  onClick={() => number < step && goBack(number)}
                  disabled={number >= step}
                  aria-current={number === step ? 'step' : undefined}
                >
                  <span className="checkout-steps__number">
                    {number < step ? <Icon name="check" size={13} /> : number}
                  </span>
                  <span className="checkout-steps__label">{label}</span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="checkout-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="checkout-layout">
          <form className="checkout-panel" onSubmit={placeOrder} noValidate>
            {step === 1 ? (
              <section className="checkout-step" aria-labelledby="step-contact">
                <div className="checkout-step__head">
                  <span className="checkout-step__index">01</span>
                  <div>
                    <h2 id="step-contact">Contact details</h2>
                    <p>We use these only to confirm this demo order on screen.</p>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-email">Email address</label>
                  <input
                    id="checkout-email"
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                    placeholder="reader@example.com"
                  />
                  {errors.email ? <p className="form-error" id="checkout-email-error">{errors.email}</p> : null}
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-name">Full name</label>
                  <input
                    id="checkout-name"
                    className="input"
                    value={form.fullName}
                    onChange={(event) => setField('fullName', event.target.value)}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'checkout-name-error' : undefined}
                    placeholder="Who are the books for?"
                  />
                  {errors.fullName ? <p className="form-error" id="checkout-name-error">{errors.fullName}</p> : null}
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-phone">Mobile number</label>
                  <div className="input-with-prefix">
                    <span>+91</span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                      autoComplete="tel-national"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'checkout-phone-error' : 'checkout-phone-help'}
                      placeholder="98765 43210"
                    />
                  </div>
                  {errors.phone ? <p className="form-error" id="checkout-phone-error">{errors.phone}</p> : (
                    <p className="form-help" id="checkout-phone-help">A 10-digit Indian mobile number, for demo purposes only.</p>
                  )}
                </div>

                <div className="checkout-step__actions">
                  <Link to="/cart" className="btn btn--ghost">
                    <Icon name="arrow-left" size={16} />
                    Back to bag
                  </Link>
                  <button type="button" className="btn btn--primary" onClick={() => continueTo(2)}>
                    Continue to address
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="checkout-step" aria-labelledby="step-address">
                <div className="checkout-step__head">
                  <span className="checkout-step__index">02</span>
                  <div>
                    <h2 id="step-address">Delivery address</h2>
                    <p>This demo stores the address on this device only.</p>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-address1">Street address</label>
                  <input
                    id="checkout-address1"
                    className="input"
                    value={form.addressLine1}
                    onChange={(event) => setField('addressLine1', event.target.value)}
                    autoComplete="address-line1"
                    aria-invalid={Boolean(errors.addressLine1)}
                    aria-describedby={errors.addressLine1 ? 'checkout-address1-error' : undefined}
                    placeholder="House or flat number, street"
                  />
                  {errors.addressLine1 ? <p className="form-error" id="checkout-address1-error">{errors.addressLine1}</p> : null}
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-address2">Apartment, landmark <span>(optional)</span></label>
                  <input
                    id="checkout-address2"
                    className="input"
                    value={form.addressLine2}
                    onChange={(event) => setField('addressLine2', event.target.value)}
                    autoComplete="address-line2"
                    placeholder="Near the old bookshop, perhaps"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="checkout-city">City</label>
                    <input
                      id="checkout-city"
                      className="input"
                      value={form.city}
                      onChange={(event) => setField('city', event.target.value)}
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errors.city)}
                      aria-describedby={errors.city ? 'checkout-city-error' : undefined}
                      placeholder="City"
                    />
                    {errors.city ? <p className="form-error" id="checkout-city-error">{errors.city}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="checkout-state">State</label>
                    <input
                      id="checkout-state"
                      className="input"
                      value={form.state}
                      onChange={(event) => setField('state', event.target.value)}
                      autoComplete="address-level1"
                      aria-invalid={Boolean(errors.state)}
                      aria-describedby={errors.state ? 'checkout-state-error' : undefined}
                      placeholder="State"
                    />
                    {errors.state ? <p className="form-error" id="checkout-state-error">{errors.state}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="checkout-pincode">Pincode</label>
                    <input
                      id="checkout-pincode"
                      className="input"
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(event) => setField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))}
                      autoComplete="postal-code"
                      aria-invalid={Boolean(errors.pincode)}
                      aria-describedby={errors.pincode ? 'checkout-pincode-error' : undefined}
                      placeholder="110001"
                    />
                    {errors.pincode ? <p className="form-error" id="checkout-pincode-error">{errors.pincode}</p> : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="checkout-country">Country</label>
                    <input
                      id="checkout-country"
                      className="input"
                      value={form.country}
                      onChange={(event) => setField('country', event.target.value)}
                      autoComplete="country-name"
                      aria-invalid={Boolean(errors.country)}
                      aria-describedby={errors.country ? 'checkout-country-error' : undefined}
                    />
                    {errors.country ? <p className="form-error" id="checkout-country-error">{errors.country}</p> : null}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="checkout-gift">Gift note <span>(optional)</span></label>
                  <textarea
                    id="checkout-gift"
                    className="input textarea"
                    value={form.giftNote}
                    onChange={(event) => setField('giftNote', event.target.value)}
                    placeholder="A line for the gift card — demo only, not printed."
                    rows={3}
                  />
                </div>

                <div className="checkout-step__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => goBack(1)}>
                    <Icon name="arrow-left" size={16} />
                    Back
                  </button>
                  <button type="button" className="btn btn--primary" onClick={() => continueTo(3)}>
                    Continue to delivery
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="checkout-step" aria-labelledby="step-delivery">
                <div className="checkout-step__head">
                  <span className="checkout-step__index">03</span>
                  <div>
                    <h2 id="step-delivery">Delivery method</h2>
                    <p>Delivery timings are illustrative for this demo.</p>
                  </div>
                </div>

                <div className="option-list">
                  <label className={`option-card ${form.delivery === 'standard' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={form.delivery === 'standard'}
                      onChange={() => setField('delivery', 'standard')}
                    />
                    <span className="option-card__mark" aria-hidden="true" />
                    <span className="option-card__copy">
                      <strong>Standard delivery</strong>
                      <span>3–5 business days · tracked</span>
                    </span>
                    <span className="option-card__price">
                      {totals.standardShipping === 0 ? 'Free' : formatINR(totals.standardShipping)}
                    </span>
                  </label>

                  <label className={`option-card ${form.delivery === 'express' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={form.delivery === 'express'}
                      onChange={() => setField('delivery', 'express')}
                    />
                    <span className="option-card__mark" aria-hidden="true" />
                    <span className="option-card__copy">
                      <strong>Express delivery</strong>
                      <span>1–2 business days · prioritised</span>
                    </span>
                    <span className="option-card__price">{formatINR(EXPRESS_SHIPPING)}</span>
                  </label>
                </div>

                <p className="form-help">
                  <Icon name="truck" size={14} /> Free standard delivery applies to orders over ₹1,499. Express delivery is always charged.
                </p>

                <div className="checkout-step__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => goBack(2)}>
                    <Icon name="arrow-left" size={16} />
                    Back
                  </button>
                  <button type="button" className="btn btn--primary" onClick={() => continueTo(4)}>
                    Continue to payment
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="checkout-step" aria-labelledby="step-payment">
                <div className="checkout-step__head">
                  <span className="checkout-step__index">04</span>
                  <div>
                    <h2 id="step-payment">Payment method</h2>
                    <p>Demo only. No payment details are collected and nothing is charged.</p>
                  </div>
                </div>

                <div className="payment-list">
                  {payments.map((payment) => (
                    <label key={payment.id} className={`option-card option-card--payment ${form.payment === payment.id ? 'is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={form.payment === payment.id}
                        onChange={() => setField('payment', payment.id)}
                      />
                      <span className="option-card__icon" aria-hidden="true"><Icon name={payment.icon} size={18} /></span>
                      <span className="option-card__copy">
                        <strong>{payment.title}</strong>
                        <span>{payment.note}</span>
                      </span>
                      <span className="option-card__mark" aria-hidden="true" />
                    </label>
                  ))}
                </div>

                <div className="demo-notice">
                  <Icon name="shield" size={18} />
                  <p>
                    <strong>No real payment is processed.</strong>
                    {' '}This checkout demonstrates the flow only. Do not enter real card or banking details anywhere on this site.
                  </p>
                </div>

                <div className="checkout-step__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => goBack(3)}>
                    <Icon name="arrow-left" size={16} />
                    Back
                  </button>
                  <button type="button" className="btn btn--primary" onClick={() => continueTo(5)}>
                    Review your order
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </section>
            ) : null}

            {step === 5 ? (
              <section className="checkout-step" aria-labelledby="step-review">
                <div className="checkout-step__head">
                  <span className="checkout-step__index">05</span>
                  <div>
                    <h2 id="step-review">Review and place your demo order</h2>
                    <p>Check the details below. You can go back and edit anything before placing the order.</p>
                  </div>
                </div>

                <div className="review-blocks">
                  <div className="review-block">
                    <div className="review-block__head">
                      <h3>Contact</h3>
                      <button type="button" className="text-button" onClick={() => goBack(1)}>Edit</button>
                    </div>
                    <p>{form.fullName}</p>
                    <p>{form.email} · +91 {form.phone}</p>
                  </div>

                  <div className="review-block">
                    <div className="review-block__head">
                      <h3>Deliver to</h3>
                      <button type="button" className="text-button" onClick={() => goBack(2)}>Edit</button>
                    </div>
                    <p>{addressLine}</p>
                    {form.giftNote ? <p className="review-block__note">Gift note: “{form.giftNote}”</p> : null}
                  </div>

                  <div className="review-block">
                    <div className="review-block__head">
                      <h3>Delivery &amp; payment</h3>
                      <button type="button" className="text-button" onClick={() => goBack(3)}>Edit</button>
                    </div>
                    <p>{getDeliveryLabel(form.delivery)}</p>
                    <p>{getPaymentLabel(form.payment)}</p>
                  </div>
                </div>

                <div className="review-items">
                  <h3>Your books</h3>
                  {lines.map((line) => (
                    <div className="review-item" key={`${line.book.id}-${line.format}`}>
                      <span className="review-item__cover"><BookCover book={line.book} decorative /></span>
                      <div className="review-item__copy">
                        <strong>{line.book.title}</strong>
                        <span>{line.book.author} · {line.format} · Qty {line.quantity}</span>
                      </div>
                      <span>{formatINR(line.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="demo-notice demo-notice--calm">
                  <Icon name="check" size={18} />
                  <p>
                    Placing this order will save a demo confirmation on this device. No email will be sent,
                    no payment will be taken, and no books will be shipped.
                  </p>
                </div>

                <div className="checkout-step__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => goBack(4)} disabled={placing}>
                    <Icon name="arrow-left" size={16} />
                    Back
                  </button>
                  <button type="submit" className={`btn btn--primary btn--large ${placing ? 'is-loading' : ''}`} disabled={placing}>
                    {placing ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Placing demo order…
                      </>
                    ) : (
                      <>
                        Place demo order · {formatINR(totals.total)}
                        <Icon name="arrow-right" size={17} />
                      </>
                    )}
                  </button>
                </div>
              </section>
            ) : null}
          </form>

          <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
            <div className="checkout-summary__head">
              <h2 id="checkout-summary-title">Your order</h2>
              <Link to="/cart" className="text-link">Edit bag</Link>
            </div>

            <div className="checkout-summary__items">
              {lines.map((line) => (
                <div className="summary-item" key={`${line.book.id}-${line.format}`}>
                  <span className="summary-item__cover"><BookCover book={line.book} decorative /></span>
                  <div className="summary-item__copy">
                    <strong>{line.book.title}</strong>
                    <span>{line.format} · Qty {line.quantity}</span>
                  </div>
                  <span className="summary-item__price">{formatINR(line.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="summary-lines">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="totals-row totals-row--discount">
                  <span>Coupon {coupon?.code}</span>
                  <span>−{formatINR(totals.discount)}</span>
                </div>
              ) : null}
              <div className="totals-row">
                <span>{getDeliveryLabel(form.delivery)}</span>
                <span>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</span>
              </div>
              <div className="totals-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
            </div>

            <div className="totals-row totals-row--total">
              <span>Total</span>
              <span>{formatINR(totals.total)}</span>
            </div>

            {totals.couponMessage ? (
              <p className="inline-feedback inline-feedback--error">
                <Icon name="close" size={14} />
                {totals.couponMessage}
              </p>
            ) : null}

            <p className="checkout-summary__note">
              <Icon name="shield" size={14} />
              Demo checkout. No payment details are requested or stored.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
