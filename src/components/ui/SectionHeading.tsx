import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  children?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  children,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === 'center' ? 'section-heading--center' : ''}`}>
      <div className="section-heading__copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="section-heading__title">{title}</h2>
        {description ? <p className="section-heading__text">{description}</p> : null}
      </div>
      <div className="section-heading__actions">
        {children}
        {actionLabel && actionTo ? (
          <Link to={actionTo} className="text-link">
            <span>{actionLabel}</span>
            <Icon name="arrow-right" size={16} />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
