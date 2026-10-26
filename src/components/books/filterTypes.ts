export interface CatalogueFilters {
  q: string
  categories: string[]
  authors: string[]
  languages: string[]
  formats: string[]
  rating: number
  minPrice: number | null
  maxPrice: number | null
  inStock: boolean
  collection: string
}

export type FilterGroup = 'categories' | 'authors' | 'languages' | 'formats'
export type SingleFilterKey = 'rating' | 'minPrice' | 'maxPrice' | 'inStock'

export const emptyFilters: CatalogueFilters = {
  q: '',
  categories: [],
  authors: [],
  languages: [],
  formats: [],
  rating: 0,
  minPrice: null,
  maxPrice: null,
  inStock: false,
  collection: '',
}
