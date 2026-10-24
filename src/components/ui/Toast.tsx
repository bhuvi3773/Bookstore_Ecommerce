import { createContext, useContext, useState, type ReactNode } from 'react'

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(null), 2200)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast ${message ? 'show' : ''}`}>{message}</div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
