export default function Terms() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">Terms</span>
          <h1 className="section-title">Terms &amp; Conditions</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>This website is a frontend demonstration project. All content is fictional. Use at your own discretion.</p>
        </div>
      </div>
    </div>
  )
}
