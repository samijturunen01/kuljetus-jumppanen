import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Media from '../components/Media.jsx'
import VehicleGraphic from '../components/VehicleGraphic.jsx'
import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { business, addressOneLine, hasEmail, hasPhone } from '../config/business.js'
import { promises } from '../data/services.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Company.css'

/** Galleria vasemmalta oikealle, ylhäältä alas – kuvat ks. src/data/media.js.
 *  `portrait` rajaa pystykuvan niin, että henkilö pysyy kuva-alassa. */
const gallery = [
  { name: 'owner', portrait: true },
  { name: 'truckSide' },
  { name: 'truckFront' },
  { name: 'truckLogo' },
]

export default function Company() {
  const details = [
    { label: 'Toiminimi', value: business.name },
    { label: 'Y-tunnus', value: business.businessId },
    { label: 'Yhtiömuoto', value: business.legalForm },
    { label: 'Kotipaikka', value: business.address.city },
    { label: 'Toimiala', value: business.industry },
    { label: 'Toimitusjohtaja', value: business.owner.name },
    { label: 'Osoite', value: addressOneLine },
    ...(hasPhone
      ? [
          {
            label: 'Puhelin',
            value: business.contact.phone.display,
            href: `tel:${business.contact.phone.href}`,
          },
        ]
      : []),
    ...(hasEmail
      ? [
          {
            label: 'Sähköposti',
            value: business.contact.email,
            href: `mailto:${business.contact.email}`,
          },
        ]
      : []),
  ]

  return (
    <>
      <Seo
        title="Yritys"
        description="Kuljetus Jumppanen Oy on kesäkuussa 2026 perustettu joensuulainen kuljetusyritys. Yrittäjä Roope Jumppanen hoitaa tavarankuljetukset omalla lava-autollaan."
        path="/yritys"
        jsonLd={breadcrumbSchema([
          { label: 'Etusivu', path: '/' },
          { label: 'Yritys', path: '/yritys' },
        ])}
      />

      <PageHeader
        eyebrow="Yritys"
        title="Kuljetus Jumppanen Oy"
        lead="Joensuulainen tavarankuljetusyritys, jota luotsaa yrittäjä Roope Jumppanen."
      />

      {/* --- Esittely --- */}
      <section className="section company-intro">
        <div className="container company-intro__inner">
          <Reveal className="company-intro__text prose">
            <h2>Uusi yritys, tuttu tapa toimia</h2>
            <p>
              {business.name} on {business.foundingText} perustettu joensuulainen
              yritys. Toimialana on tieliikenteen tavarankuljetus: hoidamme tavaroiden
              kuljetuksia lava-autolla.
            </p>
            <p>
              Yrityksen takana on {business.owner.name}. Hän vastaa yrityksen
              toiminnasta ja ajaa kuljetukset itse. Käytännössä se tarkoittaa, että
              sama henkilö sopii kuljetuksesta, hoitaa sen ja vastaa kysymyksiin.
            </p>
            <p>
              Toiminta on vasta käynnistynyt, ja se näkyy tavassa palvella: jokainen
              kuljetus hoidetaan huolella ja sovitulla tavalla.
            </p>
          </Reveal>

          <Reveal className="company-intro__aside" delay={120}>
            <div className="principle">
              <p className="principle__lead">
                Sovitaan kuljetuksesta selkeästi ja hoidetaan se sitten sovitusti.
              </p>
              <dl className="principle__facts">
                <div>
                  <dt>Yrittäjä</dt>
                  <dd>{business.owner.name}</dd>
                </div>
                <div>
                  <dt>Kotipaikka</dt>
                  <dd>{business.address.city}</dd>
                </div>
                <div>
                  <dt>Perustettu</dt>
                  <dd>2026</dd>
                </div>
                {hasPhone && (
                  <div>
                    <dt>Puhelin</dt>
                    <dd>
                      <a
                        className="principle__link"
                        href={`tel:${business.contact.phone.href}`}
                      >
                        {business.contact.phone.display}
                      </a>
                    </dd>
                  </div>
                )}
                {hasEmail && (
                  <div>
                    <dt>Sähköposti</dt>
                    <dd>
                      <a
                        className="principle__link"
                        href={`mailto:${business.contact.email}`}
                      >
                        {business.contact.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Kuvat --- */}
      <section className="section section--tint company-gallery" aria-labelledby="gallery-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Kuvat</p>
            <h2 id="gallery-title" className="section-title">
              Auto ja kuljettaja
            </h2>
          </Reveal>

          <ul className="gallery-grid">
            {gallery.map((item, index) => (
              <Reveal as="li" className="gallery-grid__item" key={item.name} delay={index * 70}>
                <Media
                  name={item.name}
                  className={
                    item.portrait
                      ? 'gallery-grid__media gallery-grid__media--portrait'
                      : 'gallery-grid__media'
                  }
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Toimintatapa --- */}
      <section className="section section--dark company-values" aria-labelledby="values-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Toimintatapa</p>
            <h2 id="values-title" className="section-title">
              Näin hommat hoituvat
            </h2>
          </Reveal>

          <ul className="values-list">
            {promises.map((item, index) => (
              <Reveal as="li" className="values-item" key={item.id} delay={index * 60}>
                <h3 className="values-item__title">{item.title}</h3>
                <p className="values-item__text">{item.text}</p>
              </Reveal>
            ))}
          </ul>

          <div className="company-values__scene" aria-hidden="true">
            <Media name="company" className="company-values__media" fallback={<VehicleGraphic />} />
          </div>
        </div>
      </section>

      {/* --- Viralliset tiedot --- */}
      <section className="section section--tint company-details" aria-labelledby="details-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Viralliset tiedot</p>
            <h2 id="details-title" className="section-title">
              Yritystiedot
            </h2>
          </Reveal>

          <Reveal>
            <dl className="details-list">
              {details.map((row) => (
                <div className="details-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>
                    {row.href ? (
                      <a className="details-row__link" href={row.href}>
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
