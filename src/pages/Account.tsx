import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBookById } from '../data/books'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../components/ui/Toast'
import { BookCover } from '../components/ui/BookCover'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { formatINR } from '../utils/format'
import { getDeliveryLabel, getPaymentLabel } from '../utils/pricing'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export default function Account() {
  const { user, orders, wishlist, recentlyViewed, cartCount, signOut } = useStore()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useDocumentTitle('Your account')

  const wishlistBooks = useMemo(
    () =>
      wishlist
        .map((item) => getBookById(item.bookId))
        .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book))
        .slice(0, 4),
    [wishlist],
  )
  const recentBooks = useMemo(
    () =>
      recentlyViewed
        .map((id) => getBookById(id))
        .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book))
        .slice(0, 4),
    [recentlyViewed],
  )

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const lastOrder = orders[0]
  const latestAddress = lastOrder?.address
  const displayName = user?.name ?? 'Demo Reader'
  const displayEmail = user?.email ?? 'reader@hawthorn.demo'

  const handleSignOut = () => {
    signOut()
    showToast('Signed out of the demo account. Your bag and orders stay on this device.', 'info')
    navigate('/login')
  }

  return (
    <div className="account-page">
      <div className="container">
        <PageHeader
          eyebrow="Account"
          title={`Hello, ${displayName.split(' ')[0]}`}
          description="A quiet corner for your orders, saved books and reading trail. Everything here is stored on this device only — this is a frontend demonstration."
        />

        <div className="account-hero">
          <div className="account-identity">
            <span className="account-identity__avatar" aria-hidden="true">{initials(displayName)}</span>
            <div>
              <strong>{displayName}</strong>
              <span>{displayEmail}</span>
              <span className="account-identity__badge">
                <Icon name={user ? 'check' : 'user'} size={12} />
                {user ? 'Signed in · demo account' : 'Browsing as a demo reader'}
              </span>
            </div>
          </div>
          <div className="account-hero__actions">
            {user ? (
              <button type="button" className="btn btn--outline" onClick={handleSignOut}>Sign out</button>
            ) : (
              <>
                <Link to="/login" className="btn btn--primary">Sign in</Link>
                <Link to="/register" className="btn btn--outline">Create account</Link>
              </>
            )}
          </div>
        </div>

        <div className="account-stats">
          <Link to="/account#orders" className="account-stat">
            <span className="account-stat__icon"><Icon name="package" size={19} /></span>
            <span>{orders.length}</span>
            <small>Demo orders</small>
          </Link>
          <Link to="/wishlist" className="account-stat">
            <span className="account-stat__icon"><Icon name="heart" size={19} /></span>
            <span>{wishlist.length}</span>
            <small>Saved books</small>
          </Link>
          <Link to="/cart" className="account-stat">
            <span className="account-stat__icon"><Icon name="bag" size={19} /></span>
            <span>{cartCount}</span>
            <small>Books in bag</small>
          </Link>
          <div className="account-stat">
            <span className="account-stat__icon"><Icon name="star" size={19} /></span>
            <span>{formatINR(totalSpent)}</span>
            <small>Demo order value</small>
          </div>
        </div>

        <div className="account-layout">
          <div className="account-main">
            <section className="account-card" id="orders" aria-labelledby="orders-title">
              <div className="account-card__head">
                <div>
                  <span className="eyebrow">Order history</span>
                  <h2 id="orders-title">Your demo orders</h2>
                </div>
                {orders.length > 0 ? <span className="badge badge--soft">{orders.length} total</span> : null}
              </div>

              {orders.length === 0 ? (
                <div className="account-empty">
                  <Icon name="package" size={26} />
                  <div>
                    <strong>No orders yet</strong>
                    <p>Place a demo order at checkout and it will appear here, stored on this device.</p>
                  </div>
                  <Link to="/books" className="btn btn--outline btn--small">Browse books</Link>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map((order) => {
                    const count = order.items.reduce((sum, item) => sum + item.quantity, 0)
                    return (
                      <article className="order-row" key={order.id}>
                        <div className="order-row__covers" aria-hidden="true">
                          {order.items.slice(0, 3).map((item) => (
                            <span key={`${item.book.id}-${item.format}`} className="order-row__cover">
                              <BookCover book={item.book} decorative />
                            </span>
                          ))}
                        </div>
                        <div className="order-row__copy">
                          <Link to={`/orders/${order.id}`} className="order-row__id">#{order.id}</Link>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {' · '}
                            {count} {count === 1 ? 'book' : 'books'}
                          </span>
                          <span className="order-row__meta">
                            {getDeliveryLabel(order.deliveryMethod)} · {getPaymentLabel(order.paymentMethod)}
                          </span>
                        </div>
                        <div className="order-row__side">
                          <strong>{formatINR(order.total)}</strong>
                          <span className={`status-pill status-pill--${order.status}`}>{order.status}</span>
                          <Link to={`/orders/${order.id}`} className="text-link">
                            View order <Icon name="arrow-right" size={14} />
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="account-card" aria-labelledby="trail-title">
              <div className="account-card__head">
                <div>
                  <span className="eyebrow">Your reading trail</span>
                  <h2 id="trail-title">Recently viewed</h2>
                </div>
                <Link to="/books" className="text-link">Find more <Icon name="arrow-right" size={14} /></Link>
              </div>

              {recentBooks.length === 0 ? (
                <div className="account-empty">
                  <Icon name="eye" size={26} />
                  <div>
                    <strong>No trail yet</strong>
                    <p>Books you open will appear here, so you can pick up where you left off.</p>
                  </div>
                  <Link to="/books" className="btn btn--outline btn--small">Start browsing</Link>
                </div>
              ) : (
                <div className="account-books">
                  {recentBooks.map((book) => (
                    <Link key={book.id} to={`/books/${book.slug}`} className="account-book">
                      <span className="account-book__cover"><BookCover book={book} decorative /></span>
                      <span className="account-book__copy">
                        <strong>{book.title}</strong>
                        <small>{book.author}</small>
                      </span>
                      <Icon name="arrow-right" size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="account-side">
            <section className="account-card" aria-labelledby="wishlist-title">
              <div className="account-card__head">
                <div>
                  <span className="eyebrow">Saved for later</span>
                  <h2 id="wishlist-title">Wishlist</h2>
                </div>
                <Link to="/wishlist" className="text-link">All saved <Icon name="arrow-right" size={14} /></Link>
              </div>

              {wishlistBooks.length === 0 ? (
                <div className="account-empty account-empty--stack">
                  <Icon name="heart" size={24} />
                  <div>
                    <strong>Nothing saved yet</strong>
                    <p>Tap the heart on any book to keep it here.</p>
                  </div>
                </div>
              ) : (
                <div className="wishlist-mini">
                  {wishlistBooks.map((book) => (
                    <Link key={book.id} to={`/books/${book.slug}`} className="wishlist-mini__item">
                      <span className="wishlist-mini__cover"><BookCover book={book} decorative /></span>
                      <span>
                        <strong>{book.title}</strong>
                        <small>{formatINR(book.price)}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="account-card" aria-labelledby="address-title">
              <div className="account-card__head">
                <div>
                  <span className="eyebrow">Delivery details</span>
                  <h2 id="address-title">Last used address</h2>
                </div>
              </div>
              {latestAddress ? (
                <address className="account-address">
                  <strong>{latestAddress.fullName}</strong>
                  <span>{latestAddress.addressLine1}</span>
                  {latestAddress.addressLine2 ? <span>{latestAddress.addressLine2}</span> : null}
                  <span>{latestAddress.city}, {latestAddress.state} {latestAddress.pincode}</span>
                  <span>{latestAddress.country}</span>
                  <span className="account-address__contact">{latestAddress.email} · +91 {latestAddress.phone}</span>
                </address>
              ) : (
                <p className="account-side__note">Your delivery address will appear here after your first demo order.</p>
              )}
            </section>

            <div className="account-side__note-card">
              <Icon name="shield" size={18} />
              <p>
                <strong>A note on this account.</strong> Authentication is simulated. No password is checked,
                no email is sent, and all data stays in this browser&apos;s localStorage.
              </p>
            </div>
          </aside>
        </div>

        <section className="account-help">
          <div>
            <span className="eyebrow">Need a hand?</span>
            <h2>We are happy to help you choose.</h2>
          </div>
          <div className="account-help__actions">
            <Link to="/faq" className="btn btn--outline">Read the FAQs</Link>
            <Link to="/contact" className="btn btn--primary">Ask a bookseller</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
