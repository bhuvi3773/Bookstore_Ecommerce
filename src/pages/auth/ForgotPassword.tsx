import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { Icon } from '../../components/ui/Icon'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail } from '../../utils/validation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useDocumentTitle('Reset password')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthShell
      eyebrow="A way back in"
      title={sent ? 'Request recorded' : 'Reset your password'}
      description={
        sent
          ? 'This is a demonstration, so no reset email was sent. You can return to sign in whenever you like.'
          : 'Enter the email attached to your demo account. In a real shop, we would send a reset link.'
      }
      footer={
        <p>
          Remembered it? <Link to="/login">Back to sign in</Link>
        </p>
      }
    >
      {sent ? (
        <div className="auth-success" role="status">
          <span className="auth-success__icon"><Icon name="mail" size={24} /></span>
          <h2>Nothing was sent — and that&apos;s intentional.</h2>
          <p>
            This frontend demo has no email service. Your request for <strong>{email}</strong> is not stored
            and no link has been generated. Use any six-character password to sign in.
          </p>
          <Link to="/login" className="btn btn--primary">Return to sign in</Link>
          <button type="button" className="text-button" onClick={() => setSent(false)}>
            Try a different email
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-field">
            <label htmlFor="forgot-email">Email address</label>
            <input
              id="forgot-email"
              type="email"
              className="input"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError('')
              }}
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'forgot-email-error' : undefined}
              placeholder="reader@example.com"
            />
            {error ? <p className="form-error" id="forgot-email-error">{error}</p> : null}
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Send reset link
            <Icon name="arrow-right" size={16} />
          </button>

          <p className="auth-fineprint">
            Demo only. No reset link is generated, no email is sent, and nothing is stored.
          </p>
        </form>
      )}
    </AuthShell>
  )
}
