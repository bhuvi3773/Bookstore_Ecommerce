import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { Icon } from '../../components/ui/Icon'
import { useToast } from '../../components/ui/Toast'
import { useStore } from '../../context/StoreContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail } from '../../utils/validation'

const DEMO_EMAIL = 'reader@hawthorn.demo'
const DEMO_PASSWORD = 'hawthorn'

function nameFromEmail(email: string) {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  if (!local) return 'Demo Reader'
  return local
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useStore()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  useDocumentTitle('Sign in')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (password.trim().length < 6) nextErrors.password = 'Enter at least 6 characters. In this demo, any password works.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    signIn({ name: nameFromEmail(email), email: email.trim() })
    showToast('Signed in to the demo account on this device.', 'success')
    navigate('/account')
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Return to your saved books and demo orders. No real credentials are needed."
      footer={
        <p>
          New to Hawthorn? <Link to="/register">Create a demo account</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="form-field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            className="input"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            placeholder="reader@example.com"
          />
          {errors.email ? <p className="form-error" id="login-email-error">{errors.email}</p> : null}
        </div>

        <div className="form-field">
          <div className="form-label-row">
            <label htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="form-label-row__link">Forgot password?</Link>
          </div>
          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              placeholder="Any six characters will do"
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
          {errors.password ? <p className="form-error" id="login-password-error">{errors.password}</p> : null}
        </div>

        <button type="submit" className="btn btn--primary btn--full">
          Sign in to your account
          <Icon name="arrow-right" size={16} />
        </button>

        <button
          type="button"
          className="demo-fill"
          onClick={() => {
            setEmail(DEMO_EMAIL)
            setPassword(DEMO_PASSWORD)
            setErrors({})
          }}
        >
          <Icon name="sparkle" size={15} />
          Fill the demo details
        </button>
      </form>
    </AuthShell>
  )
}
