import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { formatINR, getDiscountPercent } from '../../utils/format'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'

export function BookCard({ book }: { book: Book }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const { showToast } = useToast()
  const discount = getDiscountPercent(book.price, book.originalPrice)
  const inWishlist = isInWishlist(book.id)

  const handleAddToCart = () => {
    addToCart(book.id, 1)
    showToast('Added to cart')
  }

  const handleToggleWishlist = () => {
    toggleWishlist(book.id)
    showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <button
        onClick={handleToggleWishlist}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 2,
          borderRadius: '9999px',
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.92)',
          width: '2.6rem',
          height: '2.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {inWishlist ? '♥' : '♡'}
      </button>
      <Link to={`/books/${book.slug}`} style={{ position: 'relative', display: 'block' }}>
        <img
          src={book.cover}
          alt={book.title}
          loading="lazy"
          style={{ aspectRatio: '3/4', objectFit: 'cover', width: '100%' }}
        />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {book.bestseller ? <span className="badge badge-accent">Bestseller</span> : null}
          {book.newArrival ? <span className="badge badge-success">New</span> : null}
          {discount > 0 ? <span className="badge badge-sale">-{discount}%</span> : null}
        </div>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.8rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', color: 'var(--muted)' }}>{book.category}</span>
          <Link to={`/books/${book.slug}`} style={{ fontFamily: 'Cormorant', fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', lineHeight: '1.05' }}>{book.title}</Link>
          <span style={{ color: 'var(--muted)' }}>{book.author}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--muted)' }}>
            <span>★ {book.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{book.reviewsCount} reviews</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{formatINR(book.price)}</span>
          {book.originalPrice ? <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{formatINR(book.originalPrice)}</span> : null}
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </article>
  )
}
