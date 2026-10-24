import { useSearchParams, Link } from 'react-router-dom'
import { books } from '../data/books'
import { BookCard } from '../components/books/BookCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const results = books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Search</span>
          <h1 className="section-title">Results for &ldquo;{params.get('q') || ''}&rdquo;</h1>
          <p className="section-subtitle">{results.length} {results.length === 1 ? 'result' : 'results'} found</p>
        </div>

        {results.length === 0 ? (
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Nothing matches</h2>
            <p style={{ color: 'var(--muted)' }}>Try another keyword or browse our collection.</p>
            <Link to="/books" className="btn btn-primary" style={{ alignSelf: 'center' }}>Browse All Books</Link>
          </div>
        ) : (
          <div className="grid grid-books">
            {results.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}
