import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="section">
      <div className="container">
        <div className="card" style={{ padding: 'clamp(2rem, 10vw, 5rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.6rem', alignItems: 'center' }}>
          <span className="eyebrow">404</span>
          <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>Page not found</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '480px' }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
