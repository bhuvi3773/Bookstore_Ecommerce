import { Icon } from './Icon'

interface RatingProps {
  rating: number
  reviewsCount?: number
  compact?: boolean
}

export function Rating({ rating, reviewsCount, compact = false }: RatingProps) {
  if (!rating || rating <= 0) return null
  const rounded = Math.round(rating * 2) / 2

  return (
    <div
      className={`rating ${compact ? 'rating--compact' : ''}`}
      aria-label={`${rating.toFixed(1)} out of 5${reviewsCount ? `, ${reviewsCount} reviews` : ''}`}
    >
      <span className="rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`rating__star ${rounded >= star ? 'is-full' : rounded >= star - 0.5 ? 'is-half' : ''}`}>
            <Icon name="star" size={compact ? 12 : 13} />
          </span>
        ))}
      </span>
      <span className="rating__value">{rating.toFixed(1)}</span>
      {typeof reviewsCount === 'number' ? <span className="rating__count">({reviewsCount})</span> : null}
    </div>
  )
}
