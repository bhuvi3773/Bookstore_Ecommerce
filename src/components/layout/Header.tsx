import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { books } from '../../data/books'

export function Header() {
  const navigate = useNavigate()
  const { cart, wishlist } = useStore()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const suggestions = query.trim()
    ? books
        .filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setMobileOpen(false)
    } else {
      navigate('/books')
    }
  }

  return (
    <header>
      <div style={{ background: 'linear-gradient(90deg, #8b7355, #a08968)', color: '#f8f3ec' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '0.6rem 0', textAlign: 'center' }}>
          <span style={{ letterSpacing: '0.24em', textTransform: 'uppercase', fontSize: '0.68rem', lineHeight: '1.6' }}>
            Free shipping on orders above ₹1499 • Curated for book lovers
          </span>
        </div>
      </div>
      <div style={{ background: 'rgba(251,246,240,0.98)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 0' }}>
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Cormorant', fontSize: '1.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Hawthorn</span>
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.36em', textTransform: 'uppercase', color: 'var(--muted)' }}>Bookstore</span>
          </Link>
          <nav style={{ display: 'none', gap: '1.6rem', marginLeft: '1.2rem' }} className="nav-desktop">
            <NavLink to="/books">Shop Books</NavLink>
            <NavLink to="/categories/fiction">Fiction</NavLink>
            <NavLink to="/categories/mystery">Mystery</NavLink>
            <NavLink to="/categories/romance">Romance</NavLink>
            <NavLink to="/categories/self-help">Self-Help</NavLink>
            <NavLink to="/categories/business">Business</NavLink>
          </nav>
          <div style={{ flex: 1, display: 'none', position: 'relative' }} className="search-desktop">
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <input className="input" placeholder="Search by title, author, ISBN or keyword" value={query} onChange={(e) => setQuery(e.target.value)} />
            </form>
            {suggestions.length > 0 && (
              <div className="card" style={{ position: 'absolute', top: 'calc(100% + 0.7rem)', left: 0, right: 0, padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', zIndex: 40 }}>
                {suggestions.map((s) => (
                  <Link key={s.id} to={`/books/${s.slug}`} onClick={() => setQuery('')} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <img src={s.cover} alt={s.title} style={{ width: '44px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{s.title}</div>
                      <div style={{ color: 'var(--muted)' }}>{s.author}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <Link to="/wishlist" style={{ display: 'none', gap: '0.4rem', alignItems: 'center' }} className="icon-link">
              <span>Wishlist</span>
              <span style={{ border: '1px solid var(--border)', borderRadius: '9999px', padding: '0.2rem 0.7rem' }}>{wishlist.length}</span>
            </Link>
            <Link to="/cart" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ display: 'none' }} className="cart-label">Cart</span>
              <span style={{ border: '1px solid var(--border)', borderRadius: '9999px', padding: '0.22rem 0.7rem' }}>{cartCount}</span>
            </Link>
            <Link to="/account" className="btn btn-ghost account-link" style={{ padding: '0.6rem 1rem', display: 'none' }}>Account</Link>
            <button className="btn btn-outline" style={{ padding: '0.6rem 1.2rem' }} onClick={() => setMobileOpen(true)}>Menu</button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,29,0.5)', zIndex: 50 }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 'min(340px, 100%)', height: '100%', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.2rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'Cormorant', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Hawthorn</span>
              <button className="btn btn-ghost" style={{ padding: '0.6rem 0.8rem' }} onClick={() => setMobileOpen(false)}>Close</button>
            </div>
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <form onSubmit={handleSearch}>
                <input className="input" placeholder="Search books" value={query} onChange={(e) => setQuery(e.target.value)} />
              </form>
              <NavLink to="/books" onClick={() => setMobileOpen(false)}>Shop Books</NavLink>
              <NavLink to="/categories/fiction" onClick={() => setMobileOpen(false)}>Fiction</NavLink>
              <NavLink to="/categories/mystery" onClick={() => setMobileOpen(false)}>Mystery</NavLink>
              <NavLink to="/categories/romance" onClick={() => setMobileOpen(false)}>Romance</NavLink>
              <NavLink to="/categories/self-help" onClick={() => setMobileOpen(false)}>Self-Help</NavLink>
              <NavLink to="/categories/business" onClick={() => setMobileOpen(false)}>Business</NavLink>
              <NavLink to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist ({wishlist.length})</NavLink>
              <NavLink to="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</NavLink>
              <NavLink to="/account" onClick={() => setMobileOpen(false)}>Account</NavLink>
            </div>
          </div>
        </div>
      )}

      <style>{`
        nav a { letter-spacing: -0.01em; font-size: 0.95rem; color: var(--muted); }
        nav a.active { color: var(--ink); }
        @media (min-width: 1120px) { .nav-desktop { display: flex !important; } .search-desktop { display: flex !important; } .icon-link { display: flex !important; } .account-link { display: inline-flex !important; } .cart-label { display: inline !important; } }
      `}</style>
    </header>
  )
}
