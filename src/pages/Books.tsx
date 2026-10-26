import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { books, categories, categoryMeta, categorySlug } from '../data/books'
import { BookCard } from '../components/books/BookCard'
import { FilterPanel } from '../components/books/FilterPanel'
import { emptyFilters, type CatalogueFilters, type FilterGroup, type SingleFilterKey } from '../components/books/filterTypes'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { useDialog } from '../hooks/useDialog'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatINR } from '../utils/format'

const PAGE_SIZE = 8

const collections: Record<string, { title: string; description: string }> = {
  editors: {
    title: 'The Editor’s Picks',
    description: 'The books our booksellers keep pressing into friends’ hands — chosen for voice, feeling and the sheer pleasure of reading.',
  },
  winter: {
    title: 'The Winter Reading Room',
    description: 'Long evenings, thick socks and one more chapter. A slower shelf of generous novels, quiet poetry and books that reward attention.',
  },
}

function readList(value: string | null) {
  return value ? value.split(',').filter(Boolean) : []
}

function parseFilters(params: URLSearchParams): CatalogueFilters {
  const min = params.get('min')
  const max = params.get('max')
  const rating = params.get('rating')
  return {
    ...emptyFilters,
    q: params.get('q') ?? '',
    categories: readList(params.get('category')),
    authors: readList(params.get('author')),
    languages: readList(params.get('language')),
    formats: readList(params.get('format')),
    rating: rating ? Number(rating) || 0 : 0,
    minPrice: min ? Number(min) || null : null,
    maxPrice: max ? Number(max) || null : null,
    inStock: params.get('stock') === 'in',
    collection: params.get('collection') ?? '',
  }
}

export default function Books() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])
  const deferredQuery = useDeferredValue(filters.q)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [mobileFilters, setMobileFilters] = useState(false)
  const filterDrawerRef = useDialog(mobileFilters, () => setMobileFilters(false))
  const searchKey = params.toString()

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchKey])

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase()
    const categorySlugs = filters.categories
    const result = books.filter((book) => {
      const matchesSearch = term
        ? [book.title, book.author, book.category, book.isbn, book.publisher, ...(book.tags ?? [])]
            .some((field) => field.toLowerCase().includes(term))
        : true
      const matchesCategory = categorySlugs.length === 0 || categorySlugs.includes(categorySlug(book.category))
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(book.author)
      const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(book.language)
      const matchesFormat = filters.formats.length === 0 || book.format.some((format) => filters.formats.includes(format))
      const matchesRating = book.rating >= filters.rating
      const matchesMin = filters.minPrice === null || book.price >= filters.minPrice
      const matchesMax = filters.maxPrice === null || book.price <= filters.maxPrice
      const matchesStock = !filters.inStock || book.stock > 0
      const matchesCollection =
        !filters.collection ||
        (filters.collection === 'editors' && Boolean(book.editorPick)) ||
        (filters.collection === 'winter' && Boolean(book.moods?.some((mood) => ['Curl up', 'Slow living', 'Feel deeply'].includes(mood))))
      return (
        matchesSearch && matchesCategory && matchesAuthor && matchesLanguage && matchesFormat &&
        matchesRating && matchesMin && matchesMax && matchesStock && matchesCollection
      )
    })

    switch (params.get('sort') ?? 'popular') {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      case 'title':
        return [...result].sort((a, b) => a.title.localeCompare(b.title))
      case 'newest':
        return [...result].sort((a, b) => (b.publishedYear ?? 0) - (a.publishedYear ?? 0))
      default:
        return [...result].sort((a, b) => {
          const score = (book: (typeof books)[number]) => (book.bestseller ? 2 : 0) + (book.editorPick ? 1 : 0) + book.rating / 5
          return score(b) - score(a)
        })
    }
  }, [deferredQuery, filters, params])

  const visibleBooks = filtered.slice(0, visibleCount)
  const sortValue = params.get('sort') ?? 'popular'
  const collection = collections[filters.collection]
  const singleCategory = filters.categories.length === 1
    ? categoryMeta.find((category) => category.slug === filters.categories[0])
    : undefined

  const pageTitle = collection?.title ?? (singleCategory && !filters.q ? singleCategory.name : 'The collection')
  const pageDescription = collection?.description ?? (singleCategory && !filters.q
    ? singleCategory.description
    : 'Browse every title on our shelves. Search, filter by mood, price and format, and find something worth clearing an evening for.')

  useDocumentTitle(pageTitle)

  const updateParams = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    mutate(next)
    setParams(next, { replace: true })
  }

  const setParam = (key: string, value: string) => {
    updateParams((next) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
  }

  const toggleGroup = (group: FilterGroup, value: string) => {
    const paramKey = { categories: 'category', authors: 'author', languages: 'language', formats: 'format' }[group]
    const current = readList(params.get(paramKey))
    const nextValues = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    updateParams((next) => {
      if (nextValues.length > 0) next.set(paramKey, nextValues.join(','))
      else next.delete(paramKey)
    })
  }

  const setSingleFilter = (key: SingleFilterKey, value: number | boolean) => {
    updateParams((next) => {
      if (key === 'rating') {
        if (Number(value) > 0) next.set('rating', String(value))
        else next.delete('rating')
      } else if (key === 'minPrice' || key === 'maxPrice') {
        const paramKey = key === 'minPrice' ? 'min' : 'max'
        if (Number(value) > 0) next.set(paramKey, String(value))
        else next.delete(paramKey)
      } else if (key === 'inStock') {
        if (value) next.set('stock', 'in')
        else next.delete('stock')
      }
    })
  }

  const setPricePreset = (min: number | null, max: number | null) => {
    updateParams((next) => {
      if (min === null) next.delete('min')
      else next.set('min', String(min))
      if (max === null) next.delete('max')
      else next.set('max', String(max))
    })
  }

  const clearAll = () => {
    const next = new URLSearchParams()
    if (sortValue !== 'popular') next.set('sort', sortValue)
    setParams(next, { replace: true })
  }

  const activeChips: { key: string; label: string; onRemove: () => void }[] = []
  if (filters.q) activeChips.push({ key: 'q', label: `“${filters.q}”`, onRemove: () => setParam('q', '') })
  filters.categories.forEach((slug) => {
    const category = categoryMeta.find((item) => item.slug === slug)
    activeChips.push({ key: `cat-${slug}`, label: category?.name ?? slug, onRemove: () => toggleGroup('categories', slug) })
  })
  filters.authors.forEach((author) => activeChips.push({ key: `author-${author}`, label: author, onRemove: () => toggleGroup('authors', author) }))
  filters.languages.forEach((language) => activeChips.push({ key: `lang-${language}`, label: language, onRemove: () => toggleGroup('languages', language) }))
  filters.formats.forEach((format) => activeChips.push({ key: `format-${format}`, label: format, onRemove: () => toggleGroup('formats', format) }))
  if (filters.rating > 0) activeChips.push({ key: 'rating', label: `${filters.rating}★ & up`, onRemove: () => setSingleFilter('rating', 0) })
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label = filters.minPrice !== null && filters.maxPrice !== null
      ? `${formatINR(filters.minPrice)} – ${formatINR(filters.maxPrice)}`
      : filters.maxPrice !== null
        ? `Under ${formatINR(filters.maxPrice)}`
        : `From ${formatINR(filters.minPrice ?? 0)}`
    activeChips.push({ key: 'price', label, onRemove: () => updateParams((next) => { next.delete('min'); next.delete('max') }) })
  }
  if (filters.inStock) activeChips.push({ key: 'stock', label: 'In stock', onRemove: () => setSingleFilter('inStock', false) })
  if (filters.collection) activeChips.push({ key: 'collection', label: collection?.title ?? filters.collection, onRemove: () => setParam('collection', '') })

  const activeCount = activeChips.length

  const filterProps = {
    filters,
    onToggle: toggleGroup,
    onSet: setSingleFilter,
    onClear: clearAll,
    onPricePreset: setPricePreset,
    resultCount: filtered.length,
  }

  return (
    <div className="catalogue-page">
      <div className="container">
        <PageHeader eyebrow="The bookshop" title={pageTitle} description={pageDescription}>
          <div className="catalogue-stats">
            <span><strong>{books.length}</strong> hand-picked titles</span>
            <span className="catalogue-stats__divider" aria-hidden="true" />
            <span><strong>{categories.length}</strong> shelves</span>
            <span className="catalogue-stats__divider" aria-hidden="true" />
            <span>Free delivery over ₹1,499</span>
          </div>
        </PageHeader>

        <nav className="catalogue-shelves" aria-label="Browse categories">
          <button
            type="button"
            className={`shelf-pill ${filters.categories.length === 0 ? 'is-active' : ''}`}
            onClick={() => updateParams((next) => next.delete('category'))}
          >
            All shelves
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`shelf-pill ${filters.categories.includes(category.slug) ? 'is-active' : ''}`}
              aria-pressed={filters.categories.includes(category.slug)}
              onClick={() => {
                updateParams((next) => {
                  const current = readList(next.get('category'))
                  const nextValues = current.length === 1 && current[0] === category.slug
                    ? []
                    : [category.slug]
                  if (nextValues.length > 0) next.set('category', nextValues.join(','))
                  else next.delete('category')
                })
              }}
            >
              {category.name}
              <span>{category.count}</span>
            </button>
          ))}
        </nav>

        <div className="catalogue-toolbar">
          <div className="catalogue-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search within the collection…"
              value={filters.q}
              aria-label="Search within the collection"
              onChange={(event) => setParam('q', event.target.value)}
            />
            {filters.q ? (
              <button type="button" className="catalogue-search__clear" onClick={() => setParam('q', '')} aria-label="Clear search">
                <Icon name="close" size={13} />
              </button>
            ) : null}
          </div>

          <div className="catalogue-toolbar__right">
            <button type="button" className="filter-toggle" onClick={() => setMobileFilters(true)} aria-expanded={mobileFilters}>
              <Icon name="filter" size={16} />
              Filters
              {activeCount > 0 ? <span className="filter-toggle__count">{activeCount}</span> : null}
            </button>
            <label className="sort-control">
              <span>Sort by</span>
              <select aria-label="Sort books by" value={sortValue} onChange={(event) => setParam('sort', event.target.value === 'popular' ? '' : event.target.value)}>
                <option value="popular">Most loved</option>
                <option value="newest">Newest first</option>
                <option value="rating">Highest rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="title">Title: A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {activeChips.length > 0 ? (
          <div className="active-filters" aria-label="Active filters">
            <span className="active-filters__label">Active:</span>
            {activeChips.map((chip) => (
              <button key={chip.key} type="button" className="filter-chip" onClick={chip.onRemove}>
                {chip.label}
                <Icon name="close" size={11} />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button type="button" className="active-filters__clear" onClick={clearAll}>Clear all</button>
          </div>
        ) : null}

        <div className="catalogue-layout">
          <aside className="catalogue-sidebar" aria-label="Book filters">
            <FilterPanel {...filterProps} />
          </aside>

          <div className="catalogue-results">
            <div className="catalogue-results__head">
              <p aria-live="polite">
                Showing <strong>{visibleBooks.length}</strong> of <strong>{filtered.length}</strong> {filtered.length === 1 ? 'book' : 'books'}
              </p>
              {filters.q ? <span className="catalogue-results__term">for “{filters.q}”</span> : null}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon="search"
                eyebrow="No matches"
                title="No books on this shelf yet"
                description="Try a broader price range, another author, or clear a filter or two. The right book is often one shelf over."
                action={
                  <div className="empty-state__buttons">
                    <button type="button" className="btn btn--primary" onClick={clearAll}>Clear all filters</button>
                    <button type="button" className="btn btn--outline" onClick={() => setParam('q', '')}>Clear search</button>
                  </div>
                }
              />
            ) : (
              <>
                <div className="book-grid book-grid--catalogue">
                  {visibleBooks.map((book, index) => (
                    <Reveal key={book.id} delay={index % 4 * 45}>
                      <BookCard book={book} priority={index < 4} />
                    </Reveal>
                  ))}
                </div>
                <div className="catalogue-more">
                  <p>You&apos;ve seen {visibleBooks.length} of {filtered.length} books</p>
                  {visibleCount < filtered.length ? (
                    <button type="button" className="btn btn--outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                      Load more books
                      <Icon name="plus" size={15} />
                    </button>
                  ) : (
                    <span className="catalogue-more__end">That&apos;s the whole shelf.</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`filter-drawer-backdrop ${mobileFilters ? 'is-open' : ''}`} onClick={() => setMobileFilters(false)} aria-hidden="true" />
      <aside
        ref={filterDrawerRef}
        className={`filter-drawer ${mobileFilters ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Book filters"
        aria-hidden={!mobileFilters}
        inert={!mobileFilters}
        tabIndex={-1}
      >
        <div className="filter-drawer__header">
          <div>
            <span className="eyebrow">Refine</span>
            <h2>Find your book</h2>
          </div>
          <button type="button" className="icon-button" onClick={() => setMobileFilters(false)} aria-label="Close filters">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="filter-drawer__body">
          <FilterPanel {...filterProps} />
        </div>
        <div className="filter-drawer__footer">
          <button type="button" className="btn btn--ghost" onClick={clearAll}>Clear all</button>
          <button type="button" className="btn btn--primary" onClick={() => setMobileFilters(false)}>
            Show {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
          </button>
        </div>
      </aside>
    </div>
  )
}
