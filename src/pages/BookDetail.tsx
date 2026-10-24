import { useParams, Link } from 'react-router-dom'
import { getBookBySlug, books } from '../data/books'
import { formatINR, getDiscountPercent } from '../utils/format'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/ui/Toast'
import { BookCard } from '../components/books/BookCard'
import { useState } from 'react'

export default function BookDetail() {
  const { slug = '' } = useParams()
  const book = getBookBySlug(slug)
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const { showToast } = useToast()
  const [qty, setQty] = useState(1)

  if (!book) {
    return (
      <div className="section">
        <div className="container">
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>Book not found</h1>
            <Link to="/books" className="btn btn-primary">Back to shop</Link>
          </div>
        </div>
      </div>
    )
  }

  const discount = getDiscountPercent(book.price, book.originalPrice)
  const related = books.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4)

  return (
    <div>
      <div className="section">
        <div className="container" style={{ display: 'grid', gap: 'clamp(2rem, 6vw, 4rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <img src={book.cover} alt={book.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span className="eyebrow">{book.category}</span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '0.95' }}>{book.title}</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>by {book.author}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span>★ {book.rating}</span>
                <span style={{ color: 'var(--muted)' }}>({book.reviewsCount} reviews)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{formatINR(book.price)}</span>
              {book.originalPrice ? <span style={{ fontSize: '1.4rem', color: 'var(--muted)', textDecoration: 'line-through' }}>{formatINR(book.originalPrice)}</span> : null}
              {discount > 0 ? <span className="badge badge-sale">Save {discount}%</span> : null}
            </div>
            <p style={{ color: 'var(--muted)', maxWidth: '560px' }}>{book.description}</p>
            <div className="card" style={{ padding: '1.6rem', display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div><strong>ISBN:</strong> {book.isbn}</div>
              <div><strong>Publisher:</strong> {book.publisher}</div>
              <div><strong>Pages:</strong> {book.pages}</div>
              <div><strong>Language:</strong> {book.language}</div>
              <div><strong>Format:</strong> {book.format.join(', ')}</div>
              <div><strong>Stock:</strong> {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '9999px' }}>
                <button className="btn btn-ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span style={{ padding: '0 1.2rem' }}>{qty}</span>
                <button className="btn btn-ghost" onClick={() => setQty((q) => Math.min(book.stock || 10, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary" onClick={() => { addToCart(book.id, qty); showToast('Added to cart') }}>Add to Cart</button>
              <button className="btn btn-outline" onClick={() => { toggleWishlist(book.id); showToast(isInWishlist(book.id) ? 'Removed from wishlist' : 'Added to wishlist') }}>{isInWishlist(book.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</button>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>Highlights</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--muted)' }}>
                {book.highlights.map((h) => <li key={h}>• {h}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header-row">
              <div className="section-header">
                <span className="eyebrow">You may also like</span>
                <h2 className="section-title">Related Books</h2>
              </div>
            </div>
            <div className="grid grid-books">
              {related.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
