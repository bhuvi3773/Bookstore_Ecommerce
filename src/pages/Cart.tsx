import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { books } from '../data/books'
import { formatINR } from '../utils/format'

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, toggleWishlist } = useStore()
  const items = cart.map((item) => ({ item, book: books.find((b) => b.id === item.bookId)! })).filter((x) => x.book)
  const subtotal = items.reduce((sum, { item, book }) => sum + book.price * item.quantity, 0)
  const shipping = subtotal >= 1499 ? 0 : 99
  const discount = 0
  const total = subtotal - discount + shipping

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Cart</span>
          <h1 className="section-title">Your Bag</h1>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--muted)' }}>Looks like you haven&apos;t added anything yet.</p>
            <Link to="/books" className="btn btn-primary" style={{ alignSelf: 'center' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(({ item, book }) => (
                <article key={book.id} className="card" style={{ display: 'grid', gap: '1.6rem', gridTemplateColumns: '120px 1fr', padding: '1.6rem' }}>
                  <Link to={`/books/${book.slug}`}><img src={book.cover} alt={book.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '12px' }} /></Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <Link to={`/books/${book.slug}`} style={{ fontFamily: 'Cormorant', fontSize: '1.6rem' }}>{book.title}</Link>
                        <p style={{ color: 'var(--muted)' }}>{book.author}</p>
                      </div>
                      <span>{formatINR(book.price * item.quantity)}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '9999px' }}>
                        <button className="btn btn-ghost" onClick={() => updateCartQuantity(book.id, item.quantity - 1)}>-</button>
                        <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                        <button className="btn btn-ghost" onClick={() => updateCartQuantity(book.id, item.quantity + 1)}>+</button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button className="btn btn-ghost" onClick={() => toggleWishlist(book.id)}>Move to Wishlist</button>
                        <button className="btn btn-ghost" onClick={() => removeFromCart(book.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2.4rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'sticky', top: '1rem' }}>
              <h2 style={{ fontSize: '2rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Discount</span><span>{formatINR(discount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}><span>Total</span><span>{formatINR(total)}</span></div>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input className="input" placeholder="Coupon code (e.g. WELCOME10)" />
                <button className="btn btn-outline">Apply</button>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Demo coupons: WELCOME10 (10%), READ15 (15%)</p>
              <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }}>Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
