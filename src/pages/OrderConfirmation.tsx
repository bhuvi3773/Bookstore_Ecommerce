import { useParams, Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const { orderId } = useParams()

  return (
    <div className="section">
      <div className="container">
        <div className="card" style={{ padding: 'clamp(2rem, 10vw, 5rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.6rem', alignItems: 'center' }}>
          <span className="badge badge-success">Order Confirmed</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>Thank you for your order</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '520px' }}>
            This is a demo order. Your order ID is <strong>{orderId}</strong>. A confirmation email would be sent in a real store.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/account" className="btn btn-primary">View Orders</Link>
            <Link to="/books" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
