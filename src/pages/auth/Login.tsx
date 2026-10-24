import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: 'min(520px, 100%)', padding: 'clamp(2rem, 6vw, 3rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="eyebrow">Welcome back</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>Sign In</h1>
            <p style={{ color: 'var(--muted)' }}>Demo login — no authentication performed.</p>
          </div>
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Password" type="password" />
          <button className="btn btn-primary" onClick={() => alert('Demo login successful')}>Sign In</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
