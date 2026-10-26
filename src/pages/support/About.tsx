import { Link } from 'react-router-dom'
import { getBookBySlug } from '../../data/books'
import { BookCover } from '../../components/ui/BookCover'
import { Icon } from '../../components/ui/Icon'
import { PageHeader } from '../../components/ui/PageHeader'
import { Reveal } from '../../components/ui/Reveal'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const values = [
  {
    icon: 'book' as const,
    title: 'Chosen by hand',
    copy: 'Every shelf is built by a bookseller, not an algorithm. We keep the list small enough to have an opinion about every title on it.',
  },
  {
    icon: 'leaf' as const,
    title: 'Beautifully made',
    copy: 'We care about paper, type, margins and the particular pleasure of a cover that feels right in your hands.',
  },
  {
    icon: 'users' as const,
    title: 'For real readers',
    copy: 'Books for long commutes, slow Sundays, book clubs and the friend who always asks what to read next.',
  },
  {
    icon: 'refresh' as const,
    title: 'Built to last',
    copy: 'A shop that would rather sell you the right book once than three books you do not need.',
  },
]

const stats = [
  { value: '36', label: 'hand-picked titles' },
  { value: '12', label: 'distinct shelves' },
  { value: '2014', label: 'the year we imagined opening' },
  { value: '0', label: 'real payments taken' },
]

export default function About() {
  useDocumentTitle('Our story')

  const covers = [
    getBookBySlug('the-linen-room'),
    getBookBySlug('weathered-pages'),
    getBookBySlug('the-monsoon-letters'),
  ].filter((book): book is NonNullable<typeof book> => Boolean(book))

  return (
    <div className="about-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">Our story</span>
        </nav>

        <PageHeader
          eyebrow="Our story"
          title="A bookshop for the long way round."
          description="Hawthorn is a fictional independent bookshop with a very real point of view: fewer books, chosen with care, for readers who like to take their time."
        />

        <section className="about-hero">
          <Reveal className="about-hero__art" ariaHidden>
            <div className="about-hero__halo" />
            {covers.map((book, index) => (
              <span key={book.id} className={`about-hero__cover about-hero__cover--${index}`}>
                <BookCover book={book} decorative eager={index === 1} />
              </span>
            ))}
            <span className="about-hero__stamp">Est.<br />2014</span>
          </Reveal>
          <Reveal className="about-hero__copy" delay={90}>
            <span className="eyebrow">Why we exist</span>
            <h2>Some shops sell books. We would rather help you find one.</h2>
            <p>
              Hawthorn began as a daydream: a small shop with warm lamps, a narrow staircase and shelves
              organised by feeling as much as genre. This site is that daydream, rendered in React.
            </p>
            <p>
              The catalogue is deliberately modest — thirty-six titles across twelve shelves. Each one was
              chosen for a reason, and each cover was drawn for this project rather than borrowed.
            </p>
            <Link to="/books" className="btn btn--primary">
              Browse the shelves
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
        </section>

        <section className="about-stats" aria-label="The shop in numbers">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} className="about-stat" delay={index * 50}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </section>

        <section className="about-values">
          <Reveal>
            <div className="about-values__head">
              <span className="eyebrow">What we believe</span>
              <h2>Four things we would put on the wall.</h2>
            </div>
          </Reveal>
          <div className="about-values__grid">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 60}>
                <article className="about-value">
                  <span className="about-value__icon"><Icon name={value.icon} size={20} /></span>
                  <h3>{value.title}</h3>
                  <p>{value.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="about-note">
          <Reveal className="about-note__quote">
            <Icon name="quote" size={26} />
            <blockquote>
              “The right book at the right time can feel like a conversation you needed to have.”
            </blockquote>
            <span>— The Hawthorn booksellers</span>
          </Reveal>
          <Reveal className="about-note__copy" delay={80}>
            <span className="eyebrow">A note on this project</span>
            <h2>Made with care, and a little honesty.</h2>
            <p>
              This is a complete frontend demonstration built with React, TypeScript, Vite and React Router.
              There is no backend, no database and no authentication. Your bag, wishlist and demo orders are
              saved in your browser so the experience feels continuous.
            </p>
            <p>
              The covers are original CSS and SVG designs. The reviews are clearly labelled as illustrative.
              The checkout tells you, plainly, that no payment is taken.
            </p>
            <div className="about-note__actions">
              <Link to="/contact" className="btn btn--outline">Say hello</Link>
              <Link to="/faq" className="text-link">Read the FAQs <Icon name="arrow-right" size={15} /></Link>
            </div>
          </Reveal>
        </section>

        <section className="about-cta">
          <Reveal>
            <span className="eyebrow">The reading room is open</span>
            <h2>Stay for one more chapter.</h2>
            <p>Twelve shelves, thirty-six books, and no pressure to leave.</p>
          </Reveal>
          <Reveal className="about-cta__actions" delay={80}>
            <Link to="/books" className="btn btn--light">Browse all books</Link>
            <Link to="/wishlist" className="btn btn--outline btn--on-dark">Your wishlist</Link>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
