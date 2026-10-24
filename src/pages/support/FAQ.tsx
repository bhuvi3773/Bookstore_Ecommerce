const faqs = [
  { q: 'Is this a real store?', a: 'No, this is a complete frontend demo only.' },
  { q: 'Do you take real payments?', a: 'No. Checkout is for demonstration purposes only.' },
  { q: 'Is my cart saved?', a: 'Yes, cart, wishlist and demo orders are saved in localStorage.' },
  { q: 'Do you ship internationally?', a: 'Shipping info is for demo. No real orders are fulfilled.' },
  { q: 'Can I apply coupons?', a: 'Yes, demo coupons like WELCOME10 and READ15 are shown.' },
]

export default function FAQ() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">FAQ</span>
          <h1 className="section-title">Frequently Asked Questions</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((f) => (
            <div key={f.q} className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.6rem' }}>{f.q}</h2>
              <p style={{ color: 'var(--muted)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
