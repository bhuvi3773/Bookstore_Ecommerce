export default function ShippingPolicy() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">Policy</span>
          <h1 className="section-title">Shipping Policy</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>This is a demo policy. No real shipping is provided.</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--muted)' }}>
            <li>• Free shipping on orders above ₹1499 (demo)</li>
            <li>• Standard delivery: 3-5 business days (demo)</li>
            <li>• Express delivery: 1-2 business days (demo)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
