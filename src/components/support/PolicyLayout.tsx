import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { PageHeader } from '../ui/PageHeader'

export interface PolicySection {
  title: string
  paragraphs?: string[]
  list?: string[]
}

interface PolicyLayoutProps {
  eyebrow: string
  title: string
  description: string
  intro: string
  sections: PolicySection[]
  children?: ReactNode
}

const policyLinks = [
  { to: '/shipping-policy', label: 'Delivery & shipping' },
  { to: '/returns-policy', label: 'Returns & exchanges' },
  { to: '/privacy-policy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms & conditions' },
]

export function PolicyLayout({ eyebrow, title, description, intro, sections, children }: PolicyLayoutProps) {
  return (
    <div className="policy-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">{title}</span>
        </nav>

        <PageHeader eyebrow={eyebrow} title={title} description={description} />

        <div className="policy-layout">
          <article className="policy-main">
            <p className="policy-intro">{intro}</p>
            {sections.map((section) => (
              <section className="policy-section" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            {children}
            <div className="policy-demo-note">
              <Icon name="shield" size={18} />
              <p>
                <strong>This is a demonstration store.</strong> Policies are illustrative only. No real orders
                are fulfilled, no payments are taken, and no personal data leaves this browser.
              </p>
            </div>
          </article>

          <aside className="policy-side">
            <span className="eyebrow">More from the shop</span>
            <nav aria-label="Policies and help">
              {policyLinks.map((link) => (
                <Link key={link.to} to={link.to} className={link.to.includes(title.toLowerCase().split(' ')[0]) ? 'is-active' : ''}>
                  <span>{link.label}</span>
                  <Icon name="chevron-right" size={13} />
                </Link>
              ))}
              <Link to="/faq">
                <span>FAQs</span>
                <Icon name="chevron-right" size={13} />
              </Link>
              <Link to="/contact">
                <span>Contact us</span>
                <Icon name="chevron-right" size={13} />
              </Link>
            </nav>
            <div className="policy-side__help">
              <Icon name="mail" size={18} />
              <p>Still wondering about something?</p>
              <Link to="/contact" className="text-link">Ask a bookseller <Icon name="arrow-right" size={14} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
