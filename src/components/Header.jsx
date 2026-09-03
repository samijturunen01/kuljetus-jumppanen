import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { business, primaryContactAction } from '../config/business.js'
import { navigation } from '../data/navigation.js'
import Logo from './Logo.jsx'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  const cta = primaryContactAction()

  // Sulje valikko aina sivunvaihdon yhteydessä
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Estä taustan vieritys kun mobiilivalikko on auki
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Esc sulkee valikon ja palauttaa kohdistuksen painikkeeseen
  useEffect(() => {
    if (!open) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Ohut varjo/raja kun sivua on vieritetty
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <Link to="/" className="brand" aria-label={`${business.name} – etusivu`}>
          <Logo tone="dark" className="brand__logo" />
        </Link>

        <nav className="site-nav" aria-label="Päävalikko">
          <ul className="site-nav__list">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `site-nav__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__cta">
          {cta.type === 'page' ? (
            <Link className="btn btn--primary btn--sm" to={cta.href}>
              <span className="btn__label">{cta.label}</span>
            </Link>
          ) : (
            <a className="btn btn--primary btn--sm" href={cta.href}>
              <span className="btn__label">{cta.label}</span>
            </a>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-toggle__box" aria-hidden="true">
            <span className={`nav-toggle__bar ${open ? 'is-open' : ''}`} />
          </span>
          <span className="visually-hidden">{open ? 'Sulje valikko' : 'Avaa valikko'}</span>
        </button>
      </div>

      {/* Mobiilivalikko */}
      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Valikko" className="mobile-nav__inner container">
          <ul className="mobile-nav__list">
            {navigation.map((item, index) => (
              <li key={item.path} style={{ '--i': index }}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `mobile-nav__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <span className="mobile-nav__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-nav__footer">
            {cta.type === 'page' ? (
              <Link className="btn btn--primary btn--lg" to={cta.href}>
                <span className="btn__label">{cta.label}</span>
                <span className="btn__arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 12" width="20" height="12" fill="none" focusable="false">
                    <path d="M0 6h17M12.5 1 18 6l-5.5 5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </Link>
            ) : (
              <a className="btn btn--primary btn--lg" href={cta.href}>
                <span className="btn__label">{cta.label}</span>
              </a>
            )}
            <p className="mobile-nav__meta">
              {business.address.city} · Y-tunnus {business.businessId}
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
