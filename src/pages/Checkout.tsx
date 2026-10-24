import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { books } from '../data/books'
import { formatINR } from '../utils/format'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, addOrder } = useStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ email: '', fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', country: 'India', payment: 'cod', delivery: 'standard' })

  const items = cart.map((item) => ({ item, book: books.find((b) => b.id === item.bookId)! })).filter((x) => x.book)
  const subtotal = items.reduce((sum, { item, book }) => sum + book.price * item.quantity, 0)
  const shipping = subtotal >= 1499 ? 0 : 99
  const total = subtotal + shipping

  const placeOrder = () => {
    const orderId = `HB-${Date.now().toString().slice(-6)}`
    addOrder({
      id: orderId,
      items: items.map(({ item, book }) => ({ book, quantity: item.quantity })),
      subtotal,
      discount: 0,
      shipping,
      total,
      address: { id: 'a1', fullName: form.fullName, phone: form.phone, email: form.email, addressLine1: form.addressLine1, city: form.city, state: form.state, pincode: form.pincode, country: form.country },
      paymentMethod: form.payment,
      deliveryMethod: form.delivery,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    })
    clearCart()
    navigate(`/order-confirmation/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="card" style={{ padding: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>Nothing to checkout</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="section-header">
          <span className="eyebrow">Checkout</span>
          <h1 className="section-title">Secure Checkout</h1>
          <p className="section-subtitle">This is a demonstration checkout — no real payment is processed.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className={`badge ${step >= s ? 'badge-accent' : ''}`}>{s}</span>
              <span style={{ color: step >= s ? 'var(--ink)' : 'var(--muted)' }}>{['Contact', 'Shipping', 'Delivery', 'Payment', 'Review'][s-1]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
          <div className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2.4rem)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {step === 1 && (
              <>
                <h2 style={{ fontSize: '2rem' }}>Contact Information</h2>
                <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setStep(2)}>Continue to Shipping</button>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ fontSize: '2rem' }}>Shipping Address</h2>
                <input className="input" placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  <input className="input" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>Continue to Delivery</button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 style={{ fontSize: '2rem' }}>Delivery Method</h2>
                <label style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <input type="radio" checked={form.delivery === 'standard'} onChange={() => setForm({ ...form, delivery: 'standard' })} />
                  <div style={{ flex: 1 }}><strong>Standard Delivery</strong><p style={{ color: 'var(--muted)' }}>3-5 business days</p></div>
                  <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </label>
                <label style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <input type="radio" checked={form.delivery === 'express'} onChange={() => setForm({ ...form, delivery: 'express' })} />
                  <div style={{ flex: 1 }}><strong>Express Delivery</strong><p style={{ color: 'var(--muted)' }}>1-2 business days</p></div>
                  <span>{formatINR(149)}</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(4)}>Continue to Payment</button>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 style={{ fontSize: '2rem' }}>Payment Method</h2>
                <p style={{ color: 'var(--muted)' }}>Demo only. No real transaction will occur.</p>
                {['cod', 'upi', 'card', 'netbanking'].map((p) => (
                  <label key={p} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                    <input type="radio" checked={form.payment === p} onChange={() => setForm({ ...form, payment: p })} />
                    <span style={{ textTransform: 'capitalize' }}>{p === 'cod' ? 'Cash on Delivery' : p === 'upi' ? 'UPI' : p === 'card' ? 'Credit/Debit Card' : 'Net Banking'}</span>
                  </label>
                ))}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setStep(3)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(5)}>Review Order</button>
                </div>
              </>
            )}
            {step === 5 && (
              <>
                <h2 style={{ fontSize: '2rem' }}>Review & Place Order</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <strong>Shipping to</strong>
                  <span style={{ color: 'var(--muted)' }}>{form.fullName}, {form.addressLine1}, {form.city}, {form.state} {form.pincode}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <strong>Contact</strong>
                  <span style={{ color: 'var(--muted)' }}>{form.email} • {form.phone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <strong>Payment</strong>
                  <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{form.payment === 'cod' ? 'Cash on Delivery' : form.payment}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setStep(4)}>Back</button>
                  <button className="btn btn-primary" onClick={placeOrder}>Place Order (Demo)</button>
                </div>
              </>
            )}
          </div>
          <aside className="card" style={{ padding: 'clamp(1.6rem, 4vw, 2.4rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Order Summary</h2>
            {items.map(({ item, book }) => (
              <div key={book.id} style={{ display: 'flex', gap: '1rem' }}>
                <img src={book.cover} alt={book.title} style={{ width: '70px', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '10px' }} />
                <div style={{ flex: 1 }}><p>{book.title}</p><p style={{ color: 'var(--muted)' }}>Qty {item.quantity}</p></div>
                <span>{formatINR(book.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}><span>Total</span><span>{formatINR(total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
