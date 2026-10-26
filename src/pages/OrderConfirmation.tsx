import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { BookCover } from '../components/ui/BookCover'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { formatINR } from '../utils/format'
import {
  getDeliveryLabel,
  getExpectedDelivery,
  getFormatPrice,
  getPaymentLabel,
} from '../utils/pricing'

export default function OrderConfirmation() {
  const { orderId = '' } = useParams()
  const { orders } = useStore()
  const order = useMemo(() => orders.find((item) => item.id === orderId), [orders, orderId])

  useDocumentTitle(order ? `Order ${order.id}` : 'Order not found')

  if (!order) {
    return (
      <div className="section">
        <div className="container">
          <EmptyState
            icon="package"
            eyebrow="Order not found"
            title="We can't find that demo order"
            description="It may have been placed in a different browser, or the link may be incomplete. Demo orders are stored only on the device that created them."
            action={
              <div className="empty-state__buttons">
                <Link to="/account" className="btn btn--primary">View your account</Link>
                <Link to="/books" className="btn btn--outline">Continue shopping</Link>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  const expected = getExpectedDelivery(order.createdAt, order.deliveryMethod)
  const expectedLabel = expected.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const timeline = ['confirmed', 'processing', 'shipped'] as const

  return (
    <div className="order-page">
      <div className="container">
        <section className="order-hero">
          <span className="order-hero__icon" aria-hidden="true"><Icon name="check" size={30} /></span>
          <span className="eyebrow">Demo order confirmed</span>
          <h1>Thank you, {order.address.fullName.split(' ')[0]}.</h1>
          <p>
            Your demo order <strong>#{order.id}</strong> is recorded on this device. No payment was taken
            and no books will ship — but the reading list is real enough.
          </p>
          <div className="order-hero__meta">
            <div>
              <span>Order placed</span>
              <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div>
              <span>Expected delivery</span>
              <strong>{expectedLabel}</strong>
            </div>
            <div>
              <span>Order total</span>
              <strong>{formatINR(order.total)}</strong>
            </div>
          </div>
          <div className="order-hero__actions">
            <Link to="/account" className="btn btn--primary">View your account</Link>
            <Link to="/books" className="btn btn--outline">Continue shopping</Link>
          </div>
        </section>

        <div className="order-layout">
          <div className="order-main">
            <section className="order-card" aria-labelledby="order-items-title">
              <div className="order-card__head">
                <h2 id="order-items-title">{itemCount} {itemCount === 1 ? 'book' : 'books'} in this order</h2>
                <span className="badge badge--soft">{getDeliveryLabel(order.deliveryMethod)}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <article className="order-item" key={`${item.book.id}-${item.format}`}>
                    <Link to={`/books/${item.book.slug}`} className="order-item__cover">
                      <BookCover book={item.book} decorative />
                    </Link>
                    <div className="order-item__copy">
                      <Link to={`/books/${item.book.slug}`} className="order-item__title">{item.book.title}</Link>
                      <span>{item.book.author}</span>
                      <span>{item.format ?? item.book.format[0]} · Qty {item.quantity}</span>
                    </div>
                    <span className="order-item__price">
                      {formatINR((item.unitPrice ?? getFormatPrice(item.book, item.format)) * item.quantity)}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="order-card" aria-labelledby="order-track-title">
              <h2 id="order-track-title">Order status</h2>
              <p className="order-card__note">
                Demo tracking only. Status will not advance because no fulfilment system is connected.
              </p>
              <ol className="order-timeline">
                {timeline.map((status) => {
                  const currentIndex = timeline.indexOf(order.status)
                  const index = timeline.indexOf(status)
                  const state = index < currentIndex ? 'is-done' : index === currentIndex ? 'is-current' : ''
                  return (
                    <li key={status} className={state}>
                      <span className="order-timeline__dot" aria-hidden="true">
                        {index <= currentIndex ? <Icon name="check" size={12} /> : null}
                      </span>
                      <div>
                        <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
                        <span>
                          {status === 'confirmed' && 'Order recorded on this device'}
                          {status === 'processing' && 'Would be packed by our booksellers'}
                          {status === 'shipped' && 'Would be on its way to you'}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>

          <aside className="order-side">
            <section className="order-card" aria-labelledby="order-summary-title">
              <h2 id="order-summary-title">Summary</h2>
              <div className="summary-lines">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                {order.discount > 0 ? (
                  <div className="totals-row totals-row--discount">
                    <span>Coupon {order.coupon}</span>
                    <span>−{formatINR(order.discount)}</span>
                  </div>
                ) : null}
                <div className="totals-row">
                  <span>Delivery</span>
                  <span>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</span>
                </div>
                <div className="totals-row">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>
              <div className="totals-row totals-row--total">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
              <p className="order-card__note">
                <Icon name="shield" size={14} /> Demo order · no payment was taken
              </p>
            </section>

            <section className="order-card" aria-labelledby="order-delivery-title">
              <h2 id="order-delivery-title">Delivery</h2>
              <div className="order-address">
                <strong>{order.address.fullName}</strong>
                <span>{order.address.addressLine1}</span>
                {order.address.addressLine2 ? <span>{order.address.addressLine2}</span> : null}
                <span>{order.address.city}, {order.address.state} {order.address.pincode}</span>
                <span>{order.address.country}</span>
                <span className="order-address__contact">{order.address.email} · +91 {order.address.phone}</span>
              </div>
              <div className="order-payment">
                <span>Payment</span>
                <strong>{getPaymentLabel(order.paymentMethod)}</strong>
              </div>
              <div className="order-payment">
                <span>Delivery</span>
                <strong>{getDeliveryLabel(order.deliveryMethod)}</strong>
              </div>
            </section>

            <div className="order-side__help">
              <Icon name="mail" size={18} />
              <p>Questions about this demo order? <Link to="/contact">Write to our booksellers</Link>.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
