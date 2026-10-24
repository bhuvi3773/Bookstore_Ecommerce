export default function Contact() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <div className="section-header">
          <span className="eyebrow">Contact</span>
          <h1 className="section-title">Get in Touch</h1>
        </div>
        <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Send a message</h2>
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Subject" />
            <textarea className="input" style={{ borderRadius: '16px', minHeight: '140px' }} placeholder="Message" />
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Demo message sent')}>Send Message</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Store Info</h2>
            <p style={{ color: 'var(--muted)' }}>Demo only — no physical store.</p>
            <p>Email: hello@hawthorn.demo</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  )
}
