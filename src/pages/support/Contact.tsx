import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { PageHeader } from '../../components/ui/PageHeader'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail, required } from '../../utils/validation'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const initialForm: ContactForm = { name: '', email: '', subject: 'A reading recommendation', message: '' }

const contactCards = [
  {
    icon: 'mail' as const,
    title: 'Email us',
    copy: 'hello@hawthorn.demo',
    note: 'Fictional address, real enthusiasm.',
  },
  {
    icon: 'clock' as const,
    title: 'Reading room hours',
    copy: 'Mon–Fri, 9am–6pm IST',
    note: 'The demo is open whenever you are.',
  },
  {
    icon: 'pin' as const,
    title: 'The shop',
    copy: 'A imagined corner of a bookish city',
    note: 'No physical store to visit — sorry.',
  },
]

export default function Contact() {
  useDocumentTitle('Contact us')

  const [form, setForm] = useState<ContactForm>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})
  const [sent, setSent] = useState(false)

  const setField = (key: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!required(form.name, 2)) nextErrors.name = 'Tell us your name.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!required(form.message, 10)) nextErrors.message = 'A little more detail, please — at least 10 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSent(true)
  }

  return (
    <div className="contact-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span aria-current="page">Contact</span>
        </nav>

        <PageHeader
          eyebrow="Contact"
          title="Ask a bookseller."
          description="Tell us what you have loved lately, what you are in the mood for, or what has gone wrong. We are a demo, but the good manners are real."
        />

        <div className="contact-layout">
          <section className="contact-form-card" aria-labelledby="contact-form-title">
            {sent ? (
              <div className="contact-success" role="status">
                <span className="contact-success__icon"><Icon name="check" size={26} /></span>
                <span className="eyebrow">Message recorded</span>
                <h2 id="contact-form-title">Thank you, {form.name.split(' ')[0]}.</h2>
                <p>
                  This is a frontend demonstration, so no message was actually sent and no one will write back.
                  Nothing you typed has left this browser or been stored.
                </p>
                <div className="contact-success__actions">
                  <button type="button" className="btn btn--outline" onClick={() => { setForm(initialForm); setSent(false) }}>
                    Write another note
                  </button>
                  <Link to="/books" className="btn btn--primary">Browse the shelves</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="contact-form-card__head">
                  <span className="eyebrow">Send a note</span>
                  <h2 id="contact-form-title">What is on your mind?</h2>
                  <p>No message is transmitted. This form demonstrates validation and feedback.</p>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="contact-name">Your name</label>
                    <input
                      id="contact-name"
                      className="input"
                      value={form.name}
                      onChange={(event) => setField('name', event.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      placeholder="What should we call you?"
                    />
                    {errors.name ? <p className="form-error" id="contact-name-error">{errors.name}</p> : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">Email address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(event) => setField('email', event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="reader@example.com"
                    />
                    {errors.email ? <p className="form-error" id="contact-email-error">{errors.email}</p> : null}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">What is this about?</label>
                  <select
                    id="contact-subject"
                    className="input select"
                    value={form.subject}
                    onChange={(event) => setField('subject', event.target.value)}
                  >
                    <option>A reading recommendation</option>
                    <option>A demo order</option>
                    <option>Delivery or returns</option>
                    <option>Something about the site</option>
                    <option>Just saying hello</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">Your message</label>
                  <textarea
                    id="contact-message"
                    className="input textarea"
                    rows={6}
                    value={form.message}
                    onChange={(event) => setField('message', event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    placeholder="Tell us what you have loved lately, or what you are looking for."
                  />
                  {errors.message ? <p className="form-error" id="contact-message-error">{errors.message}</p> : null}
                </div>

                <div className="contact-form-card__actions">
                  <button type="submit" className="btn btn--primary">
                    Send message
                    <Icon name="arrow-right" size={16} />
                  </button>
                  <p><Icon name="shield" size={14} /> Demo form · nothing is sent or stored</p>
                </div>
              </form>
            )}
          </section>

          <aside className="contact-side">
            {contactCards.map((card) => (
              <article className="contact-card" key={card.title}>
                <span className="contact-card__icon"><Icon name={card.icon} size={19} /></span>
                <div>
                  <h2>{card.title}</h2>
                  <strong>{card.copy}</strong>
                  <p>{card.note}</p>
                </div>
              </article>
            ))}

            <div className="contact-side__links">
              <h2>Faster answers</h2>
              <Link to="/faq"><span>Read the FAQs</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/shipping-policy"><span>Delivery &amp; shipping</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/returns-policy"><span>Returns &amp; exchanges</span><Icon name="arrow-right" size={14} /></Link>
              <Link to="/account"><span>Track a demo order</span><Icon name="arrow-right" size={14} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
