import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { books } from '../data/books'
import { coupons } from '../data/coupons'
import type { BookFormat } from '../types'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../components/ui/Toast'
import { BookCover } from '../components/ui/BookCover'
import { BookCard } from '../components/books/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { SectionHeading } from '../components/ui/SectionHeading'
import { formatINR } from '../utils/format'
import {
  FREE_SHIPPING_THRESHOLD,
  calculateTotals,
  getFormatPrice,
  type PricedLine,
} from '../utils/pricing'

export default function Cart() {
  const {
    cart,
    coupon,
    getBook,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    isInWishlist,
    applyCoupon,
    removeCoupon,
  } = useStore()
  const { showToast } = useToast()
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useDocumentTitle('Your bag')

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

  const totals = calculateTotals(lines, coupon, 'standard')
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const suggestions = useMemo(
    () =>
      books
        .filter((book) => !cart.some((item) => item.bookId === book.id) && book.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [cart],
  )

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault()
    if (!code.trim()) {
      setFeedback({ type: 'error', message: 'Enter a coupon code first.' })
      return
    }
    const result = applyCoupon(code)
    setFeedback({ type: result.ok ? 'success' : 'error', message: result.message })
    if (result.ok) {
      setCode('')
      showToast(result.message, 'success')
    }
  }

  const handleRemove = (bookId: string, format: BookFormat | undefined, title: string) => {
    removeFromCart(bookId, format)
    showToast(`Removed “${title}” from your bag.`, 'info')
  }

  const handleMove = (bookId: string, format: BookFormat | undefined, title: string) => {
    const alreadySaved = isInWishlist(bookId)
    if (!alreadySaved) toggleWishlist(bookId)
    removeFromCart(bookId, format)
    showToast(
      alreadySaved
        ? `Removed “${title}” from your bag. It was already on your wishlist.`
        : `Moved “${title}” to your wishlist.`,
      'wishlist',
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <PageHeader
          eyebrow="Your bag"
          title={lines.length === 0 ? 'A little room for stories' : `${totals.itemCount} ${totals.itemCount === 1 ? 'book' : 'books'}, ready when you are`}
          description={
            lines.length === 0
              ? 'Your bag is empty for now. The shelves, however, are full.'
              : 'Review your editions, adjust quantities and apply a demo coupon. Nothing is charged until you place a demo order.'
          }
        />

        {lines.length === 0 ? (
          <>
            <EmptyState
              icon="bag"
              eyebrow="Nothing here yet"
              title="Your bag is waiting"
              description="Add a book or two and we will keep them here for you. Your bag is saved on this device, so you can come back to it later."
              action={
                <div className="empty-state__buttons">
                  <Link to="/books" className="btn btn--primary">Explore the shelves</Link>
                  <Link to="/wishlist" className="btn btn--outline">View your wishlist</Link>
                </div>
              }
            />
            <section className="section cart-suggestions">
              <SectionHeading
                eyebrow="A good place to begin"
                title="Books our readers are loving"
                description="Four titles with a strong record of keeping people up past bedtime."
                actionLabel="Browse all books"
                actionTo="/books"
              />
              <div className="book-grid book-grid--four">
                {suggestions.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            </section>
          </>
        ) : (
          <div className="cart-layout">
            <div className="cart-main">
              <div className="cart-shipping">
                <div className="cart-shipping__copy">
                  <span className="cart-shipping__icon"><Icon name={totals.freeShippingRemaining > 0 ? 'truck' : 'check'} size={18} /></span>
                  <div>
                    {totals.freeShippingRemaining > 0 ? (
                      <>
                        <strong>Add {formatINR(totals.freeShippingRemaining)} for free standard delivery.</strong>
                        <span>Orders over {formatINR(FREE_SHIPPING_THRESHOLD)} are delivered on us.</span>
                      </>
                    ) : (
                      <>
                        <strong>Free standard delivery unlocked.</strong>
                        <span>Your order qualifies for complimentary delivery.</span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="shipping-meter shipping-meter--large"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={FREE_SHIPPING_THRESHOLD}
                  aria-valuenow={Math.min(totals.subtotal, FREE_SHIPPING_THRESHOLD)}
                  aria-label="Progress toward free delivery"
                >
                  <span style={{ transform: `scaleX(${progress / 100})` }} />
                </div>
              </div>

              <div className="cart-list">
                {lines.map((line) => {
                  const { book, quantity, format, unitPrice } = line
                  const outOfStock = book.stock <= 0
                  return (
                    <article className="cart-line" key={`${book.id}-${format}`}>
                      <Link to={`/books/${book.slug}`} className="cart-line__cover" aria-label={`View ${book.title}`}>
                        <BookCover book={book} decorative />
                      </Link>

                      <div className="cart-line__info">
                        <div className="cart-line__top">
                          <div>
                            <span className="cart-line__category">{book.category}</span>
                            <h2 className="cart-line__title">
                              <Link to={`/books/${book.slug}`}>{book.title}</Link>
                            </h2>
                            <p className="cart-line__author">by {book.author}</p>
                            <span className="cart-line__format">
                              <Icon name={format === 'eBook' || format === 'Audiobook' ? 'book' : 'package'} size={13} />
                              {format}
                            </span>
                          </div>
                          <div className="cart-line__price">
                            <strong>{formatINR(line.lineTotal)}</strong>
                            <span>{formatINR(unitPrice)} each</span>
                          </div>
                        </div>

                        <div className="cart-line__actions">
                          <QuantityStepper
                            value={quantity}
                            max={book.stock}
                            label={`Quantity for ${book.title}`}
                            onChange={(next) => {
                              const result = updateCartQuantity(book.id, next, format)
                              if (!result.ok) showToast(result.message, 'error')
                            }}
                          />
                          <div className="cart-line__links">
                            <button type="button" className="text-button" onClick={() => handleMove(book.id, format, book.title)}>
                              <Icon name="heart" size={14} />
                              Move to wishlist
                            </button>
                            <button type="button" className="text-button text-button--muted" onClick={() => handleRemove(book.id, format, book.title)}>
                              <Icon name="trash" size={14} />
                              Remove
                            </button>
                          </div>
                        </div>

                        {outOfStock ? (
                          <p className="cart-line__warning">
                            <Icon name="close" size={13} /> This title has gone out of stock. Please remove it to continue.
                          </p>
                        ) : book.stock <= 5 ? (
                          <p className="cart-line__note">Only {book.stock} left in stock — your quantity is reserved in this demo bag only.</p>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="cart-actions">
                <Link to="/books" className="btn btn--outline">
                  <Icon name="arrow-left" size={16} />
                  Continue browsing
                </Link>
                <span className="cart-actions__note">
                  <Icon name="shield" size={14} /> Demo store · no real payment is taken
                </span>
              </div>

              <section className="coupon-panel" aria-labelledby="coupon-title">
                <div className="coupon-panel__head">
                  <div>
                    <h2 id="coupon-title">Have a code?</h2>
                    <p>These demo codes are the only ones accepted — no surprises at checkout.</p>
                  </div>
                  {coupon ? (
                    <div className="applied-coupon applied-coupon--large">
                      <span><Icon name="check" size={14} /> {coupon.code} applied</span>
                      <button
                        type="button"
                        onClick={() => {
                          removeCoupon()
                          setFeedback(null)
                          showToast('Coupon removed from your bag.', 'info')
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>

                {!coupon ? (
                  <form className="coupon-form" onSubmit={handleApply} noValidate>
                    <label className="sr-only" htmlFor="coupon-code">Coupon code</label>
                    <input
                      id="coupon-code"
                      className="input"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value.toUpperCase())
                        if (feedback) setFeedback(null)
                      }}
                      placeholder="Enter a demo code"
                      autoComplete="off"
                      aria-invalid={feedback?.type === 'error'}
                      aria-describedby={feedback ? 'coupon-feedback' : 'coupon-help'}
                    />
                    <button type="submit" className="btn btn--primary">Apply code</button>
                  </form>
                ) : null}

                {feedback ? (
                  <p id="coupon-feedback" className={`inline-feedback inline-feedback--${feedback.type}`} role="status">
                    <Icon name={feedback.type === 'success' ? 'check' : 'close'} size={14} />
                    {feedback.message}
                  </p>
                ) : null}

                {totals.couponMessage ? (
                  <p className="inline-feedback inline-feedback--error">
                    <Icon name="close" size={14} />
                    {totals.couponMessage}
                  </p>
                ) : null}

                <div className="coupon-list" id="coupon-help">
                  {coupons.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`coupon-chip ${coupon?.code === item.code ? 'is-active' : ''}`}
                      onClick={() => {
                        setCode(item.code)
                        const result = applyCoupon(item.code)
                        setFeedback({ type: result.ok ? 'success' : 'error', message: result.message })
                        if (result.ok) showToast(result.message, 'success')
                      }}
                    >
                      <strong>{item.code}</strong>
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <aside className="cart-summary" aria-labelledby="summary-title">
              <h2 id="summary-title">Order summary</h2>

              <div className="summary-lines">
                <div className="totals-row">
                  <span>Subtotal · {totals.itemCount} {totals.itemCount === 1 ? 'book' : 'books'}</span>
                  <span>{formatINR(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 ? (
                  <div className="totals-row totals-row--discount">
                    <span>Coupon {coupon?.code}</span>
                    <span>−{formatINR(totals.discount)}</span>
                  </div>
                ) : null}
                <div className="totals-row">
                  <span>Standard delivery</span>
                  <span>{totals.standardShipping === 0 ? 'Free' : formatINR(totals.standardShipping)}</span>
                </div>
                <div className="totals-row">
                  <span>Estimated tax</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="totals-row totals-row--total">
                <span>Total</span>
                <span>{formatINR(totals.total)}</span>
              </div>

              {totals.freeShippingRemaining > 0 ? (
                <p className="cart-summary__hint">
                  <Icon name="truck" size={14} />
                  Add {formatINR(totals.freeShippingRemaining)} for free delivery.
                </p>
              ) : (
                <p className="cart-summary__hint cart-summary__hint--success">
                  <Icon name="check" size={14} />
                  Free standard delivery included.
                </p>
              )}

              <Link to="/checkout" className="btn btn--primary btn--full btn--large">
                Proceed to checkout
                <Icon name="arrow-right" size={17} />
              </Link>

              <p className="cart-summary__note">
                <Icon name="lock" size={14} />
                This is a frontend demonstration. No card details are collected and no payment is processed.
              </p>

              <div className="cart-summary__perks">
                <span><Icon name="refresh" size={14} /> 30-day returns</span>
                <span><Icon name="gift" size={14} /> Gift-ready wrapping</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
