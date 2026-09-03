import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import Media from '../components/Media.jsx'
import VehicleGraphic from '../components/VehicleGraphic.jsx'
import Road from '../components/Road.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { business, primaryContactAction } from '../config/business.js'
import { services, promises } from '../data/services.js'
import { pricingSummary } from '../data/pricing.js'
import { organizationSchema, websiteSchema } from '../lib/structuredData.js'
import './Home.css'

const facts = [
  { label: 'Kotipaikka', value: 'Joensuu' },
  { label: 'Toimiala', value: 'Tieliikenteen tavarankuljetus' },
  { label: 'Kalusto', value: business.fleet.description },
  { label: 'Y-tunnus', value: business.businessId },
]

export default function Home() {
  const cta = primaryContactAction()

  return (
    <>
      <Seo
        title="Tavarankuljetus Joensuusta"
        description="Kuljetus Jumppanen Oy on joensuulainen kuljetusyritys. Hoidamme tavarankuljetukset lava-autolla. Kysy kuljetuksesta tai pyydä tarjous."
        path="/"
        jsonLd={[organizationSchema(), websiteSchema()]}
      />

      {/* ================= Hero ================= */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__grid" aria-hidden="true" />

        <div className="container hero__inner">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-mark" aria-hidden="true" />
            Joensuu · Pohjois-Karjala
          </p>

          <h1 id="hero-title" className="hero__title">
            Kuljetukset Joensuusta
            <span className="hero__title-accent"> luotettavasti perille.</span>
          </h1>

          <p className="hero__lead">
            {business.name} on joensuulainen tavarankuljetusyritys. Hoidamme
            kuljetukset lava-autolla ja sovimme yksityiskohdat suoraan kanssasi.
          </p>

          <div className="btn-row hero__actions">
            {cta.type === 'page' ? (
              <Button to={cta.href} variant="primary" size="lg">
                {cta.label}
              </Button>
            ) : (
              <Button href={cta.href} variant="primary" size="lg">
                {cta.label}
              </Button>
            )}
            <Button to="/kuljetuspalvelut" variant="ghost" size="lg">
              Kuljetuspalvelut
            </Button>
          </div>
        </div>

        {/* Tie ja auto. Kuva vaihtuu valokuvaksi, kun sellainen lisätään
            tiedostoon src/data/media.js – ks. Media-komponentti. */}
        <div className="hero__scene">
          <Media
            name="hero"
            priority
            className="hero__media"
            fallback={<VehicleGraphic className="hero__vehicle" />}
          />
          <Road />
        </div>
      </section>

      {/* ================= Perustiedot ================= */}
      <section className="facts" aria-label="Yrityksen perustiedot">
        <div className="container">
          <dl className="facts__list">
            {facts.map((fact) => (
              <div className="facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= Palvelut ================= */}
      <section className="section home-services" aria-labelledby="services-title">
        <div className="container">
          <Reveal className="home-services__head">
            <p className="eyebrow">Kuljetuspalvelut</p>
            <h2 id="services-title" className="section-title">
              Tavarat liikkeelle ilman turhaa säätöä
            </h2>
            <p className="lead home-services__intro">
              Kerro mitä on kuljetettavana, mistä ja minne. Sovitaan aikataulusta ja
              hinnasta etukäteen – sen jälkeen tavara lähtee matkaan.
            </p>
          </Reveal>

          <ol className="service-rows">
            {services.map((service, index) => (
              <Reveal as="li" className="service-row" key={service.id} delay={index * 70}>
                <span className="service-row__number" aria-hidden="true">
                  {service.number}
                </span>
                <div className="service-row__body">
                  <h3 className="service-row__title">{service.title}</h3>
                  <p className="service-row__text">{service.summary}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <p className="home-services__more">
            <Link to="/kuljetuspalvelut" className="text-link">
              Lue lisää kuljetuspalveluista
            </Link>
          </p>
        </div>
      </section>

      {/* ================= Hinnat =================
          Tiivistelmä hinnoittelun periaatteesta. Varsinainen hinnasto on
          omalla sivullaan – tässä ei toisteta painoluokkien hintataulukkoa.
          Luvut tulevat tiedostosta src/data/pricing.js. */}
      <section className="section section--tint home-pricing" aria-labelledby="pricing-summary-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{pricingSummary.eyebrow}</p>
            <h2 id="pricing-summary-title" className="section-title">
              {pricingSummary.title}
            </h2>
            <p className="lead home-pricing__intro">{pricingSummary.lead}</p>
          </Reveal>

          <ul className="price-highlights">
            {pricingSummary.highlights.map((item, index) => (
              <Reveal as="li" className="price-highlight" key={item.id} delay={index * 70}>
                <p className="price-highlight__label">{item.label}</p>
                <p className="price-highlight__value">
                  <span className="price-highlight__figure">{item.figure}</span>
                  <span className="price-highlight__unit">{item.unit}</span>
                </p>
                <p className="price-highlight__text">{item.text}</p>
              </Reveal>
            ))}
          </ul>

          <p className="home-pricing__note">{pricingSummary.vatNote}</p>

          <div className="home-pricing__actions">
            <Button to="/hinnasto" variant="primary">
              {pricingSummary.ctaLabel}
            </Button>
            <Link to="/hinnasto" className="text-link">
              {pricingSummary.linkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Miksi ================= */}
      <section className="section section--dark home-why" aria-labelledby="why-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Miksi meille</p>
            <h2 id="why-title" className="section-title">
              Pieni yritys, suora yhteys
            </h2>
          </Reveal>

          <ul className="why-list">
            {promises.map((item, index) => (
              <Reveal as="li" className="why-item" key={item.id} delay={index * 60}>
                <h3 className="why-item__title">{item.title}</h3>
                <p className="why-item__text">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= Yritys ================= */}
      <section className="section home-about" aria-labelledby="about-title">
        <div className="container home-about__inner">
          <Reveal className="home-about__content">
            <p className="eyebrow">Yritys</p>
            <h2 id="about-title" className="section-title">
              Joensuulainen kuljetusyritys, jonka tavoittaa
            </h2>
            <div className="prose home-about__text">
              <p>
                {business.name} on {business.foundingText} perustettu joensuulainen
                yritys. Toimintaa pyörittää yrittäjä {business.owner.shortName}, joka
                hoitaa kuljetukset omalla lava-autollaan.
              </p>
              <p>
                Uusi yritys tarkoittaa käytännössä sitä, että jokainen kuljetus on
                meille tärkeä. Asiat sovitaan suoraan yrittäjän kanssa – ilman
                välikäsiä.
              </p>
            </div>
            <Button to="/yritys" variant="secondary">
              Tutustu yritykseen
            </Button>
          </Reveal>

          <Reveal className="home-about__aside" delay={120}>
            <Media name="owner" className="home-about__portrait" />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
