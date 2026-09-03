/**
 * reCAPTCHA v3 – lataus ja tokenin haku.
 *
 * Skripti ladataan Googlelta vasta silloin, kun käyttäjä alkaa täyttää
 * lomaketta. Näin pelkkä sivuston selailu ei tee yhtään pyyntöä
 * ulkopuolisiin palveluihin (ks. tietosuojaseloste ja README).
 *
 * reCAPTCHA v3 ei näytä käyttäjälle tehtävää: se antaa taustalla pisteet
 * väliltä 0–1, ja pisteet tarkistetaan taustapalvelussa (Apps Script)
 * salaisella avaimella. Selaimessa ei siis voi ohittaa tarkistusta.
 */

const SCRIPT_ID = 'recaptcha-v3'

/** @type {Promise<any> | null} */
let loader = null

/**
 * Lataa reCAPTCHA-skriptin kerran ja palauttaa valmiin grecaptcha-olion.
 * @param {string} siteKey
 * @returns {Promise<any>}
 */
export function loadRecaptcha(siteKey) {
  if (!siteKey) return Promise.reject(new Error('reCAPTCHA-sivustoavain puuttuu.'))
  if (loader) return loader

  loader = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('reCAPTCHA vaatii selainympäristön.'))
      return
    }

    const done = () => {
      const api = window.grecaptcha
      if (!api || typeof api.ready !== 'function') {
        reject(new Error('reCAPTCHA ei latautunut oikein.'))
        return
      }
      api.ready(() => resolve(api))
    }

    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      if (window.grecaptcha) done()
      else {
        existing.addEventListener('load', done, { once: true })
        existing.addEventListener('error', () => reject(new Error('lataus epäonnistui')), {
          once: true,
        })
      }
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.addEventListener('load', done, { once: true })
    script.addEventListener(
      'error',
      () => {
        // Sallitaan uusi yritys, jos verkko oli hetken poikki.
        loader = null
        script.remove()
        reject(new Error('reCAPTCHA-palvelun lataus epäonnistui.'))
      },
      { once: true },
    )
    document.head.appendChild(script)
  })

  return loader
}

/**
 * Hakee kertakäyttöisen tokenin lomakkeen lähetystä varten.
 * Token vanhenee noin kahdessa minuutissa, joten se haetaan vasta
 * lähetyshetkellä.
 *
 * @param {string} siteKey
 * @param {string} action
 * @returns {Promise<string>}
 */
export async function getRecaptchaToken(siteKey, action) {
  const api = await loadRecaptcha(siteKey)
  const token = await api.execute(siteKey, { action })
  if (!token) throw new Error('reCAPTCHA ei palauttanut tunnistetta.')
  return token
}
