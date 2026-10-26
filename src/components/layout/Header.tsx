import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { categories, getBookBySlug } from '../../data/books'
import { useDialog } from '../../hooks/useDialog'
import { Brand } from './Brand'
import { SearchBox } from './SearchBox'
import { BookCover } from '../ui/BookCover'
import { Icon } from '../ui/Icon'

export function Header() {
  const location = useLocation()
  const { cartCount, wishlist, user, openCart } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const previousCount = useRef(cartCount)
  const bumpTimer = useRef<number | null>(null)
  const menuRef = useDialog(mobileOpen, () => setMobileOpen(false))
  const featured = getBookBySlug('the-mapmakers-daughter')

  useEffect(() => {
    setMobileOpen(false)
    setMobileSearch(false)
    setMegaOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (cartCount !== previousCount.current) {
      previousCount.current = cartCount
      setCartBump(true)
      if (bumpTimer.current) window.clearTimeout(bumpTimer.current)
      bumpTimer.current = window.setTimeout(() => setCartBump(false), 420)
    }
    return () => {
      if (bumpTimer.current) window.clearTimeout(bumpTimer.current)
    }
  }, [cartCount])

  return (
    <header className="site-header">
      <div className="announcement">
        <div className="container announcement__inner">
          <span className="announcement__item"><Icon name="truck" size={14} /> Free delivery over ₹1,499</span>
          <span className="announcement__dot" aria-hidden="true" />
          <span className="announcement__item announcement__item--hide-mobile"><Icon name="refresh" size={14} /> 30-day easy returns</span>
          <span className="announcement__dot announcement__item--hide-mobile" aria-hidden="true" />
          <span className="announcement__item announcement__item--hide-tablet"><Icon name="sparkle" size={14} /> Independently curated since 2014</span>
          <Link to="/books?collection=editors" className="announcement__link">
            The winter shelf <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      </div>

      <div className="header-bar">
        <div className="container header-bar__inner">
          <button type="button" className="header-icon header-icon--mobile" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="mobile-menu">
            <Icon name="menu" size={21} />
          </button>

          <Brand />

          <nav className="primary-nav" aria-label="Primary">
            <NavLink to="/books" end className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              Browse
            </NavLink>
            <div
              className={`nav-dropdown ${megaOpen ? 'is-open' : ''}`}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setMegaOpen(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setMegaOpen(false)
                  event.currentTarget.querySelector<HTMLButtonElement>('.nav-dropdown__trigger')?.focus()
                }
              }}
            >
              <button
                type="button"
                className={`nav-link nav-dropdown__trigger ${location.pathname.startsWith('/categories') ? 'is-active' : ''}`}
                aria-expanded={megaOpen}
                aria-controls="category-menu"
                onClick={() => setMegaOpen((open) => !open)}
              >
                Categories
                <Icon name="chevron-down" size={14} />
              </button>
              <div id="category-menu" className={`mega-menu ${megaOpen ? 'is-open' : ''}`} aria-hidden={!megaOpen}>
                <div className="container mega-menu__inner">
                  <div className="mega-menu__main">
                    <div className="mega-menu__heading">
                      <span className="eyebrow">Browse the shop</span>
                      <p>Twelve shelves, endlessly different reading lives.</p>
                    </div>
                    <div className="mega-menu__grid">
                      {categories.map((category) => (
                        <Link key={category.slug} to={`/categories/${category.slug}`} className="mega-category">
                          <span className="mega-category__count">{String(category.count).padStart(2, '0')}</span>
                          <span className="mega-category__name">{category.name}</span>
                          <span className="mega-category__tagline">{category.tagline}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {featured ? (
                    <div className="mega-menu__feature">
                      <span className="eyebrow">Bookseller&apos;s choice</span>
                      <Link to={`/books/${featured.slug}`} className="mega-feature">
                        <span className="mega-feature__cover"><BookCover book={featured} decorative /></span>
                        <span className="mega-feature__copy">
                          <strong>{featured.title}</strong>
                          <span>{featured.author}</span>
                          <span className="mega-feature__link">Read the shelf note <Icon name="arrow-right" size={14} /></span>
                        </span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <NavLink to="/books?sort=newest" className="nav-link">New &amp; notable</NavLink>
            <NavLink to="/books?collection=editors" className="nav-link">Editor&apos;s picks</NavLink>
          </nav>

          <div className="header-tools">
            <div className="header-search">
              <SearchBox idPrefix="desktop" />
            </div>
            <button type="button" className="header-icon header-icon--search-mobile" onClick={() => setMobileSearch((open) => !open)} aria-label="Search books" aria-expanded={mobileSearch} aria-controls="mobile-search-panel">
              <Icon name={mobileSearch ? 'close' : 'search'} size={20} />
            </button>
            <Link
              to="/account"
              className="header-tool"
              aria-label={user ? `Your account, ${user.name}` : 'Sign in to your account'}
            >
              <Icon name="user" size={20} />
              <span className="header-tool__label">{user ? user.name.split(' ')[0] : 'Account'}</span>
            </Link>
            <Link
              to="/wishlist"
              className="header-tool"
              aria-label={wishlist.length > 0 ? `${wishlist.length} Wishlist — view saved books` : 'Wishlist — view saved books'}
            >
              <span className="header-tool__icon">
                <Icon name="heart" size={20} />
                {wishlist.length > 0 ? <span className="count-badge" aria-hidden="true">{wishlist.length}</span> : null}
              </span>{' '}
              <span className="header-tool__label">Wishlist</span>
            </Link>
            <button
              type="button"
              className={`header-tool header-cart ${cartBump ? 'is-bumping' : ''}`}
              onClick={openCart}
              aria-label={`${cartCount} Bag — open bag`}
            >
              <span className="header-tool__icon">
                <Icon name="bag" size={20} />
                <span className={`count-badge ${cartBump ? 'is-bumping' : ''}`} aria-hidden="true">{cartCount}</span>
              </span>{' '}
              <span className="header-tool__label">Bag</span>
            </button>
          </div>
        </div>

        {mobileSearch ? (
          <div className="mobile-search-panel" id="mobile-search-panel">
            <div className="container">
              <SearchBox idPrefix="mobile-header" autoFocus onNavigate={() => setMobileSearch(false)} />
            </div>
          </div>
        ) : null}
      </div>

      <div className={`drawer-backdrop ${mobileOpen ? 'is-open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        tabIndex={-1}
      >
        <div className="mobile-menu__header">
          <Brand compact />
          <button type="button" className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="mobile-menu__scroll">
          <div className="mobile-menu__search">
            <SearchBox idPrefix="mobile-menu" onNavigate={() => setMobileOpen(false)} />
          </div>

          <nav className="mobile-nav" aria-label="Mobile">
            <Link to="/books" className="mobile-nav__link" onClick={() => setMobileOpen(false)}>
              <span>Browse all books</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <details className="mobile-nav__group">
              <summary>
                <span>Categories</span>
                <Icon name="chevron-down" size={16} />
              </summary>
              <div className="mobile-nav__sub">
                {categories.map((category) => (
                  <Link key={category.slug} to={`/categories/${category.slug}`} onClick={() => setMobileOpen(false)}>
                    <span>{category.name}</span>
                    <span>{category.count}</span>
                  </Link>
                ))}
              </div>
            </details>
            <Link to="/books?sort=newest" className="mobile-nav__link" onClick={() => setMobileOpen(false)}>
              <span>New &amp; notable</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link to="/books?collection=editors" className="mobile-nav__link" onClick={() => setMobileOpen(false)}>
              <span>Editor&apos;s picks</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link to="/about" className="mobile-nav__link" onClick={() => setMobileOpen(false)}>
              <span>Our story</span>
              <Icon name="arrow-right" size={16} />
            </Link>
          </nav>

          <div className="mobile-menu__account">
            <Link to="/account" className="mobile-account-link" onClick={() => setMobileOpen(false)}>
              <Icon name="user" size={18} />
              <span>{user ? `Hello, ${user.name.split(' ')[0]}` : 'Account & orders'}</span>
            </Link>
            <Link to="/wishlist" className="mobile-account-link" onClick={() => setMobileOpen(false)}>
              <Icon name="heart" size={18} />
              <span>Wishlist</span>
              <span className="count-badge">{wishlist.length}</span>
            </Link>
            <Link to="/cart" className="mobile-account-link" onClick={() => setMobileOpen(false)}>
              <Icon name="bag" size={18} />
              <span>Your bag</span>
              <span className="count-badge">{cartCount}</span>
            </Link>
          </div>

          <div className="mobile-menu__promo">
            <Icon name="sparkle" size={18} />
            <p>Free delivery on orders over ₹1,499. Every book wrapped with care.</p>
          </div>
        </div>
      </aside>
    </header>
  )
}
