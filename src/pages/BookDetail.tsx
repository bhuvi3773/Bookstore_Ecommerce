import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { BookFormat } from '../types'
import { books, getBookBySlug, getBookById } from '../data/books'
import { getSampleReviews } from '../data/reviews'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../components/ui/Toast'
import { BookCover } from '../components/ui/BookCover'
import { BookCard } from '../components/books/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { Rating } from '../components/ui/Rating'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { formatINR, getDiscountPercent } from '../utils/format'
import { getFormatPrice } from '../utils/pricing'

const formatNotes: Record<BookFormat, string> = {
  Paperback: 'Lightweight paper edition',
  Hardcover: 'Cloth-bound keepsake edition',
  eBook: 'Instant download · demo',
  Audiobook: 'Narrated edition · demo',
}

const formatLeadTime: Record<BookFormat, string> = {
  Paperback: 'Ships in 1–2 days',
  Hardcover: 'Ships in 1–2 days',
  eBook: 'Available instantly',
  Audiobook: 'Available instantly',
}

export default function BookDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const book = getBookBySlug(slug)
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    isInCart,
    markViewed,
    recentlyViewed,
  } = useStore()
  const { showToast } = useToast()
  const [qty, setQty] = useState(1)
  const [view, setView] = useState<'front' | 'back'>('front')
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(() => book?.format[0] ?? 'Paperback')
  const [swiping, setSwiping] = useState(false)
  const swipe = useRef({ active: false, pointerId: null as number | null, startX: 0, startY: 0 })

  useDocumentTitle(book ? `${book.title} — ${book.author}` : 'Book not found')

  useEffect(() => {
    setQty(1)
    setView('front')
    setSelectedFormat(book?.format[0] ?? 'Paperback')
    swipe.current.active = false
    setSwiping(false)
    if (book) markViewed(book.id)
  }, [book?.id])

  const reviews = useMemo(() => (book ? getSampleReviews(book.category) : []), [book])

  const related = useMemo(
    () => (book ? books.filter((item) => item.category === book.category && item.id !== book.id).slice(0, 4) : []),
    [book],
  )
  const sameAuthor = useMemo(
    () => (book ? books.filter((item) => item.author === book.author && item.id !== book.id).slice(0, 4) : []),
    [book],
  )
  const recent = useMemo(
    () => recentlyViewed
      .map((id) => getBookById(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item) && item!.id !== book?.id)
      .slice(0, 4),
    [recentlyViewed, book?.id],
  )

  if (!book) {
    return (
      <div className="section">
        <div className="container">
          <EmptyState
            icon="book"
            eyebrow="Not on our shelves"
            title="We couldn't find that book"
            description="The title may have moved, or the link may be incomplete. Browse the collection and we'll help you find something worth staying up for."
            action={
              <div className="empty-state__buttons">
                <Link to="/books" className="btn btn--primary">Browse all books</Link>
                <Link to="/" className="btn btn--outline">Back to home</Link>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  const selectedPrice = getFormatPrice(book, selectedFormat)
  const discount = selectedFormat === book.format[0] ? getDiscountPercent(book.price, book.originalPrice) : 0
  const savings = book.originalPrice && discount > 0 ? book.originalPrice - book.price : 0
  const outOfStock = book.stock <= 0
  const lowStock = book.stock > 0 && book.stock <= 5
  const inWishlist = isInWishlist(book.id)
  const inBag = isInCart(book.id)

  const fill = Math.round(((book.rating - 3.4) / 1.6) * 100)

  const handleAdd = (openDrawer = false) => {
    const result = addToCart(book.id, qty, selectedFormat)
    if (result.ok) {
      showToast(result.message, 'success')
      if (openDrawer) navigate('/checkout')
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleWishlist = () => {
    const nowSaved = toggleWishlist(book.id)
    showToast(
      nowSaved ? `Saved “${book.title}” to your wishlist.` : `Removed “${book.title}” from your wishlist.`,
      'wishlist',
    )
  }

  const handleCoverPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    swipe.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }

    if (event.pointerType === 'mouse') {
      setSwiping(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const endCoverSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!swipe.current.active || event.pointerId !== swipe.current.pointerId) return

    const deltaX = event.clientX - swipe.current.startX
    const deltaY = event.clientY - swipe.current.startY
    swipe.current.active = false
    swipe.current.pointerId = null
    setSwiping(false)

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return
    setView(deltaX < 0 ? 'back' : 'front')
  }

  const cancelCoverSwipe = () => {
    swipe.current.active = false
    swipe.current.pointerId = null
    setSwiping(false)
  }

  const reviewDistribution = [
    { stars: 5, count: Math.round(book.reviewsCount * 0.68) },
    { stars: 4, count: Math.round(book.reviewsCount * 0.22) },
    { stars: 3, count: Math.round(book.reviewsCount * 0.07) },
    { stars: 2, count: Math.round(book.reviewsCount * 0.02) },
    { stars: 1, count: Math.max(0, book.reviewsCount - Math.round(book.reviewsCount * 0.99)) },
  ]

  return (
    <div className="detail-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <Link to="/books">Books</Link>
          <Icon name="chevron-right" size={12} />
          <Link to={`/categories/${book.category.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}>{book.category}</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">{book.title}</span>
        </nav>

        <article className="detail">
          <div className="detail__gallery">
            <div
              className={`detail__stage ${view === 'back' ? 'is-back' : ''} ${swiping ? 'is-swiping' : ''}`}
              role="group"
              aria-label={`${book.title} cover views`}
              onPointerDown={handleCoverPointerDown}
              onPointerUp={endCoverSwipe}
              onPointerCancel={cancelCoverSwipe}
            >
              <div className="detail__face detail__face--front" aria-hidden={view !== 'front'}>
                <BookCover book={book} eager />
              </div>
              <div className="detail__face detail__face--back" aria-hidden={view !== 'back'}>
                <BookCover book={book} variant="back" decorative />
              </div>
              {discount > 0 ? <span className="detail__sale">Save {discount}%</span> : null}
              <span className="sr-only" aria-live="polite">
                {view === 'front' ? 'Front cover shown' : 'Back cover shown'}
              </span>
            </div>

            <p className="detail__gallery-hint">
              <Icon name="arrow-right" size={13} />
              Swipe the cover to flip
            </p>

            <div className="detail__gallery-bar">
              <div className="detail__thumbs" role="group" aria-label="Cover views">
                <button
                  type="button"
                  className={`detail__thumb ${view === 'front' ? 'is-active' : ''}`}
                  aria-pressed={view === 'front'}
                  onClick={() => setView('front')}
                >
                  <span className="detail__thumb-cover"><BookCover book={book} decorative /></span>
                  <span>Front</span>
                </button>
                <button
                  type="button"
                  className={`detail__thumb ${view === 'back' ? 'is-active' : ''}`}
                  aria-pressed={view === 'back'}
                  onClick={() => setView('back')}
                >
                  <span className="detail__thumb-cover"><BookCover book={book} variant="back" decorative /></span>
                  <span>Back</span>
                </button>
              </div>
              <p className="detail__edition-note">
                <Icon name="sparkle" size={15} />
                Hawthorn edition · designed in-house
              </p>
            </div>
          </div>

          <div className="detail__info">
            <div className="detail__heading">
              <span className="eyebrow">{book.category}</span>
              <h1 className="detail__title">{book.title}</h1>
              <p className="detail__author">
                by <Link to={`/books?author=${encodeURIComponent(book.author)}`}>{book.author}</Link>
              </p>
              <div className="detail__rating">
                <Rating rating={book.rating} reviewsCount={book.reviewsCount} />
                <span className="detail__rating-note">{fill}% would recommend</span>
              </div>
            </div>

            <div className="detail__price-block">
              <div className="detail__price-row">
                <span className="price price--large">{formatINR(selectedPrice)}</span>
                {discount > 0 && book.originalPrice ? (
                  <span className="price price--was price--large">{formatINR(book.originalPrice)}</span>
                ) : null}
                {discount > 0 ? <span className="badge badge--sale">Save {formatINR(savings)}</span> : null}
              </div>
              <p className="detail__price-note">Inclusive of all taxes · Free delivery over ₹1,499</p>
            </div>

            <p className="detail__description">{book.description}</p>

            <div className="detail__formats">
              <span className="detail__label">Choose your edition</span>
              <div className="format-options" role="radiogroup" aria-label="Book format">
                {book.format.map((format) => {
                  const price = getFormatPrice(book, format)
                  return (
                    <button
                      key={format}
                      type="button"
                      role="radio"
                      aria-checked={selectedFormat === format}
                      className={`format-option ${selectedFormat === format ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedFormat(format)
                        setQty(1)
                      }}
                    >
                      <span className="format-option__top">
                        <strong>{format}</strong>
                        <span>{formatINR(price)}</span>
                      </span>
                      <span className="format-option__note">{formatNotes[format]}</span>
                      <span className="format-option__lead">{formatLeadTime[format]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="detail__availability">
              <span className={`stock-note ${lowStock ? 'is-low' : ''} ${outOfStock ? 'is-out' : ''}`}>
                <span className="stock-note__dot" aria-hidden="true" />
                {outOfStock ? 'Out of stock' : lowStock ? `Only ${book.stock} copies left` : 'In stock, ready to send'}
              </span>
              {inBag ? <span className="detail__in-bag"><Icon name="check" size={14} /> Already in your bag</span> : null}
            </div>

            <div className="detail__buy">
              <QuantityStepper
                value={qty}
                max={Math.max(1, book.stock)}
                label={`Quantity for ${book.title}`}
                onChange={setQty}
              />
              <button
                type="button"
                className="btn btn--primary btn--large detail__add"
                onClick={() => handleAdd()}
                disabled={outOfStock}
              >
                <Icon name="bag" size={17} />
                Add to bag · {formatINR(selectedPrice * qty)}
              </button>
              <button
                type="button"
                className={`wishlist-button wishlist-button--inline ${inWishlist ? 'is-active' : ''}`}
                onClick={handleWishlist}
                aria-pressed={inWishlist}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Icon name="heart" size={18} />
              </button>
            </div>

            <button
              type="button"
              className="btn btn--outline btn--full detail__buy-now"
              onClick={() => handleAdd(true)}
              disabled={outOfStock}
            >
              Buy it now
              <Icon name="arrow-right" size={16} />
            </button>

            <ul className="detail__perks">
              <li><Icon name="truck" size={16} /> Free standard delivery over ₹1,499</li>
              <li><Icon name="refresh" size={16} /> 30-day returns on print editions</li>
              <li><Icon name="gift" size={16} /> Gift wrapping available at checkout</li>
              <li><Icon name="shield" size={16} /> Demo store — no real payment taken</li>
            </ul>

            <div className="detail__meta">
              <div><span>ISBN</span><strong>{book.isbn}</strong></div>
              <div><span>Publisher</span><strong>{book.publisher}</strong></div>
              <div><span>Pages</span><strong>{book.pages}</strong></div>
              <div><span>Language</span><strong>{book.language}</strong></div>
              <div><span>Published</span><strong>{book.publishedYear ?? 2025}</strong></div>
              <div><span>Formats</span><strong>{book.format.join(' · ')}</strong></div>
            </div>

            <div className="detail__notes">
              <section className="detail-note">
                <h2><Icon name="quote" size={17} /> Why we love it</h2>
                <ul>
                  {book.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
              <section className="detail-note">
                <h2><Icon name="leaf" size={17} /> Perfect for</h2>
                <div className="tag-row">
                  {(book.tags ?? [book.category]).map((tag) => (
                    <Link key={tag} to={`/books?q=${encodeURIComponent(tag)}`} className="tag-pill">{tag}</Link>
                  ))}
                  {(book.moods ?? []).map((mood) => (
                    <span key={mood} className="tag-pill tag-pill--soft">{mood}</span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </article>

        <section className="reviews-section" aria-labelledby="reviews-title">
          <Reveal className="reviews-summary">
            <div>
              <span className="eyebrow">What readers say</span>
              <h2 id="reviews-title">Reader reviews</h2>
              <p className="reviews-summary__note">
                Sample reviews for this demonstration store. They are illustrative, not real customer feedback.
              </p>
            </div>
            <div className="reviews-score">
              <span className="reviews-score__value">{book.rating.toFixed(1)}</span>
              <div>
                <Rating rating={book.rating} />
                <span className="reviews-score__count">{book.reviewsCount} ratings</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="reviews-body" delay={80}>
            <div className="reviews-bars">
              {reviewDistribution.map((row) => (
                <div className="reviews-bar" key={row.stars}>
                  <span>{row.stars}★</span>
                  <span className="reviews-bar__track" aria-hidden="true">
                    <span style={{ transform: `scaleX(${Math.min(1, row.count / Math.max(1, book.reviewsCount))})` }} />
                  </span>
                  <span className="reviews-bar__count">{row.count}</span>
                </div>
              ))}
            </div>

            <div className="review-list">
              {reviews.map((review) => (
                <article className="review-card" key={`${review.name}-${review.title}`}>
                  <div className="review-card__head">
                    <span className="review-card__avatar" aria-hidden="true">{review.name.charAt(0)}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <span>Verified demo reader · {review.date}</span>
                    </div>
                    <Rating rating={review.rating} compact />
                  </div>
                  <h3>{review.title}</h3>
                  <p>{review.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      {related.length > 0 ? (
        <section className="section section--tint">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Stay on this shelf"
                title={`More ${book.category.toLowerCase()} worth your evening`}
                description="Books that share a mood, a shelf or a way of seeing the world."
                actionLabel="Browse the shelf"
                actionTo={`/categories/${book.category.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
              />
            </Reveal>
            <div className="book-grid book-grid--four">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 55}>
                  <BookCard book={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sameAuthor.length > 0 ? (
        <section className="section">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Same hand"
                title={`More from ${book.author}`}
                actionLabel="See every title"
                actionTo={`/books?author=${encodeURIComponent(book.author)}`}
              />
            </Reveal>
            <div className="book-grid book-grid--four">
              {sameAuthor.map((item, index) => (
                <Reveal key={item.id} delay={index * 55}>
                  <BookCard book={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {recent.length > 0 ? (
        <section className="section section--tint">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Your reading trail"
                title="Recently viewed"
                description="A quiet trail of the books you have opened lately."
                actionLabel="Your account"
                actionTo="/account"
              />
            </Reveal>
            <div className="book-grid book-grid--four">
              {recent.map((item, index) => (
                <Reveal key={item.id} delay={index * 55}>
                  <BookCard book={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
