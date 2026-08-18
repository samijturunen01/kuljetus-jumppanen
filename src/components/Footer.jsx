import { Link } from 'react-router-dom'
import { business, hasEmail, hasPhone, hasSocial } from '../config/business.js'
import { navigation, footerLinks } from '../data/navigation.js'
import Logo from './Logo.jsx'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__stripe" aria-hidden="true" />

      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          {/* Tunnus kertoo yrityksen nimen; virallinen nimi toistuu
              alatunnisteen alareunassa tekijänoikeusrivillä. */}
          <Logo alt={business.name} className="site-footer__logo" />
          <p className="site-footer__tagline">Tavarankuljetukset Joensuusta.</p>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Yhteystiedot</h2>
          <address className="site-footer__address">
            {business.address.street}
            <br />
            {business.address.postalCode} {business.address.city}
            {hasPhone && (
              <>
                <br />
                <a href={`tel:${business.contact.phone.href}`}>
                  {business.contact.phone.display}
                </a>
              </>
            )}
            {hasEmail && (
              <>
                <br />
                <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a>
              </>
            )}
          </address>
          <p className="site-footer__meta">Y-tunnus {business.businessId}</p>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Sivut</h2>
          <ul className="site-footer__links">
            {navigation.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
            {footerLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Some-linkit näytetään vasta kun viralliset tilit on lisätty
            tiedostoon src/config/business.js */}
        {hasSocial && (
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Seuraa</h2>
            <ul className="site-footer__links">
              {business.social.map((item) => (
                <li key={item.url}>
                  <a href={item.url} rel="noopener noreferrer" target="_blank">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {year} {business.name}
        </p>
        <p>{business.industry} · {business.address.city}</p>
      </div>
    </footer>
  )
}
