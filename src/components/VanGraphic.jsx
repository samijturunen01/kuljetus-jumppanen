import { useId } from 'react'
import './VanGraphic.css'

/**
 * Yrityksen tunnuksen auto piirroskuvana.
 *
 * Muoto on piirretty suoraan logon autosta: kulmikas tavaratila, jonka
 * takareunasta lähtevät vauhtiviivat, kallistetut pystyreunat, erillinen
 * ohjaamo vinolla tuulilasilla sekä renkaat, joissa on paksu rengas ja
 * avoin keskiö. Kori on tunnuksessa umpimusta – tummalla taustalla sama
 * auto piirtyy vaalealla (currentColor), jolloin siluetti säilyy.
 *
 * Tämä on tarkoituksellisesti piirroskuva, ei valokuva: se kuvaa toimintaa
 * antamatta ymmärtää, että kyseessä olisi kuva yrityksen omasta autosta.
 * Kun oikeita valokuvia saadaan, ne lisätään tiedostoon src/data/media.js.
 */
export default function VanGraphic({ className = '' }) {
  /* Yksilölliset id:t: sama grafiikka voi esiintyä sivulla useasti.
     useId palauttaa merkkejä, jotka eivät kelpaa url(#…)-viittaukseen,
     joten muut kuin kirjaimet ja numerot karsitaan pois. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const cutId = `van-cut-${uid}`
  const arcId = `van-arc-${uid}`

  return (
    <svg
      className={`van ${className}`}
      viewBox="0 0 640 260"
      fill="none"
      role="img"
      aria-label="Piirroskuva pakettiautosta"
      focusable="false"
    >
      <defs>
        {/* Kaari, jota pitkin KULJETUS-teksti kulkee – kuten tunnuksessa */}
        <path id={arcId} d="M195.7 112.6A759 759 0 0 1 381.4 112.6" />

        {/* Korista poistettavat kohdat. Valkoinen jää näkyviin, musta leikkautuu
            pois – näin ikkunasta, vauhtiraoista ja renkaan ympäryksestä tulee
            aitoja aukkoja niin kuin tunnuksessa. */}
        <mask id={cutId} maskUnits="userSpaceOnUse" x="-100" y="-50" width="840" height="400">
          <rect x="-100" y="-50" width="840" height="400" fill="#fff" />

          {/* Vauhtiviivojen välit */}
          <g stroke="#000" strokeWidth="20.5" strokeLinecap="round">
            <path d="M-40 66.2H172" />
            <path d="M-40 107.1H163.3" />
            <path d="M-40 148.1H154.6" />
          </g>

          {/* Tuulilasi ja ohjaamon sivuikkuna yhtenä ikkunana */}
          <path
            d="M431.9 79.8H460.4L475.9 116.5H424.2Z"
            fill="#000"
            stroke="#000"
            strokeWidth="13.4"
            strokeLinejoin="round"
          />

          {/* Renkaiden ympärille jäävä rako */}
          <circle cx="183.4" cy="203" r="31.2" fill="#000" />
          <circle cx="446.6" cy="203" r="31.2" fill="#000" />

          {/* Tavaratilan kylkiteksti */}
          <text className="van__wordmark" fill="#000">
            <textPath href={`#${arcId}`} textLength="186" lengthAdjust="spacing">
              KULJETUS
            </textPath>
          </text>
        </mask>
      </defs>

      <g className="van__body" mask={`url(#${cutId})`}>
        {/* Tavaratila: kallistettu suorakaide, pyöristetyt kulmat */}
        <path className="van__panel" d="M164.3 34H407.5L374.1 192H130.9Z" />

        {/* Ohjaamo: matalampi kuin kori, vino tuulilasilinja ja pyöreä keula */}
        <path
          className="van__panel"
          d="M425 70.7H466.9L497.1 120.4A46.5 46.5 0 0 1 502.6 152.7L494.6 188.7H400Z"
        />

        {/* Korin takareunasta lähtevät vauhtiviivat */}
        <path
          className="van__streaks"
          d="M79.2 45.7H180M44.1 86.7H180M79.2 127.6H180M19.7 168.6H180"
        />
      </g>

      {/* Irralliset vauhtiviivat – nämä liikkuvat */}
      <g className="van__speed" opacity="0.9">
        <path className="van__streaks" d="M24.4 45.7H43.4M10 127.6H29.1" />
      </g>

      {/* Renkaat: paksu rengas, avoin keskiö */}
      <g className="van__wheels">
        <circle className="van__tyre" cx="183.4" cy="203" r="20.2" />
        <circle className="van__tyre" cx="446.6" cy="203" r="20.2" />
      </g>
    </svg>
  )
}
