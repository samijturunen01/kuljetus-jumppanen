import { useId } from 'react'
import './VehicleGraphic.css'

/**
 * Yrityksen lava-auto piirroskuvana.
 *
 * Muoto seuraa kaluston oikeaa autoa: yksittäisohjaamo jyrkällä tuulilasilla
 * ja lyhyellä keulalla, ohjaamon takana lavan etulaita ritilöineen, avoin
 * tasalava rungon päällä sekä renkaat, joissa on paksu rengas ja avoin
 * keskiö. Kori piirtyy yhtenäisenä siluettina (currentColor); ikkuna,
 * ritilä ja renkaiden ympärys leikataan maskilla aidoiksi aukoiksi.
 * Korin takana on kolme irrallista vauhtiviivaa, jotka liikkuvat vasemmalle;
 * niiden tyyli ja liike ovat samat kuin sivuston aiemmassa autografiikassa
 * (ks. VehicleGraphic.css).
 *
 * Tämä on tarkoituksellisesti piirroskuva, ei valokuva: se kuvaa toimintaa
 * antamatta ymmärtää, että kyseessä olisi kuva yrityksen omasta autosta.
 * Kun oikeita valokuvia otetaan käyttöön, ne lisätään tiedostoon
 * src/data/media.js.
 */
export default function VehicleGraphic({ className = '' }) {
  /* Yksilöllinen id: sama grafiikka voi esiintyä sivulla useasti.
     useId palauttaa merkkejä, jotka eivät kelpaa url(#…)-viittaukseen,
     joten muut kuin kirjaimet ja numerot karsitaan pois. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const cutId = `vehicle-cut-${uid}`

  return (
    <svg
      className={`vehicle ${className}`}
      viewBox="0 0 640 260"
      fill="none"
      role="img"
      aria-label="Piirroskuva lava-autosta"
      focusable="false"
    >
      <defs>
        {/* Korista poistettavat kohdat. Valkoinen jää näkyviin, musta leikkautuu
            pois – näin ikkunasta, ritilästä ja renkaan ympäryksestä tulee
            aitoja aukkoja. */}
        <mask id={cutId} maskUnits="userSpaceOnUse" x="-100" y="-50" width="840" height="400">
          <rect x="-100" y="-50" width="840" height="400" fill="#fff" />

          {/* Tuulilasi ja ohjaamon sivuikkuna yhtenä ikkunana */}
          <path
            d="M428 80H468L496 122H428Z"
            fill="#000"
            stroke="#000"
            strokeWidth="13.4"
            strokeLinejoin="round"
          />

          {/* Rako ohjaamon ja lavan etulaidan väliin sekä laidan ritilä */}
          <rect x="400" y="74" width="7" height="64" fill="#000" />
          <g fill="#000">
            <rect x="383" y="95" width="14" height="4" />
            <rect x="383" y="108" width="14" height="4" />
            <rect x="383" y="121" width="14" height="4" />
          </g>

          {/* Renkaiden ympärille jäävä rako */}
          <circle cx="196" cy="203" r="31.2" fill="#000" />
          <circle cx="466" cy="203" r="31.2" fill="#000" />
        </mask>
      </defs>

      <g className="vehicle__body" mask={`url(#${cutId})`}>
        {/* Ohjaamo: korkea yksittäisohjaamo, jyrkkä tuulilasi, lyhyt keula */}
        <path className="vehicle__panel" d="M414 185V68H472L510 126L526 130L532 150V185Z" />

        {/* Lavan etulaita ohjaamon takana */}
        <path className="vehicle__panel" d="M389 90V140H397V90Z" />

        {/* Tasalava ja sen alla kulkeva runko */}
        <path className="vehicle__bar" strokeWidth="14" d="M118 146H396" />
        <path className="vehicle__bar" strokeWidth="16" d="M124 166H404" />
      </g>

      {/* Vauhtiviivat: kolme irrallista viivaa, jotka liikkuvat vasemmalle */}
      <g className="vehicle__speed" opacity="0.9">
        <path className="vehicle__streaks" d="M64.4 116H83.4M57.2 157H76.2M50 198H69.1" />
      </g>

      {/* Renkaat: paksu rengas, avoin keskiö */}
      <g className="vehicle__wheels">
        <circle className="vehicle__tyre" cx="196" cy="203" r="20.2" />
        <circle className="vehicle__tyre" cx="466" cy="203" r="20.2" />
      </g>
    </svg>
  )
}
