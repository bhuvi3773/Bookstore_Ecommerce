import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { Book } from '../../types'
import { BookCard } from './BookCard'
import { Icon } from '../ui/Icon'

interface BookCarouselProps {
  books: Book[]
  label: string
}

interface DragState {
  active: boolean
  pointerId: number | null
  startX: number
  startY: number
  startScroll: number
  moved: boolean
  mouse: boolean
}

const emptyDrag: DragState = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  startScroll: 0,
  moved: false,
  mouse: false,
}

export function BookCarousel({ books, label }: BookCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState>({ ...emptyDrag })
  const [dragging, setDragging] = useState(false)

  const scrollBehavior = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  const cardStep = () => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('.book-card')
    return card ? card.offsetWidth + 24 : 300
  }

  const scrollByCards = (direction: number, cards = 2) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * cardStep() * cards, behavior: scrollBehavior() })
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const track = trackRef.current
    if (!track) return

    drag.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: track.scrollLeft,
      moved: false,
      mouse: event.pointerType === 'mouse',
    }

    if (drag.current.mouse) {
      setDragging(true)
      track.setPointerCapture(event.pointerId)
    }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || !drag.current.active || event.pointerId !== drag.current.pointerId) return

    const deltaX = event.clientX - drag.current.startX
    const deltaY = event.clientY - drag.current.startY
    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) drag.current.moved = true

    if (!drag.current.mouse) return
    track.scrollLeft = drag.current.startScroll - deltaX
  }

  const endDrag = () => {
    if (!drag.current.active) return
    const track = trackRef.current
    const dragged = drag.current.mouse && drag.current.moved && track
      ? track.scrollLeft - drag.current.startScroll
      : 0

    drag.current.active = false
    drag.current.pointerId = null
    setDragging(false)

    // A mouse drag has no native momentum, so mandatory snap can pull a
    // deliberate drag back to where it started. Advance one card instead.
    if (track && Math.abs(dragged) >= 60) {
      const direction = dragged > 0 ? 1 : -1
      window.requestAnimationFrame(() => {
        scrollByCards(direction, 1)
      })
    }
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollByCards(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollByCards(1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      track.scrollTo({ left: 0, behavior: scrollBehavior() })
    } else if (event.key === 'End') {
      event.preventDefault()
      track.scrollTo({ left: track.scrollWidth, behavior: scrollBehavior() })
    }
  }

  return (
    <div className={`carousel ${dragging ? 'is-dragging' : ''}`}>
      <div className="carousel__controls">
        <button type="button" className="icon-button" onClick={() => scrollByCards(-1)} aria-label={`Scroll ${label} backwards`}>
          <Icon name="arrow-left" size={18} />
        </button>
        <button type="button" className="icon-button" onClick={() => scrollByCards(1)} aria-label={`Scroll ${label} forwards`}>
          <Icon name="arrow-right" size={18} />
        </button>
      </div>
      <div
        ref={trackRef}
        className="carousel__track"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${label}. Use the left and right arrow keys or the arrow buttons to browse.`}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (event.buttons === 0) endDrag()
        }}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={handleKeyDown}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault()
            event.stopPropagation()
            drag.current.moved = false
          }
        }}
      >
        {books.map((book, index) => (
          <div
            className="carousel__slide"
            key={book.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${books.length}`}
          >
            <BookCard book={book} priority={index < 2} />
          </div>
        ))}
      </div>
    </div>
  )
}
