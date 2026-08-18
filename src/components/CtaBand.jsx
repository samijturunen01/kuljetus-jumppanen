import { primaryContactAction } from '../config/business.js'
import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import './CtaBand.css'

/**
 * Toistuva yhteydenottokehotus sivujen loppuun.
 * Painike vaihtuu suoraksi soitto- tai sähköpostilinkiksi automaattisesti,
 * kun yhteystiedot lisätään tiedostoon src/config/business.js.
 */
export default function CtaBand({
  title = 'Onko sinulla kuljetettavaa?',
  text = 'Kerro lyhyesti mitä, mistä ja minne – katsotaan yhdessä miten kuljetus hoituu.',
}) {
  const cta = primaryContactAction()

  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div className="cta-band__rule" aria-hidden="true" />
      <Reveal className="container cta-band__inner">
        <div>
          <h2 id="cta-band-title" className="cta-band__title">
            {title}
          </h2>
          <p className="cta-band__text">{text}</p>
        </div>
        <div className="btn-row">
          {cta.type === 'page' ? (
            <Button to={cta.href} variant="primary" size="lg">
              {cta.label}
            </Button>
          ) : (
            <Button href={cta.href} variant="primary" size="lg">
              {cta.label}
            </Button>
          )}
        </div>
      </Reveal>
    </section>
  )
}
