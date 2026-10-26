import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { ToastProvider } from '../ui/Toast'
import { Icon } from '../ui/Icon'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(window.scrollY > 900)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="arrow-up" size={18} />
    </button>
  )
}

export function Layout() {
  const { pathname } = useLocation()

  return (
    <ToastProvider>
      <div className="site-shell" id="top">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollToTop />
        <Header />
        <main id="main-content" className="site-main" tabIndex={-1}>
          <div className="page-enter" key={pathname}>
            <Outlet />
          </div>
        </main>
        <Footer />
        <CartDrawer />
        <BackToTop />
      </div>
    </ToastProvider>
  )
}
