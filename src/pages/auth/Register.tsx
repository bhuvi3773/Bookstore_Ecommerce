import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(520px, 100%)', padding: 'clamp(2rem, 6vw, 3rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="eyebrow">Join us</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>Create Account</h1>
            <p style={{ color: 'var(--muted)' }}>Demo registration — no account is created.</p>
          </div>
          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <button className="btn btn-primary" onClick={() => alert('Demo account created')}>Create Account</button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/login">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
