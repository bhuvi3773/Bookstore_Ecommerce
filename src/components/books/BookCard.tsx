import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { formatINR, getDiscountPercent } from '../../utils/format'
import { getFormatPrice } from '../../utils/pricing'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'
import { BookCover } from '../ui/BookCover'
import { Icon } from '../ui/Icon'
import { Rating } from '../ui/Rating'

interface BookCardProps {
  book: Book
  priority?: boolean
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const { showToast } = useToast()
  const [added, setAdded] = useState(false)
  const timerRef = useRef<number | null>(null)
  const discount = getDiscountPercent(book.price, book.originalPrice)
  const inWishlist = isInWishlist(book.id)
  const outOfStock = book.stock <= 0
  const lowStock = book.stock > 0 && book.stock <= 5
  const displayPrice = getFormatPrice(book, book.format[0])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const handleAddToCart = () => {
    if (outOfStock) return
    const result = addToCart(book.id, 1, book.format[0])
    if (result.ok) {
      setAdded(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setAdded(false), 1800)
      showToast(result.message, 'success')
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleToggleWishlist = () => {
    const nowSaved = toggleWishlist(book.id)
    showToast(nowSaved ? `Saved “${book.title}” to your wishlist.` : `Removed “${book.title}” from your wishlist.`, 'wishlist')
  }

  return (
    <article className={`book-card ${outOfStock ? 'is-out-of-stock' : ''}`}>
      <div className="book-card__visual">
        <Link to={`/books/${book.slug}`} className="book-card__cover-link">
          <span className="book-card__cover-stage">
            <BookCover book={book} decorative eager={priority} />
          </span>
          <span className="sr-only">View details for {book.title} by {book.author}</span>
        </Link>

        <div className="book-card__badges">
          {discount > 0 ? <span className="badge badge--sale">-{discount}%</span> : null}
          {book.bestseller ? <span className="badge badge--gold">Bestseller</span> : null}
          {book.newArrival ? <span className="badge badge--new">New</span> : null}
          {book.editorPick && !book.bestseller && !book.newArrival ? <span className="badge badge--soft">Editor&apos;s pick</span> : null}
        </div>

        <button
          type="button"
          className={`wishlist-button ${inWishlist ? 'is-active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
          aria-pressed={inWishlist}
        >
          <Icon name="heart" size={17} />
        </button>

        {outOfStock ? (
          <div className="book-card__sold-out">
            <span>Out of stock</span>
          </div>
        ) : (
          <div className="book-card__hover-action">
            <button type="button" className="btn btn--light btn--small" onClick={handleAddToCart} tabIndex={-1} aria-hidden="true">
              <Icon name="bag" size={15} />
              Quick add
            </button>
          </div>
        )}
      </div>

      <div className="book-card__body">
        <div className="book-card__meta">
          <span className="book-card__category">{book.category}</span>
          <span className={`stock-note ${lowStock ? 'is-low' : ''} ${outOfStock ? 'is-out' : ''}`}>
            <span className="stock-note__dot" aria-hidden="true" />
            {outOfStock ? 'Out of stock' : lowStock ? `Only ${book.stock} left` : 'In stock'}
          </span>
        </div>

        <h3 className="book-card__title">
          <Link to={`/books/${book.slug}`}>{book.title}</Link>
        </h3>
        <p className="book-card__author">by {book.author}</p>

        <Rating rating={book.rating} reviewsCount={book.reviewsCount} compact />

        <div className="book-card__footer">
          <div className="book-card__price">
            <span className="price">{formatINR(displayPrice)}</span>
            {book.originalPrice ? <span className="price price--was">{formatINR(book.originalPrice)}</span> : null}
          </div>
          <button
            type="button"
            className={`card-add ${added ? 'is-added' : ''}`}
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={added ? `${book.title} added to bag` : `Add ${book.title} to bag`}
          >
            <Icon name={added ? 'check' : 'bag'} size={15} />
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
