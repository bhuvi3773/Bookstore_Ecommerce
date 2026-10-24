export default function About() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">About</span>
          <h1 className="section-title">Our Story</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ fontSize: '1.2rem' }}>Hawthorn is a warm, literary bookstore built for readers who believe stories matter.</p>
          <p style={{ color: 'var(--muted)' }}>We curate a thoughtful mix of fiction, mystery, romance, fantasy, self-help, business, and more — with an eye for beautiful editions and voices worth discovering.</p>
          <p style={{ color: 'var(--muted)' }}>This is a complete frontend demo built with React, Vite, TypeScript and React Router. No backend, payments, or real auth are included.</p>
        </div>
      </div>
    </div>
  )
}
