/**
 * Kuvamateriaali.
 *
 * Valokuvat sijaitsevat kansiossa src/assets/ ja tuodaan tänne importilla.
 * <Media />-komponentti lukee tästä tiedostosta, joten kuvan vaihtaminen
 * onnistuu muuttamatta sivukomponentteja.
 *
 * Ne kohdat, joissa `src` on null, käyttävät edelleen sivuston omaa
 * SVG-grafiikkaa (ks. <Media />:n `fallback`).
 *
 * Kentät:
 *   src    – kuvatiedosto (null = käytetään sivuston omaa grafiikkaa)
 *   alt    – kuvaileva vaihtoehtoinen teksti (pakollinen kun src on asetettu)
 *   width  – alkuperäinen leveys pikseleinä (estää layout shiftin)
 *   height – alkuperäinen korkeus pikseleinä
 */

import ownerPhoto from '../assets/roope-jumppanen.webp'
import truckSide from '../assets/lava-auto-sivulta.webp'
import truckFront from '../assets/lava-auto-edesta.webp'
import truckLogo from '../assets/lava-auto-logo.webp'

/** @typedef {{src: string|null, alt: string, width?: number, height?: number}} MediaItem */

/** @type {Record<string, MediaItem>} */
export const media = {
  hero: {
    src: null,
    alt: '',
  },
  services: {
    src: null,
    alt: '',
  },
  company: {
    src: null,
    alt: '',
  },

  /** Yrittäjä Roope Jumppanen lava-auton edessä. */
  owner: {
    src: ownerPhoto,
    alt: 'Yrittäjä Roope Jumppanen lava-autonsa vieressä',
    width: 1457,
    height: 1600,
  },
  /** Lava-auto sivusta kuvattuna. */
  truckSide: {
    src: truckSide,
    alt: 'Kuljetus Jumppanen Oy:n lava-auto sivusta kuvattuna',
    width: 1600,
    height: 1052,
  },
  /** Lava-auto edestä, perässä peräkärry. */
  truckFront: {
    src: truckFront,
    alt: 'Lava-auto ja peräkärry pysäköintialueella',
    width: 1600,
    height: 1351,
  },
  /** Lähikuva auton kyljestä ja yrityksen logosta. */
  truckLogo: {
    src: truckLogo,
    alt: 'Kuljetus Jumppanen Oy:n logo lava-auton ovessa',
    width: 1600,
    height: 1503,
  },
}

export default media
