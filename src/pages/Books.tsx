import { useMemo, useState } from 'react'
import { books } from '../data/books'
import { BookCard } from '../components/books/BookCard'

export default function Books() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('popular')

  const categories = ['all', ...Array.from(new Set(books.map((b) => b.category)))]

  const filtered = useMemo(() => {
    let result = books.filter((book) => {
      const matchesQuery = query.trim() ? (book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase())) : true
      const matchesCategory = category === 'all' ? true : book.category === category
      return matchesQuery && matchesCategory
    })

    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') result = [...result].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))

    return result
  }, [query, category, sort])

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Shop</span>
          <h1 className="section-title">All Books</h1>
          <p className="section-subtitle">Browse the full collection with search, filters and sorting.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', padding: '1rem 1.6rem' }}>
          <input className="input" style={{ flex: '1 1 260px' }} placeholder="Search by title or author" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
          </select>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <span style={{ color: 'var(--muted)' }}>{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>No books found</h2>
            <p style={{ color: 'var(--muted)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-books">
            {filtered.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}
