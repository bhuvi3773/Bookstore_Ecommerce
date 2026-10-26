import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { books, categories } from '../data/books'
import { BookCover } from '../components/ui/BookCover'
import { Icon } from '../components/ui/Icon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useDocumentTitle('Page not found')

  const featured = books.filter((book) => book.bestseller).slice(0, 3)
  const shelfOne = featured[0] ?? books[0]
  const shelfTwo = featured[1] ?? books[1] ?? books[0]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found__hero">
          <div className="not-found__copy">
            <span className="eyebrow">404 · a wrong turn</span>
            <h1>This page has wandered off the shelf.</h1>
            <p>
              The link may be old, the title may have moved, or a bookmark may have lost its place.
              Nothing is missing from the shop itself — only this particular page.
            </p>

            <form className="not-found__search" role="search" onSubmit={submit}>
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="not-found-search">Search for a book</label>
              <input
                id="not-found-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a title, author or mood"
              />
              <button type="submit" className="btn btn--primary">Search</button>
            </form>

            <div className="not-found__links">
              <Link to="/" className="btn btn--outline">Back to home</Link>
              <Link to="/books" className="btn btn--outline">Browse all books</Link>
              <Link to="/contact" className="text-link">Ask a bookseller <Icon name="arrow-right" size={15} /></Link>
            </div>
          </div>

          <div className="not-found__art" aria-hidden="true">
            <span className="not-found__number">404</span>
            <div className="not-found__book not-found__book--back">
              <BookCover book={shelfOne} decorative />
            </div>
            <div className="not-found__book not-found__book--front">
              <BookCover book={shelfTwo} decorative />
            </div>
            <span className="not-found__note">Try the next shelf →</span>
          </div>
        </div>

        <section className="not-found__shelves">
          <div className="not-found__shelves-head">
            <span className="eyebrow">Or start again</span>
            <h2>A few doors worth opening</h2>
          </div>
          <div className="not-found__shelf-grid">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} to={`/categories/${category.slug}`} className="not-found__shelf">
                <span>{category.name}</span>
                <small>{category.tagline}</small>
                <Icon name="arrow-right" size={14} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
