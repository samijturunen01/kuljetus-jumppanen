import lockupDark from '../assets/logo-kuljetus-jumppanen.png'
import lockupLight from '../assets/logo-kuljetus-jumppanen-light.png'
import './Logo.css'

/** Rajatun tunnuksen todelliset mittasuhteet – estävät layout shiftin. */
const NATURAL_WIDTH = 640
const NATURAL_HEIGHT = 249

/**
 * Kuljetus Jumppanen Oy:n tunnus.
 *
 * Kuvat on rajattu ja skaalattu yrityksen omasta logotiedostosta
 * (`kuljetus-jumppanen-logo.png` projektin juuressa). Jos logo joskus vaihtuu,
 * riittää että `src/assets`-kuvat korvataan – käyttöpaikkoja ei tarvitse muuttaa.
 *
 * KOKO tulee CSS-muuttujasta `--logo-h` (oletus 40 px), jotta se voi vaihdella
 * näytön leveyden mukaan. Esim. `.brand__logo { --logo-h: 48px }`.
 *
 * @param {{ tone?: 'light' | 'dark', className?: string, alt?: string }} props
 *   tone – 'light': vaalea versio tummalle taustalle (oletus)
 *          'dark':  alkuperäinen sininen–musta versio vaalealle taustalle
 *   alt  – tyhjä oletuksena, koska tunnus on yleensä linkin sisällä, jolla on
 *          oma aria-label. Anna teksti vain jos tunnus esiintyy yksinään.
 */
export default function Logo({ tone = 'light', className = '', alt = '' }) {
  return (
    <img
      className={`logo ${className}`}
      src={tone === 'dark' ? lockupDark : lockupLight}
      alt={alt}
      width={NATURAL_WIDTH}
      height={NATURAL_HEIGHT}
      decoding="async"
    />
  )
}
