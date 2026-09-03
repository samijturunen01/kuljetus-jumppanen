/**
 * Kuljetushinnasto.
 *
 * Lähde: yrityksen virallinen hinnasto (Kuljetushinnasto, Kuljetus Jumppanen Oy).
 * Kaikki hinnat ovat ilman arvonlisäveroa (ALV 0). Kun hinnat muuttuvat,
 * päivitä vain tämä tiedosto – Hinnasto-sivu ja hintalaskuri rakentuvat
 * näistä tiedoista.
 *
 * Kentät:
 *   weightClasses – painoluokat painon mukaan (myös hintakorttien lähde)
 *   distances     – matkaluokat ja niiden vähimmäispainoluokka
 *   hourly        – tuntiveloitus, joka on kuljetushinnoista erillinen työveloitus
 *   note          – painon huomiointi kantakaupungin ulkopuolella
 *   vatNotice     – huomautus arvonlisäverosta
 *   checker       – "Tarkista kuljetuksen hinta" -osion tekstit
 *
 * Hinnoittelun sääntö on yksi ja sama kaikille yhdistelmille: matkalla on
 * vähimmäispainoluokka (minTier), ja veloitettava painoluokka on suurempi
 * valitusta painoluokasta ja matkan vähimmäisluokasta. Yli 50 km on
 * kilometriperusteinen poikkeus, jolle näytetään vain alkaen-hinta.
 * Laskenta: src/lib/priceCheck.js
 */
export const pricing = {
  title: 'Kuljetushinnasto',
  intro: 'Alle 8 km kuljetuksissa hinta määräytyy kuorman painoluokan mukaan. Pidemmillä matkoilla hinta määräytyy matkan vähimmäispainoluokan mukaan.',

  areasTitle: 'Painoluokat',
  areasNote: 'Joensuun kantakaupunki, alle 8 km kaupalta.',

  /* Painoluokat. tier ja price ovat laskennan lähtöarvot, muut ovat tekstejä. */
  weightClasses: [
    {
      id: 'painoluokka-1',
      tier: 1,
      name: 'Painoluokka 1',
      weight: 'Paino alle 200 kg',
      option: 'Alle 200 kg',
      price: 30,
    },
    {
      id: 'painoluokka-2',
      tier: 2,
      name: 'Painoluokka 2',
      weight: 'Paino 201–500 kg',
      option: '201–500 kg',
      price: 40,
    },
    {
      id: 'painoluokka-3',
      tier: 3,
      name: 'Painoluokka 3',
      weight: 'Paino 501–1000 kg',
      option: '501–1000 kg',
      price: 55,
    },
    {
      id: 'painoluokka-4',
      tier: 4,
      name: 'Painoluokka 4',
      weight: 'Paino yli 1000 kg',
      option: 'Yli 1000 kg',
      price: 70,
    },
  ],

  /* Matkaluokat. minTier = matkan vähimmäispainoluokka.
     perKm-matkalla (yli 50 km) minTier on null ja hinta on alkaen-hinta. */
  distances: [
    {
      id: 'alle-8',
      option: 'Alle 8 km',
      label: 'Matka alle 8 km',
      minTier: 1,
      rule: 'hinta määräytyy',
      value: 'Kuorman painoluokan mukaan',
    },
    {
      id: '8-15',
      option: '8–15 km',
      label: 'Matka 8–15 km',
      minTier: 2,
      rule: 'aina vähintään',
      value: 'Painoluokka 2',
    },
    {
      id: '16-30',
      option: '16–30 km',
      label: 'Matka 16–30 km',
      minTier: 3,
      rule: 'aina vähintään',
      value: 'Painoluokka 3',
    },
    {
      id: '31-50',
      option: '31–50 km',
      label: 'Matka 31–50 km',
      minTier: 4,
      rule: 'aina vähintään',
      value: 'Painoluokka 4',
    },
    {
      id: 'yli-50',
      option: 'Yli 50 km',
      label: 'Matka yli 50 km',
      minTier: null,
      perKm: true,
      fromPrice: 100,
      rule: 'meno + paluu',
      value: '1,00 €/km',
    },
  ],

  hourly: {
    eyebrow: 'Erillinen työveloitus',
    label: 'Tuntiveloitus',
    value: '50 €/h',
    note: 'Tuntiveloitusta käytetään lastaus- ja purkutyössä.',
  },

  note: 'Paino on huomioitava myös kun hinnoitellaan kantakaupungin ulkopuolelle menevät kuormat.',

  vatNotice: 'Huom! Kaikki nämä hinnat ALV 0',

  checker: {
    title: 'Tarkista kuljetuksen hinta',
    lead: 'Valitse matka ja kuorman paino, niin näet kuljetuksen hinnan ja sen, miten hinta muodostuu.',
    distanceLegend: '1. Valitse matka',
    weightLegend: '2. Valitse kuorman paino',
    resultLabel: 'Arvioitu hinta',
    vat: 'ALV 0',
    placeholder: 'Tee molemmat valinnat, niin hinta näkyy tässä.',
    reset: 'Tyhjennä valinnat',
  },
}

export default pricing

/**
 * Etusivun hintanosto. Tiivistelmä, joka kertoo hinnoittelun pääperiaatteen
 * toistamatta koko hinnastoa – luvut johdetaan yllä olevasta hinnastosta,
 * joten ne pysyvät ajan tasalla ilman erillistä ylläpitoa.
 */
const cheapest = Math.min(...pricing.weightClasses.map((weight) => weight.price))
const firstWeight = pricing.weightClasses[0]
const lastWeight = pricing.weightClasses[pricing.weightClasses.length - 1]
const firstDistance = pricing.distances[0]
const lastDistance = pricing.distances[pricing.distances.length - 1]

export const pricingSummary = {
  eyebrow: 'Hinnasto',
  title: 'Hinnat selkeästi',
  lead: 'Alle 8 km kuljetuksissa hinta määräytyy kuorman painon mukaan. Pidemmillä matkoilla kilometriluokka määrittää vähimmäishinnan.',

  highlights: [
    {
      id: 'alkaen',
      label: 'Kuljetukset alk.',
      figure: String(cheapest),
      unit: '€',
      text: 'Alle 8 km kuljetuksissa hinta määräytyy painoluokan mukaan.',
    },
    {
      id: 'painoluokat',
      label: 'Painon mukaan',
      figure: String(pricing.weightClasses.length),
      unit: 'painoluokkaa',
      text: `${firstWeight.option} – ${lastWeight.option.toLowerCase()}.`,
    },
    {
      id: 'kilometriluokat',
      label: 'Matkan mukaan',
      figure: String(pricing.distances.length),
      unit: 'kilometriluokkaa',
      text: `${firstDistance.option} – ${lastDistance.option.toLowerCase()}.`,
    },
  ],

  vatNote: 'Kaikki hinnat ALV 0.',
  ctaLabel: 'Katso koko hinnasto',
  linkLabel: 'Tarkista kuljetuksen hinta hinnastosivulla',
}
