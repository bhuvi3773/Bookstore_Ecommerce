import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(520px, 100%)', padding: 'clamp(2rem, 6vw, 3rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="eyebrow">Reset</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>Forgot Password</h1>
            <p style={{ color: 'var(--muted)' }}>Demo only — reset link not sent.</p>
          </div>
          <input className="input" placeholder="Email" />
          <button className="btn btn-primary" onClick={() => alert('Demo reset link sent')}>Send Reset Link</button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/login">Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
