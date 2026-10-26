import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, description, backTo, backLabel = 'Back', children }: PageHeaderProps) {
  return (
    <header className="page-header">
      {backTo ? (
        <Link to={backTo} className="page-header__back">
          <Icon name="arrow-left" size={15} />
          <span>{backLabel}</span>
        </Link>
      ) : null}
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-header__title">{title}</h1>
      {description ? <p className="page-header__description">{description}</p> : null}
      {children ? <div className="page-header__extra">{children}</div> : null}
    </header>
  )
}
