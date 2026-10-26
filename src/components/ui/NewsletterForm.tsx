import { useState } from 'react'
import { isValidEmail } from '../../utils/validation'
import { Icon } from './Icon'

interface NewsletterFormProps {
  tone?: 'light' | 'dark'
  compact?: boolean
}

export function NewsletterForm({ tone = 'light', compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  if (subscribed) {
    return (
      <div className={`newsletter-success newsletter-success--${tone}`} role="status">
        <span className="newsletter-success__icon"><Icon name="check" size={18} /></span>
        <div>
          <strong>You&apos;re on the list.</strong>
          <p>Demo only — no emails will be sent, and nothing left this device.</p>
        </div>
      </div>
    )
  }

  return (
    <form
      className={`newsletter-form newsletter-form--${tone} ${compact ? 'newsletter-form--compact' : ''}`.trim()}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (!isValidEmail(email)) {
          setError('Enter a valid email address, such as reader@example.com.')
          return
        }
        setError('')
        setSubscribed(true)
      }}
    >
      <label className="sr-only" htmlFor={`newsletter-${tone}-${compact ? 'compact' : 'full'}`}>Email address</label>
      <div className="newsletter-form__field">
        <Icon name="mail" size={17} />
        <input
          id={`newsletter-${tone}-${compact ? 'compact' : 'full'}`}
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (error) setError('')
          }}
          placeholder="Your email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `newsletter-error-${tone}-${compact ? 'compact' : 'full'}` : undefined}
          autoComplete="email"
        />
        <button type="submit" className="btn btn--primary btn--small">
          Join the letter
          <Icon name="arrow-right" size={15} />
        </button>
      </div>
      {error ? (
        <p className="form-error" id={`newsletter-error-${tone}-${compact ? 'compact' : 'full'}`}>
          {error}
        </p>
      ) : (
        <p className="newsletter-form__note">One thoughtful letter a month. No noise. Demo signup only.</p>
      )}
    </form>
  )
}
