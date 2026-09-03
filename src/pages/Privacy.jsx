import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import {
  business,
  addressOneLine,
  hasDirectContact,
  hasEmail,
  hasPhone,
} from '../config/business.js'
import { isContactFormEnabled, isRecaptchaEnabled } from '../config/forms.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Privacy.css'

/**
 * Tietosuojaseloste.
 *
 * Kuvaa sivuston nykytilan: sivusto ei käytä evästeitä eikä analytiikkaa.
 * Lomaketta koskevat kohdat näytetään vain, kun yhteydenottolomake on
 * käytössä (ks. src/config/forms.js) – seloste pysyy näin aina samassa
 * tilassa kuin sivusto itse.
 */
export default function Privacy() {
  return (
    <>
      <Seo
        title="Tietosuoja"
        description={
          isContactFormEnabled
            ? 'Kuljetus Jumppanen Oy:n verkkosivuston tietosuojaseloste. Näin käsittelemme yhteydenottolomakkeen tietoja. Sivusto ei käytä evästeitä eikä analytiikkaa.'
            : 'Kuljetus Jumppanen Oy:n verkkosivuston tietosuojaseloste. Sivusto ei kerää henkilötietoja eikä käytä evästeitä tai analytiikkaa.'
        }
        path="/tietosuoja"
        jsonLd={breadcrumbSchema([
          { label: 'Etusivu', path: '/' },
          { label: 'Tietosuoja', path: '/tietosuoja' },
        ])}
      />

      <PageHeader
        eyebrow="Tietosuoja"
        title="Tietosuojaseloste"
        lead="Näin verkkosivustomme suhtautuu henkilötietoihin ja evästeisiin."
      />

      <section className="section">
        <div className="container container--narrow prose privacy">
          <p className="privacy__updated">Päivitetty 2.9.2026</p>

          <h2>Rekisterinpitäjä</h2>
          <p>
            {business.name} (y-tunnus {business.businessId})
            <br />
            {addressOneLine}
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
          </p>
          {!hasDirectContact && (
            <p>
              Tietosuoja-asioita koskevat yhteydenottotiedot julkaistaan{' '}
              <Link to="/yhteystiedot">yhteystiedoissa</Link> heti, kun yrityksen
              puhelinnumero ja sähköpostiosoite ovat käytettävissä.
            </p>
          )}

          <h2>Henkilötietojen käsittely sivustolla</h2>
          {isContactFormEnabled ? (
            <p>
              Tämä verkkosivusto on tiedottava esittelysivusto. Käyttäjän ei tarvitse
              rekisteröityä eikä kirjautua, eikä sivusto kerää henkilötietoja
              taustalla. Henkilötietoja käsitellään vain silloin, kun lähetät
              yhteydenottolomakkeen – ks. kohta “Yhteydenottolomake” alla.
            </p>
          ) : (
            <p>
              Tämä verkkosivusto on tiedottava esittelysivusto. Sivusto ei kerää
              henkilötietoja: sillä ei ole yhteydenotto- eikä tarjouspyyntölomaketta,
              eikä käyttäjän tarvitse rekisteröityä tai kirjautua.
            </p>
          )}

          {isContactFormEnabled && (
            <>
              <h2>Yhteydenottolomake</h2>
              <p>
                <Link to="/yhteystiedot">Yhteystiedot-sivulla</Link> on lomake, jolla
                voit kysyä kuljetuksesta. Lomake on vapaaehtoinen: yrityksen tavoittaa
                aina myös puhelimitse ja sähköpostilla.
              </p>
              <p>
                <strong>Mitä tietoja kerätään.</strong> Lomakkeella pyydetään nimi,
                sähköpostiosoite ja kuvaus kuljetettavasta tavarasta. Vapaaehtoisesti
                voit antaa puhelinnumeron, nouto- ja toimitusosoitteen sekä toivotun
                ajankohdan. Kerro lomakkeella vain kuljetuksen kannalta tarpeelliset
                asiat – älä lähetä arkaluonteisia tietoja.
              </p>
              <p>
                <strong>Mihin tietoja käytetään.</strong> Tiedot käytetään ainoastaan
                yhteydenottoon vastaamiseen ja kuljetuksesta sopimiseen. Käsittelyn
                oikeusperuste on oikeutettu etu vastata sinun tekemääsi yhteydenottoon
                sekä toimenpiteet ennen mahdollisen sopimuksen tekemistä. Tietoja ei
                käytetä markkinointiin ilman suostumustasi eikä luovuteta ulkopuolisille.
              </p>
              <p>
                <strong>Miten viesti kulkee.</strong> Lomake lähetetään Google Apps
                Script -palvelun kautta yrityksen sähköpostiin. Viestit säilyvät
                sähköpostissa niin kauan kuin ne ovat tarpeen yhteydenoton ja
                mahdollisen toimeksiannon hoitamiseksi, ja ne poistetaan, kun tarvetta
                ei enää ole. Käytettävä palvelu on Google Ireland Limitedin tarjoama.
              </p>
              {isRecaptchaEnabled && (
                <p>
                  <strong>Roskapostisuojaus.</strong> Lomakkeen väärinkäytön estämiseksi
                  käytetään Googlen reCAPTCHA v3 -palvelua. Se arvioi lähetyksen
                  automaattisesti ja kerää tätä varten teknisiä tietoja, kuten
                  IP-osoitteen ja tietoja selaimen käytöstä. Palveluun sovelletaan Googlen{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tietosuojakäytäntöä
                  </a>{' '}
                  ja{' '}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    käyttöehtoja
                  </a>
                  . reCAPTCHA ladataan vasta, kun alat täyttää lomaketta – jos et käytä
                  lomaketta, selaimesi ei ota yhteyttä Googleen.
                </p>
              )}
            </>
          )}

          <h2>Evästeet</h2>
          <p>
            Sivusto ei käytä evästeitä eikä muuta vastaavaa selaimeen tallennettavaa
            seurantatekniikkaa. Tästä syystä sivustolla ei myöskään ole
            evästesuostumusilmoitusta.
          </p>

          <h2>Analytiikka ja seuranta</h2>
          <p>
            Sivustolla ei ole kävijäseurantaa, mainosverkostojen seurantapikseleitä
            eikä muita kolmansien osapuolten seurantatyökaluja. Sivuston sisältö,
            myös kirjasimet, ladataan kokonaan sivuston omalta palvelimelta.
            {isRecaptchaEnabled
              ? ' Selaimesi ei siis ota yhteyttä ulkopuolisiin palveluihin sivua katsellessasi – ainoa poikkeus on yhteydenottolomakkeen roskapostisuojaus, joka ladataan vasta lomaketta täytettäessä.'
              : ' Selaimesi ei siis ota yhteyttä ulkopuolisiin palveluihin sivua katsellessasi.'}
          </p>

          <h2>Palvelinlokit</h2>
          <p>
            Sivustoa ylläpitävä palveluntarjoaja voi kerätä teknisiä lokitietoja,
            kuten IP-osoitteen ja selaintyypin, palvelun toiminnan ja tietoturvan
            varmistamiseksi. Näitä tietoja ei käytetä käyttäjien profilointiin.
          </p>

          <h2>Yhteydenotot</h2>
          <p>
            Kun otat yhteyttä yritykseen, käsittelemme antamiasi tietoja vain
            yhteydenoton hoitamiseksi ja kuljetuksesta sopimiseksi. Tietoja ei
            luovuteta ulkopuolisille eikä käytetä markkinointiin ilman suostumustasi.
          </p>

          <h2>Rekisteröidyn oikeudet</h2>
          <p>
            Sinulla on EU:n yleisen tietosuoja-asetuksen mukaiset oikeudet omiin
            tietoihisi: oikeus tarkastaa itseäsi koskevat tiedot, pyytää niiden
            oikaisua tai poistoa sekä vastustaa tai rajoittaa käsittelyä. Voit myös
            tehdä valituksen tietosuojavaltuutetun toimistolle.
          </p>

          <h2>Muutokset selosteeseen</h2>
          <p>
            Jos sivuston toiminta muuttuu – esimerkiksi jos käyttöön otetaan uusia
            palveluita tai lomakkeita – tämä seloste päivitetään vastaamaan uutta
            tilannetta.
          </p>
        </div>
      </section>
    </>
  )
}
