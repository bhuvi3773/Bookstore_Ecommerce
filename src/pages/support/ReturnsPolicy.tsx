export default function ReturnsPolicy() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">Policy</span>
          <h1 className="section-title">Returns &amp; Exchanges</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>Demo policy only. No returns or exchanges are processed for this demo site.</p>
        </div>
      </div>
    </div>
  )
}
