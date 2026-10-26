import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { books, getBookById } from '../data/books'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../components/ui/Toast'
import { BookCard } from '../components/books/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading } from '../components/ui/SectionHeading'
import { formatINR } from '../utils/format'
import { getCheapestPrice } from '../utils/pricing'

export default function Wishlist() {
  const { wishlist, addToCart } = useStore()
  const { showToast } = useToast()

  useDocumentTitle('Your wishlist')

  const items = useMemo(
    () =>
      wishlist
        .map((entry) => getBookById(entry.bookId))
        .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book)),
    [wishlist],
  )

  const total = items.reduce((sum, book) => sum + getCheapestPrice(book), 0)
  const available = items.filter((book) => book.stock > 0)
  const suggestions = useMemo(
    () =>
      books
        .filter((book) => !wishlist.some((entry) => entry.bookId === book.id) && book.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [wishlist],
  )

  const addAll = () => {
    let added = 0
    let limited = 0
    available.forEach((book) => {
      const result = addToCart(book.id, 1, book.format[0])
      if (result.ok) added += 1
      else limited += 1
    })
    if (added === 0) {
      showToast('Nothing could be added — these titles are already at their stock limit in your bag.', 'error')
      return
    }
    showToast(
      limited > 0
        ? `Added ${added} ${added === 1 ? 'book' : 'books'} to your bag. ${limited} could not be added due to stock limits.`
        : `Added ${added} ${added === 1 ? 'book' : 'books'} to your bag.`,
      'success',
    )
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <PageHeader
          eyebrow="Saved for later"
          title="Your wishlist"
          description="Books you wanted to keep close. Save as many as you like — they stay on this device until you remove them."
        />

        {items.length === 0 ? (
          <>
            <EmptyState
              icon="heart"
              eyebrow="Nothing saved yet"
              title="A wishlist waiting to be filled"
              description="Tap the heart on any book cover to save it here. We will keep the shelf tidy for you."
              action={
                <div className="empty-state__buttons">
                  <Link to="/books" className="btn btn--primary">Discover books</Link>
                  <Link to="/cart" className="btn btn--outline">View your bag</Link>
                </div>
              }
            />
            <section className="section wishlist-suggestions">
              <SectionHeading
                eyebrow="Start here"
                title="Books worth saving"
                description="A few reader favourites to begin a wishlist with."
                actionLabel="Browse all"
                actionTo="/books"
              />
              <div className="book-grid book-grid--four">
                {suggestions.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="wishlist-bar">
              <div className="wishlist-bar__stats">
                <span><strong>{items.length}</strong> {items.length === 1 ? 'book saved' : 'books saved'}</span>
                <span className="wishlist-bar__divider" aria-hidden="true" />
                <span>From <strong>{formatINR(total)}</strong> for the collection</span>
                <span className="wishlist-bar__divider" aria-hidden="true" />
                <span>{available.length} available now</span>
              </div>
              <div className="wishlist-bar__actions">
                <Link to="/books" className="btn btn--outline btn--small">Keep browsing</Link>
                <button type="button" className="btn btn--primary btn--small" onClick={addAll} disabled={available.length === 0}>
                  <Icon name="bag" size={15} />
                  Add all to bag
                </button>
              </div>
            </div>

            <div className="book-grid book-grid--four wishlist-grid">
              {items.map((book, index) => (
                <BookCard key={book.id} book={book} priority={index < 4} />
              ))}
            </div>

            <div className="wishlist-note">
              <Icon name="heart" size={18} />
              <p>
                Your wishlist is stored in this browser. Removing a book here does not remove it from your bag,
                and adding a book to your bag does not remove it from your wishlist.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
