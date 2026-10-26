import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'
import { useDialog } from '../../hooks/useDialog'
import { BookCover } from '../ui/BookCover'
import { Icon } from '../ui/Icon'
import { QuantityStepper } from '../ui/QuantityStepper'
import { formatINR } from '../../utils/format'
import { calculateTotals, getFormatPrice } from '../../utils/pricing'
import type { BookFormat } from '../../types'

export function CartDrawer() {
  const {
    cart,
    coupon,
    cartOpen,
    closeCart,
    getBook,
    updateCartQuantity,
    removeFromCart,
  } = useStore()
  const { showToast } = useToast()
  const panelRef = useDialog(cartOpen, closeCart)

  const lines = cart.flatMap((item) => {
    const book = getBook(item.bookId)
    if (!book) return []
    return [{
      book,
      quantity: item.quantity,
      format: item.format,
      unitPrice: getFormatPrice(book, item.format),
      lineTotal: getFormatPrice(book, item.format) * item.quantity,
    }]
  })
  const totals = calculateTotals(lines, coupon, 'standard')
  const progress = Math.min(100, (totals.subtotal / 1499) * 100)

  const handleRemove = (bookId: string, format: BookFormat | undefined, title: string) => {
    removeFromCart(bookId, format)
    showToast(`Removed “${title}” from your bag.`, 'info')
  }

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'is-open' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside
        ref={panelRef}
        className={`cart-drawer ${cartOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!cartOpen}
        inert={!cartOpen}
        tabIndex={-1}
      >
        <header className="cart-drawer__header">
          <div>
            <span className="eyebrow">Your bag</span>
            <h2 id="cart-drawer-title" className="cart-drawer__title">
              {totals.itemCount === 0 ? 'A little room for stories' : `${totals.itemCount} ${totals.itemCount === 1 ? 'book' : 'books'} chosen`}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={closeCart} aria-label="Close bag">
            <Icon name="close" size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="empty-state__icon" aria-hidden="true">
              <Icon name="bag" size={28} />
            </div>
            <h3>Your bag is waiting</h3>
            <p>Browse the shelves and add something worth staying up late for.</p>
            <Link to="/books" className="btn btn--primary" onClick={closeCart}>
              Explore books
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link to="/wishlist" className="text-link" onClick={closeCart}>
              View your wishlist
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__shipping">
              <div className="cart-drawer__shipping-copy">
                <Icon name="truck" size={16} />
                {totals.freeShippingRemaining > 0 ? (
                  <span>
                    Add <strong>{formatINR(totals.freeShippingRemaining)}</strong> for free delivery
                  </span>
                ) : (
                  <span>You&apos;ve unlocked <strong>free standard delivery</strong></span>
                )}
              </div>
              <div className="shipping-meter" aria-hidden="true">
                <span style={{ transform: `scaleX(${progress / 100})` }} />
              </div>
            </div>

            <div className="cart-drawer__items">
              {lines.map(({ book, quantity, format, unitPrice }) => (
                <article className="drawer-item" key={`${book.id}-${format}`}>
                  <Link to={`/books/${book.slug}`} className="drawer-item__cover" onClick={closeCart} aria-label={`View ${book.title}`}>
                    <BookCover book={book} decorative />
                  </Link>
                  <div className="drawer-item__info">
                    <Link to={`/books/${book.slug}`} className="drawer-item__title" onClick={closeCart}>{book.title}</Link>
                    <span className="drawer-item__author">{book.author}</span>
                    <span className="drawer-item__format">{format}</span>
                    <div className="drawer-item__row">
                      <QuantityStepper
                        value={quantity}
                        max={book.stock}
                        small
                        label={`Quantity for ${book.title}`}
                        onChange={(next) => {
                          const result = updateCartQuantity(book.id, next, format)
                          if (!result.ok) showToast(result.message, 'error')
                        }}
                      />
                      <span className="drawer-item__price">{formatINR(unitPrice * quantity)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="drawer-item__remove"
                    onClick={() => handleRemove(book.id, format, book.title)}
                    aria-label={`Remove ${book.title} from bag`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </article>
              ))}
            </div>

            <footer className="cart-drawer__footer">
              {coupon ? (
                <div className="applied-coupon">
                  <span><Icon name="check" size={13} /> {coupon.code} applied</span>
                  <Link to="/cart" onClick={closeCart}>Manage</Link>
                </div>
              ) : null}
              <div className="totals-row">
                <span>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="totals-row totals-row--discount">
                  <span>Coupon savings</span>
                  <span>−{formatINR(totals.discount)}</span>
                </div>
              ) : null}
              <div className="totals-row">
                <span>Delivery <small>(estimate)</small></span>
                <span>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</span>
              </div>
              <div className="totals-row totals-row--total">
                <span>Total</span>
                <span>{formatINR(totals.total)}</span>
              </div>
              <Link to="/checkout" className="btn btn--primary btn--full" onClick={closeCart}>
                Checkout securely
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link to="/cart" className="btn btn--ghost btn--full" onClick={closeCart}>
                View full bag
              </Link>
              <p className="cart-drawer__note"><Icon name="shield" size={13} /> Demo store — no real payment is taken.</p>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
