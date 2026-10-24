export default function PrivacyPolicy() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">Policy</span>
          <h1 className="section-title">Privacy Policy</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>This demo site stores data locally in your browser (localStorage) for cart, wishlist and demo orders. No data is sent to a server.</p>
        </div>
      </div>
    </div>
  )
}
