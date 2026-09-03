/**
 * =============================================================================
 *  KULJETUS JUMPPANEN OY – yrityksen tiedot
 * =============================================================================
 *
 *  TÄMÄ ON SIVUSTON AINOA PAIKKA, JOSSA YRITYSTIEDOT MÄÄRITELLÄÄN.
 *  Kun puhelinnumero, sähköposti, toimialue tai some-tilit saadaan tietoon,
 *  ne lisätään vain tähän tiedostoon – koko sivusto päivittyy automaattisesti.
 *
 *  Sääntö: tänne kirjataan vain varmistettuja tietoja.
 *  Tyhjä arvo (null tai '') tarkoittaa "ei vielä tiedossa", jolloin
 *  käyttöliittymä jättää kohdan kokonaan pois – se ei näytä placeholderia.
 *
 *  Lähde perustiedoille: PRH / YTJ, y-tunnus 3634642-5.
 * =============================================================================
 */

export const business = {
  // --- Viralliset perustiedot (varmistettu PRH/YTJ) -------------------------
  name: 'Kuljetus Jumppanen Oy',
  shortName: 'Kuljetus Jumppanen',
  legalForm: 'Osakeyhtiö',
  businessId: '3634642-5',
  vatId: 'FI36346425',
  /** Kaupparekisteriin merkitty 24.6.2026 */
  foundingDate: '2026-06-24',
  foundingText: 'kesäkuussa 2026',
  industry: 'Tieliikenteen tavarankuljetus',
  industryCode: '49410',

  // --- Vastuuhenkilö --------------------------------------------------------
  owner: {
    name: 'Roope Paavali Jumppanen',
    shortName: 'Roope Jumppanen',
    title: 'Toimitusjohtaja, yrittäjä',
  },

  // --- Osoite ---------------------------------------------------------------
  address: {
    street: 'Rauhankatu 5 A 36',
    postalCode: '80100',
    city: 'Joensuu',
    region: 'Pohjois-Karjala',
    country: 'Suomi',
    countryCode: 'FI',
  },

  // --- Yhteydenottokanavat --------------------------------------------------
  // Puhelin ja sähköposti näkyvät alatunnisteessa, yhteystietosivulla,
  // tietosuojaselosteessa ja rakenteisessa datassa – muuta ne vain tähän.
  // Tyhjä arvo (null) tarkoittaa "ei tiedossa", jolloin kanava jätetään
  // käyttöliittymästä kokonaan pois.
  //
  // Pääkehotus ("Kysy kuljetuksesta") vie yhteystietosivulle, ei suoraan
  // puheluun – ks. ctaTarget ja primaryContactAction() tiedoston lopussa.
  //
  contact: {
    /** @type {{display: string, href: string} | null} */
    phone: { display: '045 264 6870', href: '+358452646870' },
    /** @type {string | null} */
    email: 'jumppanenroope@gmail.com',
    /**
     * Näytetäänkö yhteydenottolomake yhteystietosivulla.
     * Lomake ilmestyy vasta, kun myös taustapalvelun osoite on täytetty
     * tiedostoon src/config/forms.js – muuten sivustolla näkyisi lomake,
     * joka ei oikeasti lähetä viestiä. Asennusohje: google-apps-script/.
     */
    formEnabled: true,
    /**
     * Mihin sivuston pääkehotus ("Kysy kuljetuksesta") johtaa.
     *   'page'   – yhteystietosivulle, jossa puhelin ja sähköposti näkyvät
     *              rinnakkain ja asiakas valitsee itselleen sopivan kanavan
     *   'direct' – suoraan puhelin- tai sähköpostisovellukseen
     * @type {'page' | 'direct'}
     */
    ctaTarget: 'page',
  },

  // --- Kalusto (vain varmistettu tieto) -------------------------------------
  fleet: {
    description: 'Lava-auto',
  },

  // --- Sosiaalinen media ----------------------------------------------------
  // Lisää vain viralliset, varmistetut tilit. Tyhjä lista = ei some-osiota.
  /** @type {{name: string, url: string}[]} */
  social: [],
}

/** Osoite yhdellä rivillä, esim. "Rauhankatu 5 A 36, 80100 Joensuu" */
export const addressOneLine = [
  business.address.street,
  `${business.address.postalCode} ${business.address.city}`,
].join(', ')

/** Onko jokin suora yhteydenottokanava käytettävissä? */
export const hasPhone = Boolean(business.contact.phone?.href)
export const hasEmail = Boolean(business.contact.email)
export const hasDirectContact = hasPhone || hasEmail
export const hasSocial = business.social.length > 0

/**
 * Ensisijainen yhteydenottotapa CTA-painikkeille.
 *
 * Painike vie oletuksena yhteystietosivulle myös silloin, kun puhelin ja
 * sähköposti ovat tiedossa: sivulla asiakas näkee molemmat kanavat ja voi
 * valita itselleen sopivan. Puhelinnumero ja sähköposti näkyvät joka
 * tapauksessa alatunnisteessa ja yhteystietosivulla suorina linkkeinä.
 *
 * Jos painikkeen halutaan avaavan suoraan puhelin- tai sähköpostisovellus,
 * vaihda contact.ctaTarget arvoon 'direct'.
 */
export function primaryContactAction() {
  if (business.contact.ctaTarget === 'direct') {
    if (hasPhone) {
      return {
        type: 'phone',
        label: `Soita ${business.contact.phone.display}`,
        href: `tel:${business.contact.phone.href}`,
      }
    }
    if (hasEmail) {
      return {
        type: 'email',
        label: 'Lähetä sähköpostia',
        href: `mailto:${business.contact.email}`,
      }
    }
  }
  return { type: 'page', label: 'Kysy kuljetuksesta', href: '/yhteystiedot' }
}

export default business
