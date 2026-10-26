import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { books } from '../../data/books'
import { formatINR } from '../../utils/format'
import { BookCover } from '../ui/BookCover'
import { Icon } from '../ui/Icon'

interface SearchBoxProps {
  idPrefix: string
  onNavigate?: () => void
  autoFocus?: boolean
}

export function SearchBox({ idPrefix, onNavigate, autoFocus = false }: SearchBoxProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return books
      .filter((book) =>
        [book.title, book.author, book.category, ...(book.tags ?? [])].some((field) => field.toLowerCase().includes(term)),
      )
      .slice(0, 5)
  }, [query])

  const listId = `${idPrefix}-search-results`
  const showPanel = open && query.trim().length > 0

  const goToResults = () => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    onNavigate?.()
  }

  const openBook = (slug: string) => {
    navigate(`/books/${slug}`)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    onNavigate?.()
  }

  return (
    <div
      ref={wrapperRef}
      className="search-box"
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false)
          setActiveIndex(-1)
        }
      }}
    >
      <form
        className="search-box__form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            openBook(suggestions[activeIndex].slug)
          } else {
            goToResults()
          }
        }}
      >
        <Icon name="search" size={17} className="search-box__icon" />
        <input
          ref={inputRef}
          className="search-box__input"
          type="search"
          value={query}
          placeholder="Search titles, authors, categories…"
          aria-label="Search books, authors and categories"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((current) => Math.max(current - 1, -1))
            } else if (event.key === 'Escape') {
              setOpen(false)
              setActiveIndex(-1)
            }
          }}
        />
        {query ? (
          <button
            type="button"
            className="search-box__clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              setOpen(false)
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
          >
            <Icon name="close" size={13} />
          </button>
        ) : (
          <span className="search-box__hint" aria-hidden="true">Enter</span>
        )}
      </form>

      {showPanel ? (
        <div className="search-panel" id={listId} role="listbox" aria-label="Search suggestions">
          {suggestions.length > 0 ? (
            <>
              <span className="search-panel__label">Books &amp; authors</span>
              <ul>
                {suggestions.map((book, index) => (
                  <li key={book.id} role="option" id={`${listId}-${index}`} aria-selected={activeIndex === index}>
                    <button
                      type="button"
                      className={`search-result ${activeIndex === index ? 'is-active' : ''}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => openBook(book.slug)}
                    >
                      <span className="search-result__cover"><BookCover book={book} decorative /></span>
                      <span className="search-result__copy">
                        <strong>{book.title}</strong>
                        <span>{book.author} · {book.category}</span>
                      </span>
                      <span className="search-result__price">{formatINR(book.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="search-panel__all" onMouseDown={(event) => event.preventDefault()} onClick={goToResults}>
                <span>See all results for “{query.trim()}”</span>
                <Icon name="arrow-right" size={15} />
              </button>
            </>
          ) : (
            <div className="search-panel__empty">
              <Icon name="search" size={20} />
              <p>No quick matches for “{query.trim()}”.</p>
              <button type="button" className="text-link" onMouseDown={(event) => event.preventDefault()} onClick={goToResults}>
                Search the full catalogue <Icon name="arrow-right" size={14} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
