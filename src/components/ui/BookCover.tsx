import type { CSSProperties } from 'react'
import type { Book } from '../../types'

interface Palette {
  bg: string
  bg2: string
  ink: string
  accent: string
  tone: string
}

const palettes: Palette[] = [
  { bg: '#143b31', bg2: '#0b2922', ink: '#f4ecd9', accent: '#d8b26a', tone: 'forest' },
  { bg: '#f0e3cc', bg2: '#e5d2b1', ink: '#1f342b', accent: '#9f4b31', tone: 'paper' },
  { bg: '#5b1c2a', bg2: '#351019', ink: '#f7ead7', accent: '#d8b26a', tone: 'wine' },
  { bg: '#172a3e', bg2: '#0b1725', ink: '#f2e7d1', accent: '#ce9662', tone: 'navy' },
  { bg: '#64653b', bg2: '#424326', ink: '#f5edd9', accent: '#e0bd7c', tone: 'olive' },
  { bg: '#b75c3c', bg2: '#8d3d2a', ink: '#fff3df', accent: '#f3d5a3', tone: 'terracotta' },
  { bg: '#40536a', bg2: '#273647', ink: '#f4ead6', accent: '#c4a06a', tone: 'slate' },
  { bg: '#d6ad45', bg2: '#bc9333', ink: '#282315', accent: '#4a3b1b', tone: 'ochre' },
  { bg: '#1d1d1a', bg2: '#090908', ink: '#f3ead8', accent: '#d8b26a', tone: 'ink' },
  { bg: '#9aa684', bg2: '#7a8765', ink: '#1c2c23', accent: '#f0e5ce', tone: 'sage' },
  { bg: '#b9878c', bg2: '#9b6770', ink: '#2d1a20', accent: '#f7e1d4', tone: 'dusty-rose' },
  { bg: '#1e5c5b', bg2: '#103c3b', ink: '#f1e8d5', accent: '#d6ae68', tone: 'teal' },
  { bg: '#4d2c50', bg2: '#2d1730', ink: '#f6e9d8', accent: '#d9b26d', tone: 'plum' },
  { bg: '#f4ecd9', bg2: '#e7d7b8', ink: '#173a31', accent: '#a7442d', tone: 'cream' },
  { bg: '#2e2e31', bg2: '#171719', ink: '#f3e8d5', accent: '#d3a35c', tone: 'charcoal' },
  { bg: '#8c5a2b', bg2: '#6b421d', ink: '#f8edd8', accent: '#e3c184', tone: 'amber' },
  { bg: '#244a34', bg2: '#15301f', ink: '#f4ecd9', accent: '#c8a15d', tone: 'pine' },
  { bg: '#f6e8dc', bg2: '#ead1bf', ink: '#4b1f26', accent: '#b04a45', tone: 'blush' },
]

function paletteFor(book: Book) {
  const hash = `${book.id}${book.title}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return palettes[hash % palettes.length]
}

function Motif({ category }: { category: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (category) {
    case 'Mystery':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <circle cx="105" cy="88" r="48" {...common} />
          <path d="M105 40a48 48 0 0 0 0 96 48 48 0 0 1 0-96Z" fill="currentColor" stroke="none" opacity=".26" />
          <circle cx="105" cy="88" r="13" {...common} />
          <path d="M105 101v20m-6 0h12m-8 0v13m4-13v13" {...common} />
          <path d="M42 155h116M58 162h84" {...common} opacity=".5" />
        </svg>
      )
    case 'Romance':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <circle cx="86" cy="94" r="43" {...common} />
          <circle cx="118" cy="94" r="43" {...common} />
          <path d="M102 56c8 15 8 63 0 76" {...common} opacity=".55" />
          <path d="M61 153c22-13 56-13 78 0" {...common} opacity=".55" />
          <path d="M100 27v10M145 42l-7 7M55 42l7 7" {...common} opacity=".5" />
        </svg>
      )
    case 'Fantasy':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M30 145 75 73l25 38 17-26 50 60Z" {...common} />
          <path d="M75 73l12 18-18 7" {...common} opacity=".6" />
          <path d="M126 58l3.7 8.3 9 .8-6.8 6 2 8.9-7.9-4.7-7.9 4.7 2-8.9-6.8-6 9-.8L126 58Z" fill="currentColor" stroke="none" opacity=".8" />
          <circle cx="155" cy="46" r="2" fill="currentColor" stroke="none" />
          <circle cx="50" cy="50" r="2" fill="currentColor" stroke="none" />
          <path d="M40 160h120" {...common} opacity=".4" />
        </svg>
      )
    case 'Self-Help':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <circle cx="100" cy="93" r="30" {...common} />
          <path d="M100 41v18M100 127v18M48 93h18M134 93h18M63 56l13 13M124 117l13 13M137 56l-13 13M76 117l-13 13" {...common} />
          <path d="M67 157c20-13 46-13 66 0" {...common} opacity=".5" />
        </svg>
      )
    case 'Business':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M44 152V112h20v40M82 152V88h20v64M120 152V64h20v88M158 152V43" {...common} />
          <path d="M36 152h132" {...common} />
          <path d="m44 98 38-24 38-12 30-20" {...common} opacity=".6" />
          <circle cx="150" cy="42" r="3" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'Technology':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <circle cx="100" cy="92" r="13" {...common} />
          <circle cx="55" cy="53" r="8" {...common} />
          <circle cx="147" cy="55" r="8" {...common} />
          <circle cx="50" cy="137" r="8" {...common} />
          <circle cx="150" cy="139" r="8" {...common} />
          <path d="M60 59 89 84M140 61l-27 22M56 132l31-28M144 133l-31-28" {...common} />
          <path d="M45 165h110" {...common} opacity=".4" />
        </svg>
      )
    case 'Academic':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M45 150h110M58 150V75m22 75V75m40 75V75m22 75V75M50 75h100M45 62l55-24 55 24Z" {...common} />
          <path d="M38 159h124" {...common} opacity=".45" />
          <circle cx="100" cy="62" r="5" {...common} />
        </svg>
      )
    case "Children's":
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M118 47a49 49 0 1 0 35 81 44 44 0 1 1-35-81Z" fill="currentColor" stroke="none" opacity=".7" />
          <path d="M67 65l3.6 8.2 8.9.8-6.7 5.9 2 8.8-7.8-4.6-7.8 4.6 2-8.8-6.7-5.9 8.9-.8L67 65Z" fill="currentColor" stroke="none" opacity=".75" />
          <circle cx="145" cy="49" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="158" cy="77" r="1.8" fill="currentColor" stroke="none" />
          <path d="M34 159c28-17 49-16 65 1 17-17 40-16 67 0" {...common} opacity=".55" />
        </svg>
      )
    case 'Biography':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M45 157c23-37 26-58 12-74-10-12 4-28 21-21 22 9 15 38 32 51 13 10 27 15 43 14" {...common} strokeDasharray="3 6" />
          <circle cx="100" cy="70" r="8" {...common} />
          <path d="M100 54v-9M100 95v-9M84 70h-9M125 70h-9" {...common} opacity=".6" />
          <path d="M62 46c15-8 32-10 48-5" {...common} opacity=".4" />
        </svg>
      )
    case 'Poetry':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M124 45c-25 18-36 42-30 67 4 17 18 31 22 45-28-11-46-38-43-65 3-25 25-44 51-47Z" {...common} />
          <path d="M122 52c-7 25-23 45-45 58M112 69c-6 0-12-2-17-6M106 83c7-1 13-3 18-7M94 101c-6-2-11-5-15-10M84 119c6 0 12 1 17 4" {...common} opacity=".65" />
          <path d="M56 158h88" {...common} opacity=".4" />
        </svg>
      )
    case 'Comics':
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M100 38 111 76l36-20-20 38 38 10-38 12 20 37-36-20-11 38-11-38-36 20 20-37-38-12 38-10-20-38 36 20Z" {...common} />
          <circle cx="100" cy="95" r="16" {...common} opacity=".55" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 200 200" className="book-cover__motif" aria-hidden="true">
          <path d="M42 154c22-34 36-37 58-12 21-31 38-25 58 12" {...common} />
          <circle cx="100" cy="70" r="22" {...common} />
        </svg>
      )
  }
}

interface BookCoverProps {
  book: Book
  variant?: 'front' | 'back'
  className?: string
  decorative?: boolean
  eager?: boolean
}

export function BookCover({ book, variant = 'front', className = '', decorative = false, eager = false }: BookCoverProps) {
  const palette = paletteFor(book)
  const style = {
    '--cov-bg': palette.bg,
    '--cov-bg2': palette.bg2,
    '--cov-ink': palette.ink,
    '--cov-accent': palette.accent,
    containerType: 'inline-size',
  } as CSSProperties

  const accessibility = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img', 'aria-label': `Cover of ${book.title} by ${book.author}` }

  return (
    <div
      className={`book-cover book-cover--${variant} ${className}`.trim()}
      style={style}
      data-tone={palette.tone}
      data-eager={eager || undefined}
      {...accessibility}
    >
      <div className="book-cover__grain" aria-hidden="true" />
      <div className="book-cover__spine" aria-hidden="true" />
      {variant === 'front' ? (
        <div className="book-cover__face">
          <span className="book-cover__imprint">Hawthorn Editions</span>
          <div className="book-cover__art" aria-hidden="true">
            <Motif category={book.category} />
          </div>
          <div className="book-cover__title-wrap">
            <span className="book-cover__category">{book.category}</span>
            <span className="book-cover__title">{book.title}</span>
            <span className="book-cover__rule" aria-hidden="true" />
            <span className="book-cover__author">{book.author}</span>
          </div>
          <span className="book-cover__edition">A Hawthorn edition</span>
        </div>
      ) : (
        <div className="book-cover__face book-cover__face--back">
          <span className="book-cover__imprint">Hawthorn Editions</span>
          <span className="book-cover__back-quote">“A story worth keeping.”</span>
          <span className="book-cover__back-copy">{book.description}</span>
          <span className="book-cover__back-meta">
            {book.publisher} · {book.publishedYear ?? 2025}
          </span>
          <span className="book-cover__back-meta">{book.category} · {book.language}</span>
          <div className="book-cover__barcode" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="book-cover__isbn">{book.isbn}</span>
        </div>
      )}
      <span className="book-cover__sheen" aria-hidden="true" />
    </div>
  )
}
