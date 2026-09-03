import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ContactChannels from '../components/ContactChannels.jsx'
import ContactForm from '../components/ContactForm.jsx'
import { business, hasDirectContact, hasEmail, hasPhone } from '../config/business.js'
import { isContactFormEnabled } from '../config/forms.js'
import { breadcrumbSchema, organizationSchema } from '../lib/structuredData.js'
import './Contact.css'

/** Mitä kannattaa kertoa kuljetusta kysyessä. */
const checklist = [
  'Mitä on kuljetettavana ja suunnilleen minkä kokoinen tavara on',
  'Noutopaikka ja toimitusosoite',
  'Toivottu ajankohta tai aikaväli',
  'Tarvitaanko apua lastaamisessa',
]

export default function Contact() {
  return (
    <>
      <Seo
        title="Yhteystiedot"
        description="Kuljetus Jumppanen Oy, Rauhankatu 5 A 36, 80100 Joensuu. Y-tunnus 3634642-5. Ota yhteyttä ja kysy tavarankuljetuksesta."
        path="/yhteystiedot"
        jsonLd={[
          organizationSchema(),
          breadcrumbSchema([
            { label: 'Etusivu', path: '/' },
            { label: 'Yhteystiedot', path: '/yhteystiedot' },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Yhteystiedot"
        title="Kysy kuljetuksesta"
        lead={
          hasDirectContact
            ? 'Kerro lyhyesti mitä olisi kuljetettavana, mistä ja minne. Vastaamme ja sovitaan kuljetuksesta.'
            : 'Kuljetus Jumppanen Oy on aloittanut toimintansa Joensuussa. Alla yrityksen viralliset tiedot sekä ohjeet siitä, mitä kannattaa kertoa kuljetusta kysyessä.'
        }
      />

      <section className="section contact-main" id="lomake">
        <div className="container contact-main__inner">
          {/* --- Yhteydenotto: lomake (tai suorat kanavat, jos lomaketta ei
              ole otettu käyttöön tiedostossa src/config/forms.js) --- */}
          <Reveal className="contact-main__primary">
            <h2 className="contact-heading">Yhteydenotto</h2>
            {isContactFormEnabled ? (
              <>
                <p className="contact-lead">
                  Täytä lomake, niin vastaamme sähköpostitse tai soitamme. Tähdellä
                  merkityt kentät ovat pakollisia.
                </p>
                <ContactForm />
              </>
            ) : (
              <ContactChannels />
            )}

            <h2 className="contact-heading contact-heading--spaced">
              Näin saat nopeimmin vastauksen
            </h2>
            <p className="contact-lead">
              Kun otat yhteyttä, kerro nämä asiat – niin pystymme arvioimaan kuljetuksen
              heti ensimmäisellä kerralla.
            </p>
            <ul className="checklist">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          {/* --- Osoite ja yritystiedot --- */}
          <Reveal className="contact-main__aside" delay={100}>
            <div className="info-card">
              <h2 className="info-card__title">{business.name}</h2>

              <div className="info-card__block">
                <h3 className="info-card__label">Osoite</h3>
                <address className="info-card__address">
                  {business.address.street}
                  <br />
                  {business.address.postalCode} {business.address.city}
                  <br />
                  {business.address.country}
                </address>
              </div>

              {hasPhone && (
                <div className="info-card__block">
                  <h3 className="info-card__label">Puhelin</h3>
                  <p className="info-card__value">
                    <a className="info-card__link" href={`tel:${business.contact.phone.href}`}>
                      {business.contact.phone.display}
                    </a>
                  </p>
                </div>
              )}

              {hasEmail && (
                <div className="info-card__block">
                  <h3 className="info-card__label">Sähköposti</h3>
                  <p className="info-card__value">
                    <a className="info-card__link" href={`mailto:${business.contact.email}`}>
                      {business.contact.email}
                    </a>
                  </p>
                </div>
              )}

              <div className="info-card__block">
                <h3 className="info-card__label">Y-tunnus</h3>
                <p className="info-card__value">{business.businessId}</p>
              </div>

              <div className="info-card__block">
                <h3 className="info-card__label">Toimiala</h3>
                <p className="info-card__value">{business.industry}</p>
              </div>

              <div className="info-card__block">
                <h3 className="info-card__label">Yhtiömuoto</h3>
                <p className="info-card__value">{business.legalForm}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
