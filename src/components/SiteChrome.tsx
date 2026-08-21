import {
  ArrowRight,
  Bag,
  List,
  MagnifyingGlass,
  UserCircle,
  X,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext'
import { useCart } from '../store/CartContext'

export function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const searchTrigger = useRef<HTMLButtonElement>(null)
  const menuDialog = useRef<HTMLDivElement>(null)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const appShell = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useCart()
  const { config } = useSiteConfig()
  const primaryLinks = config.global.navigation.filter((link) => link.enabled)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  useEffect(() => {
    if (!searchOpen) return

    searchInput.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      searchTrigger.current?.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    if (!menuOpen) return
    const dialog = menuDialog.current
    const background = appShell.current
    const previousOverflow = document.body.style.overflow
    if (background) background.inert = true
    document.body.style.overflow = 'hidden'

    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    )
    focusable?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (background) background.inert = false
      document.body.style.overflow = previousOverflow
      menuTrigger.current?.focus()
    }
  }, [menuOpen])

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      <div
        ref={appShell}
        className={location.pathname === '/' ? 'app-shell app-shell--home' : 'app-shell'}
      >
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="utility-bar">
          <p>{config.global.utilityText}</p>
          <Link to={config.global.utilityLinkHref}>{config.global.utilityLinkLabel} <ArrowRight size={14} weight="bold" /></Link>
        </div>
        <header className="site-header">
          <button
            ref={menuTrigger}
            className="icon-button menu-trigger"
            type="button"
            aria-label="Open menu"
            aria-controls="site-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <List size={23} />
          </button>
          <Link className="brand-mark" to="/" aria-label={`${config.global.siteName} home`}>
            <img src={config.global.logoUrl} alt={config.global.siteName} width="307" height="195" />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {primaryLinks.map((link) => (
              <NavLink key={link.id} to={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              ref={searchTrigger}
              className="icon-button"
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-controls="site-search-panel"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X size={21} /> : <MagnifyingGlass size={21} />}
            </button>
            <Link className="icon-button desktop-action" to="/account" aria-label="Account">
              <UserCircle size={22} />
            </Link>
            <Link className="icon-button bag-link" to="/cart" aria-label={`Cart with ${count} items`}>
              <Bag size={22} />
              {count > 0 ? <span>{count}</span> : null}
            </Link>
          </div>
          {searchOpen ? (
            <form id="site-search-panel" className="header-search" role="search" onSubmit={submitSearch}>
              <label htmlFor="site-search">Search WE</label>
              <input
                ref={searchInput}
                id="site-search"
                type="search"
                name="q"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, series, and stories…"
              />
              <button type="submit" aria-label="Submit search">
                <ArrowRight size={22} />
              </button>
            </form>
          ) : null}
        </header>

        <main id="main-content">{children}</main>
        <Footer />
      </div>

      {menuOpen ? (
        <div id="site-menu" ref={menuDialog} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mobile-menu__top">
            <img src={config.global.logoUrl} alt={config.global.siteName} width="307" height="195" />
            <button className="icon-button" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={25} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {primaryLinks.map((link, index) => (
              <Link key={link.id} to={link.href}>
                <span>0{index + 1}</span>
                {link.label}
                <ArrowRight size={21} />
              </Link>
            ))}
          </nav>
          <div className="mobile-menu__secondary">
            <Link to="/collections">All series</Link>
            <Link to="/craftsmanship">Craftsmanship</Link>
            <Link to="/community">Community</Link>
            <Link to="/support">Help & support</Link>
            <Link to="/account">Account</Link>
          </div>
        </div>
      ) : null}

    </>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { config } = useSiteConfig()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-manifesto">
          <p className="eyebrow">{config.global.footerEyebrow}</p>
          <h2>{config.global.footerTitle.split('\n').map((line, index) => <span key={`${line}-${index}`}>{index ? <br /> : null}{line}</span>)}</h2>
          {config.global.newsletterEnabled && submitted ? (
            <p className="form-success" role="status">You’re on the WE list. Thank you.</p>
          ) : config.global.newsletterEnabled ? (
            <form className="newsletter-form" onSubmit={submit}>
              <label htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com…"
                required
              />
              <button type="submit" aria-label="Join the email list"><ArrowRight size={21} /></button>
            </form>
          ) : null}
        </div>
        <div className="footer-links">
          <div>
            <h3>Explore</h3>
            <Link to="/collections">All series</Link>
            <Link to="/custom">Create yours</Link>
            <Link to="/stories">Stories</Link>
            <Link to="/community">Community</Link>
          </div>
          <div>
            <h3>WE</h3>
            <Link to="/about">About</Link>
            <Link to="/craftsmanship">Craftsmanship</Link>
            <Link to="/team">Team orders</Link>
            <a href={`mailto:${config.global.contactEmail}`}>Contact WE</a>
            <a href={`mailto:${config.global.supportEmail}`}>Email support</a>
            <Link to="/support">Support center</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link to="/legal/privacy">Privacy</Link>
            <Link to="/legal/terms">Terms</Link>
            <Link to="/legal/accessibility">Accessibility</Link>
            <Link to="/legal/shipping">Shipping & returns</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <Link className="brand-mark brand-mark--footer" to="/" aria-label={`${config.global.siteName} home`}>
          <img src={config.global.logoUrl} alt={config.global.siteName} width="307" height="195" />
        </Link>
        <p>© {new Date().getFullYear()} {config.global.siteName}.</p>
        <p>{config.global.footerTagline}</p>
      </div>
    </footer>
  )
}
