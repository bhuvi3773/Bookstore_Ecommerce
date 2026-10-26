import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type ToastType = 'success' | 'error' | 'info' | 'wishlist'

interface ToastOptions {
  type?: ToastType
  duration?: number
}

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

interface ToastContextValue {
  showToast: (message: string, typeOrOptions?: ToastType | ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const icons: Record<ToastType, IconName> = {
  success: 'check',
  error: 'close',
  info: 'sparkle',
  wishlist: 'heart',
}

function ToastCard({ toast, onDone }: { toast: ToastItem; onDone: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), toast.duration - 280)
    const doneTimer = window.setTimeout(() => onDone(toast.id), toast.duration)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(doneTimer)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [toast.duration, toast.id, onDone])

  const dismiss = () => {
    setLeaving(true)
    timerRef.current = window.setTimeout(() => onDone(toast.id), 240)
  }

  return (
    <div className={`toast toast--${toast.type} ${leaving ? 'is-leaving' : 'is-entering'}`} role="status">
      <span className="toast__icon" aria-hidden="true">
        <Icon name={icons[toast.type]} size={16} />
      </span>
      <p className="toast__message">{toast.message}</p>
      <button type="button" className="toast__close" onClick={dismiss} aria-label="Dismiss notification">
        <Icon name="close" size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, typeOrOptions?: ToastType | ToastOptions) => {
    const options: ToastOptions = typeof typeOrOptions === 'string' ? { type: typeOrOptions } : typeOrOptions ?? {}
    const id = nextId.current++
    const type = options.type ?? 'success'
    const duration = options.duration ?? 3500
    setToasts((prev) => [...prev.slice(-2), { id, message, type, duration }])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
