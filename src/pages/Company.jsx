import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Media from '../components/Media.jsx'
import VanGraphic from '../components/VanGraphic.jsx'
import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { business, addressOneLine } from '../config/business.js'
import { promises } from '../data/services.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Company.css'

export default function Company() {
  const details = [
    { label: 'Toiminimi', value: business.name },
    { label: 'Y-tunnus', value: business.businessId },
    { label: 'Yhtiömuoto', value: business.legalForm },
    { label: 'Kotipaikka', value: business.address.city },
    { label: 'Toimiala', value: business.industry },
    { label: 'Toimitusjohtaja', value: business.owner.name },
  ]

  return (
    <>
      <Seo
        title="Yritys"
        description="Kuljetus Jumppanen Oy on kesäkuussa 2026 perustettu joensuulainen kuljetusyritys. Yrittäjä Roope Jumppanen hoitaa tavarankuljetukset omalla pakettiautollaan."
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
              kuljetuksia pakettiautolla.
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
            <div className="person-card">
              <span className="person-card__mark" aria-hidden="true" />
              <p className="person-card__name">{business.owner.name}</p>
              <p className="person-card__role">{business.owner.title}</p>
              <hr className="person-card__rule" />
              <p className="person-card__note">
                Kuljetukset hoidetaan yrityksen omalla pakettiautolla.
              </p>
            </div>
          </Reveal>
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
            <Media name="company" className="company-values__media" fallback={<VanGraphic />} />
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
                  <dd>{row.value}</dd>
                </div>
              ))}
              <div className="details-row">
                <dt>Osoite</dt>
                <dd>{addressOneLine}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
