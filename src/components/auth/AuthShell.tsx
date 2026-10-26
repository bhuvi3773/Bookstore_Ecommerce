import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getBookBySlug } from '../../data/books'
import { BookCover } from '../ui/BookCover'
import { Icon } from '../ui/Icon'

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  asideTitle?: string
  asideText?: string
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  asideTitle = 'A bookshop for people who take their time.',
  asideText = 'Sign in to keep your demo orders, wishlist and reading trail together. Everything stays on this device — no account is ever created on a server.',
}: AuthShellProps) {
  const covers = [
    getBookBySlug('the-mapmakers-daughter'),
    getBookBySlug('the-linen-room'),
    getBookBySlug('quiet-morning-habits'),
  ].filter((book): book is NonNullable<typeof book> => Boolean(book))

  return (
    <div className="auth-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">{title}</span>
        </nav>

        <div className="auth-layout">
          <aside className="auth-aside">
            <span className="eyebrow">The Hawthorn account</span>
            <h2>{asideTitle}</h2>
            <p>{asideText}</p>
            <div className="auth-covers" aria-hidden="true">
              {covers.map((book, index) => (
                <span key={book.id} className={`auth-covers__book auth-covers__book--${index}`}>
                  <BookCover book={book} decorative />
                </span>
              ))}
            </div>
            <blockquote className="auth-quote">
              <Icon name="quote" size={22} />
              “The right book at the right time can feel like a conversation you needed to have.”
              <span>— The Hawthorn booksellers</span>
            </blockquote>
            <ul className="auth-perks">
              <li><Icon name="heart" size={15} /> Keep a wishlist across visits</li>
              <li><Icon name="package" size={15} /> Revisit your demo orders</li>
              <li><Icon name="shield" size={15} /> No real account or data leaves this device</li>
            </ul>
          </aside>

          <div className="auth-panel">
            <div className="auth-panel__head">
              <span className="eyebrow">{eyebrow}</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            {children}
            {footer ? <div className="auth-panel__footer">{footer}</div> : null}
            <p className="auth-panel__note">
              <Icon name="shield" size={14} />
              Demo authentication only. No password is stored or checked, and no email is sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
