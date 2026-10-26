import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

interface EmptyStateProps {
  icon?: IconName
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon = 'book', eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <Icon name={icon} size={30} />
      </div>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__text">{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}
