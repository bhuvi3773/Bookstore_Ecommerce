import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { books, categories, getCategoryBySlug } from '../data/books'
import { BookCard } from '../components/books/BookCard'
import { BookCover } from '../components/ui/BookCover'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Category() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const category = getCategoryBySlug(slug)
  const sort = params.get('sort') ?? 'popular'

  useDocumentTitle(category ? `${category.name} shelf` : 'Shelf not found')

  const categoryBooks = useMemo(() => {
    if (!category) return []
    const matches = books.filter((book) => book.category === category.name)
    switch (sort) {
      case 'price-low':
        return [...matches].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...matches].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...matches].sort((a, b) => b.rating - a.rating)
      case 'newest':
        return [...matches].sort((a, b) => (b.publishedYear ?? 0) - (a.publishedYear ?? 0))
      default:
        return [...matches].sort((a, b) => b.rating - a.rating)
    }
  }, [category, sort])

  if (!category) {
    return (
      <div className="container category-page">
        <EmptyState
          eyebrow="Shelf not found"
          title="This shelf has moved"
          description="We couldn't find that collection. Browse all twelve shelves from the bookshop instead."
          action={<Link to="/books" className="btn btn--primary">Browse all books</Link>}
        />
      </div>
    )
  }

  const otherShelves = categories.filter((item) => item.slug !== category.slug).slice(0, 5)
  const coverBooks = categoryBooks.slice(0, 3)

  return (
    <div className={`category-page category-page--${category.tone}`}>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <Link to="/books">Books</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">{category.name}</span>
        </nav>

        <Reveal>
          <header className="category-hero">
            <div className="category-hero__copy">
              <span className="eyebrow">The {category.name.toLowerCase()} shelf</span>
              <h1>{category.name}</h1>
              <p className="category-hero__tagline">{category.tagline}.</p>
              <p className="category-hero__description">{category.description}</p>
              <div className="category-hero__meta">
                <span><Icon name="book" size={15} /> {categoryBooks.length} {categoryBooks.length === 1 ? 'title' : 'titles'}</span>
                <span><Icon name="refresh" size={15} /> 30-day returns</span>
                <span><Icon name="truck" size={15} /> Free delivery over ₹1,499</span>
              </div>
            </div>
            <div className="category-hero__art" aria-hidden="true">
              {coverBooks.map((book, index) => (
                <span key={book.id} className={`category-hero__cover category-hero__cover--${index}`}>
                  <BookCover book={book} decorative eager={index === 0} />
                </span>
              ))}
              <span className="category-hero__monogram">{category.name.charAt(0)}</span>
            </div>
          </header>
        </Reveal>

        <div className="category-toolbar">
          <div>
            <span className="eyebrow">On the shelf</span>
            <h2>{categoryBooks.length} {categoryBooks.length === 1 ? 'book' : 'books'} to explore</h2>
          </div>
          <label className="sort-control">
            <span>Sort by</span>
            <select
              aria-label="Sort books by"
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                if (event.target.value === 'popular') next.delete('sort')
                else next.set('sort', event.target.value)
                setParams(next, { replace: true })
              }}
            >
              <option value="popular">Highest rated</option>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="book-grid book-grid--four category-grid-books">
          {categoryBooks.map((book, index) => (
            <Reveal key={book.id} delay={index % 4 * 45}>
              <BookCard book={book} priority={index < 4} />
            </Reveal>
          ))}
        </div>

        <section className="other-shelves">
          <div className="other-shelves__head">
            <span className="eyebrow">Keep wandering</span>
            <h2>Other shelves you might like</h2>
            <Link to="/books" className="text-link">See all books <Icon name="arrow-right" size={15} /></Link>
          </div>
          <Reveal className="other-shelves__grid" delay={80}>
            {otherShelves.map((item) => (
              <Link key={item.slug} to={`/categories/${item.slug}`} className="other-shelf">
                <span>{item.name}</span>
                <small>{item.tagline}</small>
                <Icon name="arrow-right" size={14} />
              </Link>
            ))}
          </Reveal>
        </section>
      </div>
    </div>
  )
}
