import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { Icon } from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'
import { useStore } from '../../context/StoreContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail } from '../../utils/validation'

export default function Register() {
  const navigate = useNavigate()
  const { signIn } = useStore()
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  useDocumentTitle('Create account')

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Tell us what to call you.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.trim().length < 6) nextErrors.password = 'Use at least 6 characters. In this demo, any password works.'
    if (form.confirm !== form.password) nextErrors.confirm = 'The passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    signIn({ name: form.name.trim(), email: form.email.trim() })
    showToast('Demo account ready on this device. Welcome to Hawthorn.', 'success')
    navigate('/account')
  }

  return (
    <AuthShell
      eyebrow="Join the reading room"
      title="Create an account"
      description="Make a demo account to keep your wishlist, orders and reading trail together."
      footer={
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="form-field">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            className="input"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            placeholder="What should we call you?"
          />
          {errors.name ? <p className="form-error" id="register-name-error">{errors.name}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            className="input"
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            placeholder="reader@example.com"
          />
          {errors.email ? <p className="form-error" id="register-email-error">{errors.email}</p> : null}
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <div className="password-field">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={form.password}
                onChange={(event) => setField('password', event.target.value)}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="password-field__toggle"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={17} />
              </button>
            </div>
            {errors.password ? <p className="form-error" id="register-password-error">{errors.password}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={form.confirm}
              onChange={(event) => setField('confirm', event.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={errors.confirm ? 'register-confirm-error' : undefined}
              placeholder="Type it again"
            />
            {errors.confirm ? <p className="form-error" id="register-confirm-error">{errors.confirm}</p> : null}
          </div>
        </div>

        <p className="auth-fineprint">
          No real account is created. Your name and email are stored in this browser only, so the demo can greet you.
        </p>

        <button type="submit" className="btn btn--primary btn--full">
          Create demo account
          <Icon name="arrow-right" size={16} />
        </button>
      </form>
    </AuthShell>
  )
}
