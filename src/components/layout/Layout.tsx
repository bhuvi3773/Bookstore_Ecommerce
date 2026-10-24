import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastProvider } from '../ui/Toast'

export function Layout() {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}
