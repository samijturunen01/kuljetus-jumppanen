import { business, hasDirectContact, hasEmail, hasPhone } from '../config/business.js'
import './ContactChannels.css'

/**
 * Yhteydenottokanavat.
 *
 * Puhelin ja sähköposti näytetään heti kun ne on lisätty tiedostoon
 * src/config/business.js. Niin kauan kuin niitä ei ole, sivustolla ei
 * näytetä keksittyjä tai paikkamerkkinä toimivia yhteystietoja.
 */
export default function ContactChannels({ tone = 'light' }) {
  if (!hasDirectContact) {
    return (
      <div className={`channels channels--pending channels--${tone}`}>
        <p className="channels__pending-text">
          Yrityksen puhelinnumero ja sähköpostiosoite julkaistaan tällä sivulla heti,
          kun ne ovat käytettävissä. Siihen asti yrityksen tavoittaa alla olevasta
          postiosoitteesta.
        </p>
      </div>
    )
  }

  return (
    <ul className={`channels channels--${tone}`}>
      {hasPhone && (
        <li className="channels__item">
          <span className="channels__label">Puhelin</span>
          <a className="channels__value" href={`tel:${business.contact.phone.href}`}>
            {business.contact.phone.display}
          </a>
        </li>
      )}
      {hasEmail && (
        <li className="channels__item">
          <span className="channels__label">Sähköposti</span>
          <a className="channels__value" href={`mailto:${business.contact.email}`}>
            {business.contact.email}
          </a>
        </li>
      )}
    </ul>
  )
}
