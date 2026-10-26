import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { books, categories } from '../data/books'
import { BookCard } from '../components/books/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const popularSearches = ['Literary fiction', 'Locked room', 'Poetry', 'Hindi', 'Book club', 'Slow living']

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [query, setQuery] = useState(q)

  useDocumentTitle(q ? `Search: ${q}` : 'Search')

  useEffect(() => {
    setQuery(q)
  }, [q])

  const term = q.trim().toLowerCase()
  const results = useMemo(() => {
    if (!term) return []
    return books.filter((book) =>
      [
        book.title,
        book.author,
        book.category,
        book.isbn,
        book.publisher,
        book.description,
        ...(book.tags ?? []),
        ...(book.moods ?? []),
      ].some((field) => field.toLowerCase().includes(term)),
    )
  }, [term])

  const submit = (next: string) => {
    const value = next.trim()
    setParams(value ? { q: value } : {}, { replace: true })
  }

  return (
    <div className="search-page">
      <div className="container">
        <header className="search-hero">
          <span className="eyebrow">Search the shelves</span>
          <h1 className="search-hero__title">
            {q ? <>Results for <em>“{q}”</em></> : 'What are you looking for?'}
          </h1>
          <p className="search-hero__text">
            {q
              ? `${results.length} ${results.length === 1 ? 'book matches' : 'books match'} your search. Try an author, a mood, a category or a half-remembered title.`
              : 'Search by title, author, category, mood or ISBN. Our booksellers have strong opinions — the right book is usually close.'}
          </p>

          <form
            className="search-hero__form"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              submit(query)
            }}
          >
            <Icon name="search" size={19} />
            <label className="sr-only" htmlFor="search-page-input">Search books</label>
            <input
              id="search-page-input"
              type="search"
              value={query}
              placeholder="Try “slow living”, “Ravi Menon”, “poetry”…"
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="search-hero__clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery('')
                  submit('')
                }}
              >
                <Icon name="close" size={14} />
              </button>
            ) : null}
            <button type="submit" className="btn btn--primary">Search</button>
          </form>

          <div className="search-suggestions">
            <span>Popular:</span>
            {popularSearches.map((item) => (
              <button key={item} type="button" className="search-suggestion" onClick={() => submit(item)}>
                {item}
              </button>
            ))}
          </div>
        </header>

        {!q ? (
          <section className="search-categories" aria-labelledby="search-shelves-title">
            <div className="search-categories__head">
              <h2 id="search-shelves-title">Or begin with a shelf</h2>
              <Link to="/books" className="text-link">See all books <Icon name="arrow-right" size={15} /></Link>
            </div>
            <div className="search-category-grid">
              {categories.map((category) => (
                <Link key={category.slug} to={`/categories/${category.slug}`} className="search-category">
                  <span className="search-category__name">{category.name}</span>
                  <span className="search-category__tagline">{category.tagline}</span>
                  <span className="search-category__count">{category.count} titles</span>
                  <Icon name="arrow-right" size={15} />
                </Link>
              ))}
            </div>
          </section>
        ) : results.length === 0 ? (
          <EmptyState
            icon="search"
            eyebrow="Nothing quite matches"
            title={`No books found for “${q}”`}
            description="Try a shorter phrase, a different spelling, or one of the shelves below. We have twelve of them, and a bookseller's bias toward hidden gems."
            action={
              <div className="empty-state__buttons">
                <Link to="/books" className="btn btn--primary">Browse all books</Link>
                <Link to="/contact" className="btn btn--outline">Ask a bookseller</Link>
              </div>
            }
          />
        ) : (
          <section className="search-results" aria-live="polite">
            <div className="search-results__head">
              <p><strong>{results.length}</strong> {results.length === 1 ? 'book' : 'books'} found</p>
              <Link to={`/books?q=${encodeURIComponent(q)}`} className="text-link">
                Refine in the catalogue <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="book-grid book-grid--four">
              {results.map((book, index) => (
                <Reveal key={book.id} delay={(index % 4) * 45}>
                  <BookCard book={book} priority={index < 4} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {q && results.length > 0 ? (
          <div className="search-footer">
            <span className="eyebrow">Keep looking</span>
            <div className="search-suggestions">
              {popularSearches.slice(0, 4).map((item) => (
                <button key={item} type="button" className="search-suggestion" onClick={() => submit(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
