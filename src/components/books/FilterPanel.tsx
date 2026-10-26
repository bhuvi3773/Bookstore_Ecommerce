import { useState } from 'react'
import { authors, categoryMeta, formats, languages } from '../../data/books'
import { Icon } from '../ui/Icon'
import type { CatalogueFilters, FilterGroup, SingleFilterKey } from './filterTypes'

interface FilterPanelProps {
  filters: CatalogueFilters
  onToggle: (group: FilterGroup, value: string) => void
  onSet: (key: SingleFilterKey, value: number | boolean) => void
  onClear: () => void
  onPricePreset: (min: number | null, max: number | null) => void
  resultCount: number
}

const pricePresets = [
  { label: 'Under ₹499', min: null, max: 499 },
  { label: '₹500 – ₹799', min: 500, max: 799 },
  { label: '₹800 – ₹999', min: 800, max: 999 },
  { label: '₹1,000 and above', min: 1000, max: null },
]

export function FilterPanel({ filters, onToggle, onSet, onClear, onPricePreset, resultCount }: FilterPanelProps) {
  const [showAllAuthors, setShowAllAuthors] = useState(false)
  const visibleAuthors = showAllAuthors ? authors : authors.slice(0, 8)
  const activeCount =
    filters.categories.length +
    filters.authors.length +
    filters.languages.length +
    filters.formats.length +
    (filters.rating ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.collection ? 1 : 0)

  return (
    <div className="filter-panel">
      <div className="filter-panel__head">
        <div>
          <span className="eyebrow">Refine</span>
          <h2>Filters</h2>
        </div>
        {activeCount > 0 ? (
          <button type="button" className="filter-clear" onClick={onClear}>
            Clear all
          </button>
        ) : null}
      </div>

      <fieldset className="filter-group">
        <legend>Category</legend>
        <div className="filter-options filter-options--scroll">
          {categoryMeta.map((category) => {
            const checked = filters.categories.includes(category.slug)
            return (
              <label key={category.slug} className={`check-row ${checked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle('categories', category.slug)}
                />
                <span className="check-row__box" aria-hidden="true"><Icon name="check" size={11} /></span>
                <span className="check-row__label">{category.name}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price</legend>
        <div className="price-presets">
          {pricePresets.map((preset) => {
            const active = filters.minPrice === preset.min && filters.maxPrice === preset.max
            return (
              <button
                key={preset.label}
                type="button"
                className={`price-preset ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onPricePreset(preset.min, preset.max)}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
        <div className="price-range">
          <label>
            <span>Min ₹</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={(event) => onSet('minPrice', event.target.value === '' ? 0 : Number(event.target.value))}
            />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            <span>Max ₹</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="2,000"
              value={filters.maxPrice ?? ''}
              onChange={(event) => onSet('maxPrice', event.target.value === '' ? 0 : Number(event.target.value))}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Rating</legend>
        <div className="filter-options">
          {[
            { value: 0, label: 'Any rating' },
            { value: 4.5, label: '4.5 and above' },
            { value: 4, label: '4.0 and above' },
            { value: 3.5, label: '3.5 and above' },
          ].map((option) => (
            <label key={option.value} className={`check-row check-row--radio ${filters.rating === option.value ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name="rating-filter"
                checked={filters.rating === option.value}
                onChange={() => onSet('rating', option.value)}
              />
              <span className="check-row__dot" aria-hidden="true" />
              <span className="check-row__label">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Language</legend>
        <div className="filter-options">
          {languages.map((language) => {
            const checked = filters.languages.includes(language)
            return (
              <label key={language} className={`check-row ${checked ? 'is-checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => onToggle('languages', language)} />
                <span className="check-row__box" aria-hidden="true"><Icon name="check" size={11} /></span>
                <span className="check-row__label">{language}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Format</legend>
        <div className="filter-options">
          {formats.map((format) => {
            const checked = filters.formats.includes(format)
            return (
              <label key={format} className={`check-row ${checked ? 'is-checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => onToggle('formats', format)} />
                <span className="check-row__box" aria-hidden="true"><Icon name="check" size={11} /></span>
                <span className="check-row__label">{format}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Author</legend>
        <div className="filter-options filter-options--scroll">
          {visibleAuthors.map((author) => {
            const checked = filters.authors.includes(author)
            return (
              <label key={author} className={`check-row ${checked ? 'is-checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => onToggle('authors', author)} />
                <span className="check-row__box" aria-hidden="true"><Icon name="check" size={11} /></span>
                <span className="check-row__label">{author}</span>
              </label>
            )
          })}
        </div>
        {authors.length > 8 ? (
          <button type="button" className="filter-more" onClick={() => setShowAllAuthors((show) => !show)}>
            {showAllAuthors ? 'Show fewer authors' : `Show all ${authors.length} authors`}
          </button>
        ) : null}
      </fieldset>

      <fieldset className="filter-group filter-group--last">
        <legend>Availability</legend>
        <label className={`toggle-row ${filters.inStock ? 'is-checked' : ''}`}>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) => onSet('inStock', event.target.checked)}
          />
          <span className="toggle-row__switch" aria-hidden="true"><span /></span>
          <span>Only show books in stock</span>
        </label>
      </fieldset>

      <p className="filter-panel__result">
        <Icon name="book" size={15} /> {resultCount} {resultCount === 1 ? 'book' : 'books'} match
      </p>
    </div>
  )
}
