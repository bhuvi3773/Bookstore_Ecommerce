import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { books } from '../data/books'
import { BookCard } from '../components/books/BookCard'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = wishlist.map((w) => books.find((b) => b.id === w.bookId)).filter(Boolean)

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Wishlist</span>
          <h1 className="section-title">Saved for later</h1>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--muted)' }}>Save books you love to revisit them later.</p>
            <Link to="/books" className="btn btn-primary" style={{ alignSelf: 'center' }}>Discover Books</Link>
          </div>
        ) : (
          <div className="grid grid-books">
            {items.map((book) => <BookCard key={book!.id} book={book!} />)}
          </div>
        )}
      </div>
    </div>
  )
}
