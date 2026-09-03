/**
 * =============================================================================
 *  YHTEYDENOTTOLOMAKKEEN ASETUKSET
 * =============================================================================
 *
 *  Lomake lähettää viestin Google Apps Script -taustapalveluun, joka
 *  tarkistaa reCAPTCHA v3 -pisteet ja lähettää viestin sähköpostiin.
 *  Taustapalvelun koodi ja asennusohje: kansio `google-apps-script/`.
 *
 *  Molemmat alla olevat arvot ovat julkisia tunnisteita – ne näkyvät
 *  selaimessa, eivätkä ne ole salaisuuksia. Salainen reCAPTCHA-avain
 *  (secret key) tallennetaan VAIN Apps Scriptin Script Properties -kohtaan,
 *  ei koskaan tähän tiedostoon.
 *
 *  Käyttöönotto:
 *    1. Julkaise Apps Script -projekti web-sovelluksena ja kopioi sen
 *       /exec-osoite kohtaan ENDPOINT_URL.
 *    2. Luo reCAPTCHA v3 -avainpari (google.com/recaptcha) ja kopioi
 *       sivustoavain (site key) kohtaan RECAPTCHA_SITE_KEY.
 *    3. Aseta `formEnabled: true` tiedostoon src/config/business.js.
 *
 *  Jos ENDPOINT_URL on tyhjä, lomaketta ei näytetä lainkaan – sivustolla ei
 *  siis koskaan ole lomaketta, joka näyttäisi lähettävän viestin
 *  lähettämättä sitä oikeasti.
 * =============================================================================
 */
import { business } from './business.js'

/** Apps Scriptin web-sovelluksen osoite, muotoa
 *  'https://script.google.com/macros/s/AKfycb.../exec' */
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbyt8W8UEnAFLRzloMrjvEqbBTEIG-8ugkU-N7BQ2pIvCLQdEHk-cRK_zkleojgE3zQwPQ/exec'

/** reCAPTCHA v3 -sivustoavain, muotoa '6Lc...' */
const RECAPTCHA_SITE_KEY = ''

/* Arvot voi antaa myös ympäristömuuttujina (esim. GitHub Actions ->
   repon Variables). Tyhjä ympäristömuuttuja ei ohita yllä olevaa arvoa. */
const endpoint = String(import.meta.env.VITE_FORM_ENDPOINT || ENDPOINT_URL).trim()
const siteKey = String(import.meta.env.VITE_RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY).trim()

export const contactForm = {
  /** Minne lomake lähetetään. Tyhjä = lomaketta ei näytetä. */
  endpoint,

  recaptcha: {
    /** Tyhjä avain = reCAPTCHAa ei ladata eikä käytetä. */
    siteKey,
    /** Toiminnon nimi, näkyy reCAPTCHAn hallintapaneelin tilastoissa.
        Sama arvo tarkistetaan Apps Scriptin puolella. */
    action: 'yhteydenotto',
    enabled: Boolean(siteKey),
  },

  /** Kentän enimmäispituudet. Samat rajat tarkistetaan myös palvelimella. */
  limits: {
    name: 120,
    email: 160,
    phone: 40,
    place: 200,
    schedule: 120,
    message: 2000,
  },

  /** Lähetyksen aikakatkaisu millisekunteina. */
  timeoutMs: 20000,
}

/**
 * Näytetäänkö lomake? Vaatii sekä kytkimen business.js:ssä että
 * määritellyn taustapalvelun osoitteen.
 */
export const isContactFormEnabled =
  Boolean(business.contact.formEnabled) && Boolean(contactForm.endpoint)

/**
 * Onko reCAPTCHA käytössä? Tietosuojaseloste kertoo reCAPTCHAsta vain
 * silloin, kun se on oikeasti käytössä – seloste ei saa kuvata palvelua,
 * jota sivusto ei käytä.
 */
export const isRecaptchaEnabled = isContactFormEnabled && contactForm.recaptcha.enabled

export default contactForm
