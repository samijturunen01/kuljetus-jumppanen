/**
 * Kuvamateriaali.
 *
 * Sivustolla EI käytetä tällä hetkellä valokuvia. Kaikki visuaalisuus on
 * sivuston omaa grafiikkaa (SVG), jotta mikään kuva ei anna virheellistä
 * kuvaa yrityksen kalustosta tai toiminnan laajuudesta.
 *
 * KUN OIKEAT VALOKUVAT SAADAAN:
 *   1. Lisää kuvatiedostot kansioon  src/assets/  (mieluiten .webp tai .avif)
 *   2. Tuo ne tänne importilla ja täytä `src`, `width`, `height` ja `alt`
 *   3. Sivusto vaihtaa grafiikan valokuvaan automaattisesti –
 *      <Media />-komponentti hoitaa vaihdon, mitään muuta ei tarvitse muuttaa.
 *
 * Esimerkki:
 *   import vanHero from '../assets/pakettiauto-hero.webp'
 *   hero: { src: vanHero, width: 1600, height: 1067,
 *           alt: 'Kuljetus Jumppanen Oy:n pakettiauto Joensuussa' }
 *
 * Kentät:
 *   src    – kuvatiedosto (null = käytetään sivuston omaa grafiikkaa)
 *   alt    – kuvaileva vaihtoehtoinen teksti (pakollinen kun src on asetettu)
 *   width  – alkuperäinen leveys pikseleinä (estää layout shiftin)
 *   height – alkuperäinen korkeus pikseleinä
 */

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
}

export default media
