import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import PriceChecker from '../components/PriceChecker.jsx'
import { pricing } from '../data/pricing.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Pricing.css'

/**
 * Kuljetushinnasto. Kaikki hinnat ja ehdot tulevat tiedostosta
 * src/data/pricing.js – tätä sivua ei tarvitse muokata hintojen muuttuessa.
 */
export default function Pricing() {
  return (
    <>
      <Seo
        title="Kuljetushinnasto"
        description="Kuljetus Jumppanen Oy:n kuljetushinnasto Joensuussa: hinnat painon mukaan 30–70 €, lisäehdot pidemmille matkoille ja tuntiveloitus 50 €/h. Hinnat ALV 0."
        path="/hinnasto"
        jsonLd={breadcrumbSchema([
          { label: 'Etusivu', path: '/' },
          { label: 'Hinnasto', path: '/hinnasto' },
        ])}
      />

      <PageHeader eyebrow="Hinnasto" title={pricing.title} lead={pricing.intro} />

      <section className="section pricing" aria-labelledby="pricing-title">
        <div className="container">
          {/* --- Painoluokat painon mukaan --- */}
          <Reveal className="pricing__heading">
            <h2 id="pricing-title" className="pricing__heading-title">
              {pricing.areasTitle}
            </h2>
            <p className="pricing__heading-note">{pricing.areasNote}</p>
          </Reveal>

          <ul className="price-grid">
            {pricing.weightClasses.map((weight, index) => (
              <Reveal as="li" className="price-card" key={weight.id} delay={index * 70}>
                <p className="price-card__name">{weight.name}</p>
                <p className="price-card__weight">{weight.weight}</p>
                <p className="price-card__price">{weight.price},00 €</p>
              </Reveal>
            ))}
          </ul>

          {/* --- Interaktiivinen hinnan tarkistus --- */}
          <Reveal className="pricing__checker">
            <PriceChecker />
          </Reveal>

          <div className="pricing__details">
            {/* --- Matkan mukaan määräytyvät ehdot --- */}
            <Reveal className="pricing-rules">
              <h2 className="pricing-rules__title">Matkan mukaan</h2>
              <dl className="pricing-rules__list">
                {pricing.distances.map((row) => (
                  <div className="pricing-rules__row" key={row.id}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.rule} <strong>{row.value}</strong>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="pricing-rules__note">{pricing.note}</p>
            </Reveal>

            <div className="pricing__aside">
              {/* --- Tuntiveloitus: kuljetushinnoista erillinen työveloitus --- */}
              <Reveal className="pricing-hourly" delay={100}>
                <p className="pricing-hourly__eyebrow">{pricing.hourly.eyebrow}</p>
                <h2 className="pricing-hourly__title">{pricing.hourly.label}</h2>
                <p className="pricing-hourly__value">{pricing.hourly.value}</p>
                <p className="pricing-hourly__note">{pricing.hourly.note}</p>
              </Reveal>

              {/* --- Huomautus arvonlisäverosta --- */}
              <Reveal as="p" className="pricing__vat" delay={160}>
                {pricing.vatNotice}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
