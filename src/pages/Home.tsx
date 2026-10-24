import { Link } from 'react-router-dom'
import { books, categories } from '../data/books'
import { BookCard } from '../components/books/BookCard'

const categoryImages: Record<string, string> = {
  fiction: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop',
  mystery: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1600&auto=format&fit=crop',
  romance: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600&auto=format&fit=crop',
  fantasy: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=1600&auto=format&fit=crop',
  'self-help': 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop',
  business: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600&auto=format&fit=crop',
  technology: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
  academic: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1600&auto=format&fit=crop',
  'children-s': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
  biography: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop',
  poetry: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop',
  comics: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=1600&auto=format&fit=crop',
}

const categoryMap: Record<string, string> = {
  fiction: 'Fiction',
  mystery: 'Mystery',
  romance: 'Romance',
  fantasy: 'Fantasy',
  'self-help': 'Self-Help',
  business: 'Business',
  technology: 'Technology',
  academic: 'Academic',
  'children-s': "Children's",
  biography: 'Biography',
  poetry: 'Poetry',
  comics: 'Comics',
}

export default function Home() {
  const bestsellers = books.filter((b) => b.bestseller)
  const newArrivals = books.filter((b) => b.newArrival)

  return (
    <div>
      <section className="section" style={{ paddingTop: 'clamp(3rem, 8vw, 6rem)' }}>
        <div className="container" style={{ display: 'grid', gap: 'clamp(2.4rem, 8vw, 5rem)', alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <span className="eyebrow">Warm literary curation</span>
            <h1 style={{ fontSize: 'clamp(3.6rem, 10vw, 7.6rem)', lineHeight: '0.96' }}>A cozy refuge for stories worth keeping</h1>
            <p style={{ fontSize: '1.12rem', color: 'var(--muted)', maxWidth: '620px' }}>
              Hawthorn is a warm, premium independent bookstore — thoughtfully curated bestsellers, new voices, and timeless classics presented with care.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/books" className="btn btn-primary">Explore Books</Link>
              <Link to="/categories/fiction" className="btn btn-outline">Discover Bestsellers</Link>
            </div>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <img src={books[0].cover} alt={books[0].title} style={{ aspectRatio: '4/5', objectFit: 'cover', width: '100%' }} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header">
              <span className="eyebrow">Browse</span>
              <h2 className="section-title">Featured Categories</h2>
              <p className="section-subtitle">Find your next read across our most beloved shelves.</p>
            </div>
            <Link to="/books" className="btn btn-ghost">View all titles</Link>
          </div>
          <div className="grid grid-categories">
            {categories.slice(0, 12).map((cat) => (
              <Link key={cat.slug} to={`/categories/${cat.slug}`} className="card" style={{ position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
                <img src={categoryImages[cat.slug]} alt={categoryMap[cat.slug] || cat.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,36,29,0.1) 0%, rgba(43,36,29,0.7) 100%)' }} />
                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.4rem', padding: '1.6rem' }}>
                  <span style={{ fontFamily: 'Cormorant', fontSize: 'clamp(1.6rem, 2vw, 2rem)', color: '#f8f3ec' }}>{categoryMap[cat.slug] || cat.name}</span>
                  <span style={{ color: 'rgba(248,243,236,0.8)' }}>{cat.count} title{cat.count === 1 ? '' : 's'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header">
              <span className="eyebrow">Readers&apos; favorites</span>
              <h2 className="section-title">Bestsellers</h2>
              <p className="section-subtitle">The books our community keeps returning to.</p>
            </div>
            <Link to="/books" className="btn btn-ghost">Shop all</Link>
          </div>
          <div className="grid grid-books">
            {bestsellers.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header">
              <span className="eyebrow">Just landed</span>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Fresh voices and exciting new stories.</p>
            </div>
            <Link to="/books" className="btn btn-ghost">Discover more</Link>
          </div>
          <div className="grid grid-books">
            {newArrivals.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ display: 'grid', gap: '2.4rem', alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', padding: 'clamp(2.6rem, 10vw, 6rem)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <span className="eyebrow">Join the circle</span>
              <h2 style={{ fontSize: 'clamp(2.6rem, 7vw, 4.6rem)' }}>The Hawthorn Letter</h2>
              <p style={{ color: 'var(--muted)', maxWidth: '540px' }}>Monthly reading recommendations, new arrivals, and quiet discoveries. (Demo — no emails sent)</p>
            </div>
            <form style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem' }} onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing (demo)') }}>
              <input className="input" style={{ flex: '1 1 280px' }} placeholder="Enter your email address" type="email" required />
              <button className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
