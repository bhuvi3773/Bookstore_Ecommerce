import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  books,
  categories,
  getBookById,
  getBookBySlug,
} from '../data/books'
import { BookCard } from '../components/books/BookCard'
import { BookCarousel } from '../components/books/BookCarousel'
import { BookCover } from '../components/ui/BookCover'
import { Icon } from '../components/ui/Icon'
import { NewsletterForm } from '../components/ui/NewsletterForm'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useStore } from '../context/StoreContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const featuredCategories = ['fiction', 'mystery', 'romance', 'fantasy', 'children-s', 'poetry']
const moods = ['Curl up', 'Keep me guessing', 'Escape', 'Grow'] as const

const shelves = [
  {
    title: 'The Slow Sunday Shelf',
    copy: 'Gentle novels, luminous essays and poetry for a day with nowhere to be.',
    to: '/books?collection=winter',
    coverIds: ['b11', 'b5', 'b32'],
  },
  {
    title: 'The Dark & Stormy Shelf',
    copy: 'Locked rooms, rain-soaked coasts and one more chapter after midnight.',
    to: '/categories/mystery',
    coverIds: ['b16', 'b2', 'b18'],
  },
  {
    title: 'The Little Readers Shelf',
    copy: 'Stories to read together, linger over and ask for again tomorrow.',
    to: '/categories/children-s',
    coverIds: ['b34', 'b9'],
  },
]

export default function Home() {
  const { recentlyViewed } = useStore()
  const [activeMood, setActiveMood] = useState<(typeof moods)[number]>('Curl up')

  useDocumentTitle()

  const bestsellers = books.filter((book) => book.bestseller).slice(0, 8)
  const newArrivals = books.filter((book) => book.newArrival).slice(0, 8)
  const editorPicks = books.filter((book) => book.editorPick)
  const featuredPick = getBookBySlug('design-for-humans') ?? editorPicks[0] ?? books[0]
  const heroMain = getBookBySlug('the-mapmakers-daughter') ?? books[0]
  const heroLeft = getBookBySlug('the-monsoon-letters') ?? books[1]
  const heroRight = getBookBySlug('quiet-morning-habits') ?? books[2]

  const moodBooks = useMemo(() => {
    const matches = books.filter((book) => book.moods?.includes(activeMood))
    return matches.slice(0, 4)
  }, [activeMood])

  const recentBooks = useMemo(() => {
    const viewed = recentlyViewed
      .map((id) => getBookById(id))
      .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book))
      .slice(0, 4)
    if (viewed.length > 0) return { books: viewed, personalised: true }
    return {
      books: books.filter((book) => book.rating >= 4.8).slice(0, 4),
      personalised: false,
    }
  }, [recentlyViewed])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__glow hero__glow--one" aria-hidden="true" />
        <div className="hero__glow hero__glow--two" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow hero-stagger" style={{ animationDelay: '80ms' }}>
              <Icon name="sparkle" size={15} />
              The winter reading room · 2026
            </span>
            <h1 className="hero__title">
              <span className="hero-stagger" style={{ animationDelay: '160ms' }}>Find the story</span>
              <span className="hero__title-em hero-stagger" style={{ animationDelay: '240ms' }}>that finds you.</span>
            </h1>
            <p className="hero__text hero-stagger" style={{ animationDelay: '330ms' }}>
              A hand-picked bookshop for curious minds and late-night readers. Discover new voices,
              beautiful editions and the books our booksellers cannot stop talking about.
            </p>
            <div className="hero__actions hero-stagger" style={{ animationDelay: '420ms' }}>
              <Link to="/books" className="btn btn--primary btn--large">
                Browse the shelves
                <Icon name="arrow-right" size={17} />
              </Link>
              <Link to="/books?collection=editors" className="btn btn--outline btn--large">
                Meet the editor&apos;s picks
              </Link>
            </div>
            <div className="hero__proof hero-stagger" style={{ animationDelay: '510ms' }}>
              <div className="hero__proof-avatars" aria-hidden="true">
                <span>AR</span><span>KM</span><span>MS</span><span>+</span>
              </div>
              <div className="hero__proof-copy">
                <span className="hero__proof-stars"><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star" size={12} /></span>
                <span>Loved by 12,000+ readers across India</span>
              </div>
            </div>
          </div>

          <div className="hero__art hero-stagger" style={{ animationDelay: '300ms' }} aria-label="A selection of featured books">
            <div className="hero__arch" aria-hidden="true">
              <div className="hero__orbit hero__orbit--one" />
              <div className="hero__orbit hero__orbit--two" />
            </div>
            <div className="hero__book hero__book--left">
              <BookCover book={heroLeft} decorative />
            </div>
            <div className="hero__book hero__book--right">
              <BookCover book={heroRight} decorative />
            </div>
            <div className="hero__book hero__book--main">
              <BookCover book={heroMain} decorative eager />
            </div>
            <div className="hero__seal">
              <span>Booksellers&apos;</span>
              <strong>Choice</strong>
              <span>2026</span>
            </div>
            <div className="hero__note">
              <span className="hero__note-kicker">Shelf note no. 21</span>
              <p>“A map, a daughter, and a world that refuses to stay put.”</p>
              <Link to={`/books/${heroMain.slug}`}>
                Read about it <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="container hero__foot">
          <span><Icon name="book" size={15} /> 36 titles chosen by hand</span>
          <span><Icon name="truck" size={15} /> Free delivery over ₹1,499</span>
          <span><Icon name="refresh" size={15} /> 30-day returns</span>
          <span className="hero__foot-note">Every order wrapped with care</span>
        </div>
      </section>

      <section className="section category-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Browse by shelf"
              title="A shelf for every kind of reader"
              description="Follow a mood, a curiosity or a familiar name. These are the doors our booksellers open most often."
              actionLabel="All books"
              actionTo="/books"
            />
          </Reveal>
          <p className="category-swipe-hint" aria-hidden="true">
            <Icon name="arrow-right" size={14} />
            Swipe through the shelves
          </p>
          <div className="category-grid category-grid--rail">
            {featuredCategories.map((slug, index) => {
              const category = categories.find((item) => item.slug === slug)
              if (!category) return null
              const covers = books.filter((book) => book.category === category.name).slice(0, 2)
              return (
                <Reveal key={slug} delay={index * 55}>
                  <Link to={`/categories/${category.slug}`} className={`category-card category-card--${category.tone}`}>
                    <div className="category-card__top">
                      <span className="category-card__index">0{index + 1}</span>
                      <span className="category-card__arrow"><Icon name="arrow-right" size={16} /></span>
                    </div>
                    <div className="category-card__copy">
                      <h3>{category.name}</h3>
                      <p>{category.tagline}</p>
                      <span className="category-card__count">{category.count} {category.count === 1 ? 'title' : 'titles'}</span>
                    </div>
                    <div className="category-card__stack" aria-hidden="true">
                      {covers.map((book, coverIndex) => (
                        <span key={book.id} className={`category-card__mini category-card__mini--${coverIndex}`}>
                          <BookCover book={book} decorative />
                        </span>
                      ))}
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--tint shelf-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Readers' favourites"
              title="The books everyone is recommending"
              description="Our most-loved titles this season, from bookseller obsessions to book-club winners."
              actionLabel="Shop all bestsellers"
              actionTo="/books?sort=rating"
            />
          </Reveal>
          <Reveal delay={70}>
            <BookCarousel books={bestsellers} label="Bestselling books" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Just arrived"
              title="New stories, fresh from the press"
              description="The latest arrivals on our shelves — new voices, new worlds and books to be early about."
              actionLabel="See all new arrivals"
              actionTo="/books?sort=newest"
            />
          </Reveal>
          <div className="book-grid book-grid--four">
            {newArrivals.slice(0, 4).map((book, index) => (
              <Reveal key={book.id} delay={index * 55}>
                <BookCard book={book} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section campaign-section">
        <div className="container">
          <div className="campaign">
            <Reveal className="campaign__art">
              <div className="campaign__halo" aria-hidden="true" />
              <div className="campaign__cover campaign__cover--back" aria-hidden="true">
                <BookCover book={getBookBySlug('weathered-pages') ?? books[10]} decorative />
              </div>
              <div className="campaign__cover campaign__cover--front" aria-hidden="true">
                <BookCover book={getBookBySlug('the-linen-room') ?? books[0]} decorative />
              </div>
              <span className="campaign__stamp">The<br />Reading<br />Room</span>
              <p className="campaign__quote">“A room without books is a body without a soul.”</p>
            </Reveal>
            <Reveal className="campaign__copy" delay={90}>
              <span className="eyebrow eyebrow--light">A seasonal collection</span>
              <h2>The Winter Reading Room</h2>
              <p>
                Long evenings, thick socks, one more chapter. We have gathered the books that feel
                like a warm room — generous novels, quiet poetry and stories that reward slow attention.
              </p>
              <div className="campaign__list">
                {editorPicks.slice(0, 3).map((book) => (
                  <Link key={book.id} to={`/books/${book.slug}`} className="campaign__list-item">
                    <span className="campaign__list-cover"><BookCover book={book} decorative /></span>
                    <span>
                      <strong>{book.title}</strong>
                      <small>{book.author}</small>
                    </span>
                    <Icon name="arrow-right" size={15} />
                  </Link>
                ))}
              </div>
              <Link to="/books?collection=winter" className="btn btn--light">
                Enter the reading room
                <Icon name="arrow-right" size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--editorial">
        <div className="container">
          <div className="editors">
            <Reveal className="editors__intro">
              <span className="eyebrow">From behind the counter</span>
              <h2>Editor&apos;s picks, with a reason</h2>
              <p>
                Not just what is selling — what stayed with us. Each month our booksellers choose
                the books they are pressing into friends&apos; hands.
              </p>
              <Link to="/books?collection=editors" className="text-link">
                Browse all editor&apos;s picks <Icon name="arrow-right" size={15} />
              </Link>
            </Reveal>
            <Reveal className="editors__feature" delay={80}>
              <Link to={`/books/${featuredPick.slug}`} className="editors__feature-cover">
                <BookCover book={featuredPick} decorative />
                <span className="sr-only">View {featuredPick.title} by {featuredPick.author}</span>
              </Link>
              <div className="editors__feature-copy">
                <span className="eyebrow">Shelf note</span>
                <h3>
                  <Link to={`/books/${featuredPick.slug}`}>{featuredPick.title}</Link>
                </h3>
                <p className="editors__feature-author">by {featuredPick.author}</p>
                <blockquote>
                  “{featuredPick.description}”
                </blockquote>
                <Link to={`/books/${featuredPick.slug}`} className="text-link">
                  Read the full note <Icon name="arrow-right" size={15} />
                </Link>
              </div>
            </Reveal>
            <Reveal className="editors__list" delay={140}>
              {editorPicks.filter((book) => book.id !== featuredPick.id).slice(0, 4).map((book) => (
                <Link key={book.id} to={`/books/${book.slug}`} className="editors__item">
                  <span className="editors__item-cover"><BookCover book={book} decorative /></span>
                  <span className="editors__item-copy">
                    <strong>{book.title}</strong>
                    <small>{book.author}</small>
                  </span>
                  <span className="editors__item-price">₹{book.price}</span>
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section discover-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="A little guidance"
              title="Find your next read by feeling"
              description="Some readers want a thriller. Some want to feel understood. Start with a mood and let us do the rest."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mood-tabs" role="tablist" aria-label="Choose a reading mood">
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  role="tab"
                  aria-selected={activeMood === mood}
                  className={`mood-tab ${activeMood === mood ? 'is-active' : ''}`}
                  onClick={() => setActiveMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
            <div className="book-grid book-grid--four mood-grid" key={activeMood}>
              {moodBooks.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          </Reveal>
          <div className="browse-quick-links">
            <Link to="/books?max=499" className="quick-link"><Icon name="sparkle" size={15} /> Under ₹499</Link>
            <Link to="/books?language=Hindi" className="quick-link"><Icon name="leaf" size={15} /> Hindi reads</Link>
            <Link to="/categories/poetry" className="quick-link"><Icon name="quote" size={15} /> Poetry</Link>
            <Link to="/books?sort=newest" className="quick-link"><Icon name="book" size={15} /> New voices</Link>
            <Link to="/books?format=Audiobook" className="quick-link"><Icon name="clock" size={15} /> Listen instead</Link>
          </div>
        </div>
      </section>

      <section className="section section--tint bundle-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Curated sets"
              title="Shelves we built for a feeling"
              description="A small collection you can step into. Three books, one atmosphere, no guesswork."
              actionLabel="All collections"
              actionTo="/books"
            />
          </Reveal>
          <div className="shelf-grid">
            {shelves.map((shelf, index) => {
              const shelfBooks = shelf.coverIds
                .map((id) => getBookById(id))
                .filter((book): book is NonNullable<ReturnType<typeof getBookById>> => Boolean(book))
              return (
                <Reveal key={shelf.title} delay={index * 70}>
                  <Link to={shelf.to} className="shelf-card">
                    <div className="shelf-card__covers" aria-hidden="true">
                      {shelfBooks.map((book, coverIndex) => (
                        <span key={book.id} className={`shelf-card__cover shelf-card__cover--${coverIndex}`}>
                          <BookCover book={book} decorative />
                        </span>
                      ))}
                    </div>
                    <div className="shelf-card__body">
                      <span className="eyebrow">Shelf no. 0{index + 1}</span>
                      <h3>{shelf.title}</h3>
                      <p>{shelf.copy}</p>
                      <span className="text-link">Explore the shelf <Icon name="arrow-right" size={15} /></span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Your reading trail"
              title="Recently viewed"
              description={recentBooks.personalised ? 'Pick up where you left off — these are the books you opened most recently.' : 'Books you open will appear here. For now, a few doorways chosen by our booksellers.'}
              actionLabel={recentBooks.personalised ? 'View your account' : 'Start browsing'}
              actionTo={recentBooks.personalised ? '/account' : '/books'}
            />
          </Reveal>
          <div className="book-grid book-grid--four">
            {recentBooks.books.map((book, index) => (
              <Reveal key={book.id} delay={index * 55}>
                <BookCard book={book} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div className="newsletter-section__pattern" aria-hidden="true" />
        <div className="container newsletter-section__inner">
          <Reveal className="newsletter-section__copy">
            <span className="eyebrow eyebrow--light">The Hawthorn Letter</span>
            <h2>One thoughtful letter a month.</h2>
            <p>
              New arrivals, bookseller recommendations and a little reading inspiration. No noise,
              no daily emails. Join 4,000 readers who like their inbox quiet.
            </p>
            <NewsletterForm tone="dark" />
          </Reveal>
          <Reveal className="newsletter-section__aside" delay={90}>
            <Icon name="quote" size={28} />
            <blockquote>
              “The right book at the right time can feel like a conversation you needed to have.”
            </blockquote>
            <span>— The Hawthorn booksellers</span>
            <div className="newsletter-section__help">
              <p>Not sure what to read next?</p>
              <Link to="/contact" className="text-link text-link--light">
                Ask a bookseller <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
