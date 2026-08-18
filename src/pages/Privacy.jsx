import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { business, addressOneLine, hasDirectContact } from '../config/business.js'
import { breadcrumbSchema } from '../lib/structuredData.js'
import './Privacy.css'

/**
 * Tietosuojaseloste.
 *
 * Kuvaa sivuston nykytilan: sivusto ei kerää henkilötietoja, ei käytä
 * evästeitä eikä analytiikkaa. Jos sivustolle lisätään myöhemmin
 * yhteydenotto- tai tarjouspyyntölomake, päivitä kohta "Yhteydenotot".
 */
export default function Privacy() {
  return (
    <>
      <Seo
        title="Tietosuoja"
        description="Kuljetus Jumppanen Oy:n verkkosivuston tietosuojaseloste. Sivusto ei kerää henkilötietoja eikä käytä evästeitä tai analytiikkaa."
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
          <p className="privacy__updated">Päivitetty 16.8.2026</p>

          <h2>Rekisterinpitäjä</h2>
          <p>
            {business.name} (y-tunnus {business.businessId})
            <br />
            {addressOneLine}
          </p>
          {!hasDirectContact && (
            <p>
              Tietosuoja-asioita koskevat yhteydenottotiedot julkaistaan{' '}
              <Link to="/yhteystiedot">yhteystiedoissa</Link> heti, kun yrityksen
              puhelinnumero ja sähköpostiosoite ovat käytettävissä.
            </p>
          )}

          <h2>Henkilötietojen käsittely sivustolla</h2>
          <p>
            Tämä verkkosivusto on tiedottava esittelysivusto. Sivusto ei kerää
            henkilötietoja: sillä ei ole yhteydenotto- eikä tarjouspyyntölomaketta,
            eikä käyttäjän tarvitse rekisteröityä tai kirjautua.
          </p>

          <h2>Evästeet</h2>
          <p>
            Sivusto ei käytä evästeitä eikä muuta vastaavaa selaimeen tallennettavaa
            seurantatekniikkaa. Tästä syystä sivustolla ei myöskään ole
            evästesuostumusilmoitusta.
          </p>

          <h2>Analytiikka ja seuranta</h2>
          <p>
            Sivustolla ei ole kävijäseurantaa, mainosverkostojen seurantapikseleitä
            eikä muita kolmansien osapuolten seurantatyökaluja. Sivuston sisältö
            ladataan kokonaan sivuston omalta palvelimelta, joten selaimesi ei ota
            yhteyttä ulkopuolisiin palveluihin sivua katsellessasi.
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
            Jos sivustolle lisätään myöhemmin esimerkiksi tarjouspyyntölomake,
            tämä seloste päivitetään vastaamaan uutta tilannetta.
          </p>
        </div>
      </section>
    </>
  )
}
