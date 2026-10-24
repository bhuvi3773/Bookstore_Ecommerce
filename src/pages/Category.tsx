import { useParams, Link } from 'react-router-dom'
import { books } from '../data/books'
import { BookCard } from '../components/books/BookCard'

const map: Record<string, string> = {
  fiction: 'Fiction',
  mystery: 'Mystery',
  romance: 'Romance',
  fantasy: 'Fantasy',
  'self-help': 'Self-Help',
  business: 'Business',
  technology: 'Technology',
  academic: 'Academic',
  'children-s': "Children's",
  biography: 'Biography',
  poetry: 'Poetry',
  comics: 'Comics',
}

export default function Category() {
  const { slug = '' } = useParams()
  const name = map[slug] || slug.replace('-', ' ')
  const items = books.filter((b) => b.category.toLowerCase() === name.toLowerCase())

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link to="/books" style={{ color: 'var(--muted)' }}>← Back to shop</Link>
          <div className="section-header">
            <span className="eyebrow">Category</span>
            <h1 className="section-title">{name}</h1>
            <p className="section-subtitle">{items.length} titles in this collection</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Coming soon</h2>
            <p style={{ color: 'var(--muted)' }}>More titles will be added soon.</p>
          </div>
        ) : (
          <div className="grid grid-books">
            {items.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}
