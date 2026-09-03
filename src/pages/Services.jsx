import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Media from '../components/Media.jsx'
import VehicleGraphic from '../components/VehicleGraphic.jsx'
import Road from '../components/Road.jsx'
import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { services } from '../data/services.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Services.css'

const steps = [
  {
    title: 'Ota yhteyttä',
    text: 'Kerro mitä on kuljetettavana, mistä ja minne sekä milloin kuljetus olisi tarpeen.',
  },
  {
    title: 'Sovitaan yksityiskohdat',
    text: 'Käydään läpi aikataulu, tavaran koko ja hinta. Saat tiedon ennen kuljetusta.',
  },
  {
    title: 'Kuljetus hoituu',
    text: 'Tavara noudetaan ja toimitetaan sovitusti. Yhteys kuljettajaan säilyy koko ajan.',
  },
]

export default function Services() {
  return (
    <>
      <Seo
        title="Kuljetuspalvelut Joensuussa"
        description="Kuljetus Jumppanen Oy hoitaa tavarankuljetukset lava-autolla Joensuussa. Sovimme kuljetuksen yksityiskohdat aina asiakkaan tarpeen mukaan."
        path="/kuljetuspalvelut"
        jsonLd={breadcrumbSchema([
          { label: 'Etusivu', path: '/' },
          { label: 'Kuljetuspalvelut', path: '/kuljetuspalvelut' },
        ])}
      />

      <PageHeader
        eyebrow="Kuljetuspalvelut"
        title="Tavarankuljetukset lava-autolla"
        lead="Hoidamme tieliikenteen tavarankuljetuksia lava-autolla. Kuljetuksen sisältö, aikataulu ja hinta sovitaan aina asiakkaan kanssa etukäteen."
      />

      {/* --- Palvelut --- */}
      <section className="section services-list" aria-labelledby="services-heading">
        <div className="container">
          <h2 id="services-heading" className="visually-hidden">
            Palvelut
          </h2>

          <div className="services-grid">
            {services.map((service, index) => (
              <Reveal as="article" className="service-block" key={service.id} delay={index * 70}>
                <p className="service-block__number" aria-hidden="true">
                  {service.number}
                </p>
                <h3 className="service-block__title">{service.title}</h3>
                <p className="service-block__text">{service.summary}</p>
                {service.points?.length > 0 && (
                  <ul className="service-block__points">
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="services-note">
            <p>
              Palvelukuvaukset tarkentuvat toiminnan käynnistyessä. Jos et ole varma,
              sopiiko kuljetus lava-autolla hoidettavaksi, kysy rohkeasti – katsotaan
              asia yhdessä.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --- Näin se etenee --- */}
      <section className="section section--dark process" aria-labelledby="process-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Näin se etenee</p>
            <h2 id="process-title" className="section-title">
              Kolme askelta kuljetukseen
            </h2>
          </Reveal>

          <ol className="process__list">
            {steps.map((step, index) => (
              <Reveal as="li" className="process__step" key={step.title} delay={index * 80}>
                <span className="process__index" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="process__title">{step.title}</h3>
                <p className="process__text">{step.text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="process__scene" aria-hidden="true">
            <Media
              name="services"
              className="process__media"
              fallback={<VehicleGraphic />}
            />
            <Road slim />
          </div>
        </div>
      </section>

      <CtaBand
        title="Kysy kuljetuksesta"
        text="Kerro tarpeestasi, niin katsotaan miten se hoituu."
      />
    </>
  )
}
