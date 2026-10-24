import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{ background: '#16130f', color: '#f7f3ed', marginTop: 'clamp(4rem, 10vw, 9rem)' }}>
      <div className="container" style={{ display: 'grid', gap: '2.4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', padding: 'clamp(3rem, 8vw, 6rem) 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Cormorant', fontSize: '2.2rem', letterSpacing: '0.24em', textTransform: 'uppercase' }}>Hawthorn</span>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.44em', textTransform: 'uppercase', color: 'rgba(247,243,237,0.6)' }}>Bookstore</span>
          </div>
          <p style={{ color: 'rgba(247,243,237,0.72)', maxWidth: '340px' }}>
            An ultra-premium literary bookstore — thoughtfully curated for readers who treasure beautiful books and lasting stories.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <span style={{ letterSpacing: '0.42em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Discover</span>
          <Link to="/books">All Books</Link>
          <Link to="/categories/fiction">Fiction</Link>
          <Link to="/categories/mystery">Mystery</Link>
          <Link to="/categories/self-help">Self-Help</Link>
          <Link to="/categories/business">Business</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <span style={{ letterSpacing: '0.42em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Customer Care</span>
          <Link to="/faq">FAQ</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
          <Link to="/returns-policy">Returns & Exchanges</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <span style={{ letterSpacing: '0.42em', textTransform: 'uppercase', fontSize: '0.78rem' }}>Company</span>
          <Link to="/about">About Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/account">My Account</Link>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(247,243,237,0.12)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', padding: '1.2rem 0', color: 'rgba(247,243,237,0.6)', fontSize: '0.9rem' }}>
          <span>© {new Date().getFullYear()} Hawthorn Bookstore. Frontend demo only.</span>
          <span>Crafted with care for discerning book lovers</span>
        </div>
      </div>
    </footer>
  )
}
