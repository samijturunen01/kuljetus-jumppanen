import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { business, hasEmail, hasPhone } from '../config/business.js'
import { contactForm, isContactFormEnabled } from '../config/forms.js'
import { getRecaptchaToken, loadRecaptcha } from '../lib/recaptcha.js'
import './ContactForm.css'

/**
 * Yhteydenottolomake.
 *
 * Lähettää viestin Google Apps Script -taustapalveluun (ks.
 * `google-apps-script/`), joka tarkistaa reCAPTCHA v3 -pisteet ja lähettää
 * viestin yrityksen sähköpostiin. Osoite ja sivustoavain määritellään
 * tiedostossa `src/config/forms.js`.
 *
 * Jos taustapalvelua ei ole määritelty, komponentti ei renderöi mitään –
 * sivustolla ei näytetä lomaketta, joka ei oikeasti lähetä viestiä.
 */

const EMPTY_VALUES = {
  name: '',
  email: '',
  phone: '',
  pickup: '',
  dropoff: '',
  schedule: '',
  message: '',
  loadingHelp: false,
  /** Hunajapurkki: näkymätön kenttä, jonka vain robotit täyttävät. */
  company: '',
}

/** Kevyt tarkistus – tarkempi validointi tehdään palvelimella. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const PHONE_PATTERN = /^[+()\d\s-]{6,}$/

/** Kenttien järjestys määrää, mihin kenttään virhetilanteessa siirretään. */
const FIELD_ORDER = ['name', 'email', 'phone', 'pickup', 'dropoff', 'schedule', 'message']

/**
 * Tarkistaa kentät ja palauttaa virheilmoitukset kentittäin.
 * @returns {Record<string, string>}
 */
function validate(values) {
  const errors = {}
  const { limits } = contactForm

  const name = values.name.trim()
  if (!name) errors.name = 'Kerro nimesi, jotta tiedämme kenelle vastaamme.'
  else if (name.length < 2) errors.name = 'Nimi on liian lyhyt.'
  else if (name.length > limits.name) errors.name = `Nimi on liian pitkä (enintään ${limits.name} merkkiä).`

  const email = values.email.trim()
  if (!email) errors.email = 'Sähköpostiosoite tarvitaan vastausta varten.'
  else if (email.length > limits.email) errors.email = 'Sähköpostiosoite on liian pitkä.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Tarkista sähköpostiosoite.'

  const phone = values.phone.trim()
  if (phone && !PHONE_PATTERN.test(phone)) errors.phone = 'Tarkista puhelinnumero.'
  else if (phone.length > limits.phone) errors.phone = 'Puhelinnumero on liian pitkä.'

  if (values.pickup.trim().length > limits.place) errors.pickup = 'Teksti on liian pitkä.'
  if (values.dropoff.trim().length > limits.place) errors.dropoff = 'Teksti on liian pitkä.'
  if (values.schedule.trim().length > limits.schedule) errors.schedule = 'Teksti on liian pitkä.'

  const message = values.message.trim()
  if (!message) errors.message = 'Kerro lyhyesti, mitä olisi kuljetettavana.'
  else if (message.length < 10) errors.message = 'Kirjoita hieman tarkemmin, mitä olisi kuljetettavana.'
  else if (message.length > limits.message)
    errors.message = `Viesti on liian pitkä (enintään ${limits.message} merkkiä).`

  return errors
}

export default function ContactForm() {
  const formId = useId()
  const fieldRefs = useRef({})
  const recaptchaWarmed = useRef(false)

  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  /** 'idle' | 'sending' | 'success' | 'error' */
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')

  if (!isContactFormEnabled) return null

  const fieldId = (name) => `${formId}-${name}`
  const errorId = (name) => `${formId}-${name}-error`

  const setField = (name) => (event) => {
    const { type, checked, value } = event.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    // Virheilmoitukset poistuvat heti, kun käyttäjä korjaa kenttää.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    if (status === 'error') setStatus('idle')
    setStatusMessage((prev) => (prev ? '' : prev))
  }

  /** Ladataan reCAPTCHA vasta, kun käyttäjä koskee lomakkeeseen. */
  const warmRecaptcha = () => {
    if (recaptchaWarmed.current || !contactForm.recaptcha.enabled) return
    recaptchaWarmed.current = true
    loadRecaptcha(contactForm.recaptcha.siteKey).catch(() => {
      // Virhe raportoidaan vasta lähetyksen yhteydessä.
      recaptchaWarmed.current = false
    })
  }

  const focusFirstError = (found) => {
    const first = FIELD_ORDER.find((name) => found[name])
    fieldRefs.current[first]?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const found = validate(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setStatus('idle')
      setStatusMessage('Tarkista merkityt kentät.')
      focusFirstError(found)
      return
    }

    setErrors({})
    setStatus('sending')
    setStatusMessage('Lähetetään viestiä…')

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), contactForm.timeoutMs)

    try {
      let token = ''
      if (contactForm.recaptcha.enabled) {
        token = await getRecaptchaToken(
          contactForm.recaptcha.siteKey,
          contactForm.recaptcha.action,
        )
      }

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        pickup: values.pickup.trim(),
        dropoff: values.dropoff.trim(),
        schedule: values.schedule.trim(),
        message: values.message.trim(),
        loadingHelp: values.loadingHelp,
        company: values.company, // hunajapurkki
        action: contactForm.recaptcha.action,
        token,
        page: typeof window !== 'undefined' ? window.location.href : '',
      }

      // Sisältötyyppi on tarkoituksella text/plain: näin selain lähettää
      // pyynnön ilman erillistä OPTIONS-esitarkistusta, jota Apps Script
      // ei osaa käsitellä. Apps Script lukee rungon e.postData.contents.
      const response = await fetch(contactForm.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow',
      })

      const raw = await response.text()
      let data = null
      try {
        data = JSON.parse(raw)
      } catch {
        data = null
      }

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Viestin lähetys ei onnistunut.')
      }

      setValues(EMPTY_VALUES)
      setStatus('success')
      setStatusMessage('')
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error?.name === 'AbortError'
          ? 'Lähetys kesti liian kauan. Tarkista verkkoyhteys ja yritä uudelleen.'
          : error?.message || 'Viestin lähetys ei onnistunut.',
      )
    } finally {
      clearTimeout(timer)
    }
  }

  if (status === 'success') {
    return (
      <div className="form-note form-note--success" role="status">
        <h3 className="form-note__title">Kiitos yhteydenotosta</h3>
        <p>
          Viesti on lähetetty. Otamme yhteyttä antamaasi sähköpostiosoitteeseen tai
          puhelinnumeroon.
        </p>
        <p>
          <button
            type="button"
            className="form-note__link"
            onClick={() => {
              setStatus('idle')
              setStatusMessage('')
            }}
          >
            Lähetä uusi viesti
          </button>
        </p>
      </div>
    )
  }

  const sending = status === 'sending'

  /** Yhden tekstikentän tulostus – pitää lomakkeen merkinnän yhtenäisenä. */
  const field = ({ name, label, type = 'text', required = false, hint, ...rest }) => {
    const invalid = Boolean(errors[name])
    return (
      <p className={`form-field${invalid ? ' form-field--invalid' : ''}`}>
        <label className="form-field__label" htmlFor={fieldId(name)}>
          {label}
          {required && (
            <>
              {' '}
              <span aria-hidden="true">*</span>
              <span className="visually-hidden">(pakollinen)</span>
            </>
          )}
        </label>
        <input
          id={fieldId(name)}
          className="form-field__input"
          type={type}
          name={name}
          value={values[name]}
          onChange={setField(name)}
          onFocus={warmRecaptcha}
          required={required}
          disabled={sending}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId(name) : hint ? `${fieldId(name)}-hint` : undefined}
          ref={(node) => {
            fieldRefs.current[name] = node
          }}
          {...rest}
        />
        {hint && !invalid && (
          <span className="form-field__hint" id={`${fieldId(name)}-hint`}>
            {hint}
          </span>
        )}
        {invalid && (
          <span className="form-field__error" id={errorId(name)}>
            {errors[name]}
          </span>
        )}
      </p>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {field({
          name: 'name',
          label: 'Nimi',
          required: true,
          autoComplete: 'name',
          maxLength: contactForm.limits.name,
        })}
        {field({
          name: 'email',
          label: 'Sähköposti',
          type: 'email',
          required: true,
          autoComplete: 'email',
          inputMode: 'email',
          maxLength: contactForm.limits.email,
        })}
        {field({
          name: 'phone',
          label: 'Puhelin',
          type: 'tel',
          autoComplete: 'tel',
          inputMode: 'tel',
          hint: 'Vapaaehtoinen',
          maxLength: contactForm.limits.phone,
        })}
        {field({
          name: 'schedule',
          label: 'Toivottu ajankohta',
          hint: 'Esimerkiksi “ensi viikolla” tai “ma 12.10.”',
          maxLength: contactForm.limits.schedule,
        })}
        {field({
          name: 'pickup',
          label: 'Noutopaikka',
          autoComplete: 'off',
          maxLength: contactForm.limits.place,
        })}
        {field({
          name: 'dropoff',
          label: 'Toimitusosoite',
          autoComplete: 'off',
          maxLength: contactForm.limits.place,
        })}
      </div>

      <p
        className={`form-field form-field--wide${errors.message ? ' form-field--invalid' : ''}`}
      >
        <label className="form-field__label" htmlFor={fieldId('message')}>
          Mitä on kuljetettavana? <span aria-hidden="true">*</span>
          <span className="visually-hidden">(pakollinen)</span>
        </label>
        <textarea
          id={fieldId('message')}
          className="form-field__input form-field__input--textarea"
          name="message"
          rows={6}
          value={values.message}
          onChange={setField('message')}
          onFocus={warmRecaptcha}
          required
          disabled={sending}
          maxLength={contactForm.limits.message}
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={
            errors.message ? errorId('message') : `${fieldId('message')}-hint`
          }
          ref={(node) => {
            fieldRefs.current.message = node
          }}
        />
        {errors.message ? (
          <span className="form-field__error" id={errorId('message')}>
            {errors.message}
          </span>
        ) : (
          <span className="form-field__hint" id={`${fieldId('message')}-hint`}>
            Kerro tavaran laatu ja suunnilleen koko sekä muut kuljetukseen
            vaikuttavat asiat.
          </span>
        )}
      </p>

      <p className="form-check">
        <input
          id={fieldId('loadingHelp')}
          className="form-check__input"
          type="checkbox"
          name="loadingHelp"
          checked={values.loadingHelp}
          onChange={setField('loadingHelp')}
          onFocus={warmRecaptcha}
          disabled={sending}
        />
        <label className="form-check__label" htmlFor={fieldId('loadingHelp')}>
          Tarvitsen apua lastaamisessa
        </label>
      </p>

      {/* Hunajapurkki. Piilotettu käyttäjiltä ja avustavilta tekniikoilta;
          jos kenttä on täytetty, viesti on robotin lähettämä. */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={fieldId('company')}>Älä täytä tätä kenttää</label>
        <input
          id={fieldId('company')}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={setField('company')}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn--primary btn--lg" type="submit" disabled={sending}>
          <span className="btn__label">{sending ? 'Lähetetään…' : 'Lähetä viesti'}</span>
          <span className="btn__arrow" aria-hidden="true">
            <svg viewBox="0 0 20 12" width="20" height="12" fill="none" focusable="false">
              <path d="M0 6h17M12.5 1 18 6l-5.5 5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </button>

        <p
          className={`form-status form-status--${status}`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </div>

      {status === 'error' && (
        <p className="form-note form-note--error">
          Voit myös ottaa yhteyttä suoraan
          {hasPhone && (
            <>
              {' '}
              puhelimitse{' '}
              <a href={`tel:${business.contact.phone.href}`}>
                {business.contact.phone.display}
              </a>
            </>
          )}
          {hasPhone && hasEmail ? ' tai' : ''}
          {hasEmail && (
            <>
              {' '}
              sähköpostilla{' '}
              <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a>
            </>
          )}
          .
        </p>
      )}

      <p className="form-legal">
        Lomakkeella annettuja tietoja käytetään vain yhteydenoton hoitamiseen –
        ks. <Link to="/tietosuoja">tietosuojaseloste</Link>.
        {contactForm.recaptcha.enabled && (
          <>
            {' '}
            Lomake on suojattu Googlen reCAPTCHA v3 -palvelulla, johon sovelletaan
            Googlen{' '}
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
            .
          </>
        )}
      </p>
    </form>
  )
}
