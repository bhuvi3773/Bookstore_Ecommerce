import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatINR } from '../utils/format'

export default function Account() {
  const { orders } = useStore()

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Account</span>
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle">Demo account area. No real authentication is enabled.</p>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2.4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Profile</h2>
            <div><strong>Name:</strong> Demo Reader</div>
            <div><strong>Email:</strong> reader@hawthorn.demo</div>
            <div><strong>Phone:</strong> +91 98765 43210</div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </div>
          </div>
          <div className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2.4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Order History</h2>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No orders yet. Place a demo order from checkout.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div><strong>Order #{order.id}</strong></div>
                      <div style={{ color: 'var(--muted)' }}>{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{formatINR(order.total)}</div>
                      <div style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
