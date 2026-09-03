import { pricing } from '../data/pricing.js'

/**
 * Kuljetushinnan laskenta "Tarkista kuljetuksen hinta" -osiolle.
 *
 * Yksi sääntö kattaa kaikki matka- ja painoyhdistelmät:
 *   veloitettava painoluokka = max(valittu painoluokka, matkan vähimmäisluokka)
 *
 * Poikkeus on yli 50 km, joka hinnoitellaan kilometreittäin (1,00 €/km
 * meno + paluu). Sille näytetään vain alkaen-hinta, koska lopullinen hinta
 * riippuu ajetusta kokonaismatkasta.
 *
 * Hinnat ja tekstit tulevat tiedostosta src/data/pricing.js.
 */

const { distances, weightClasses } = pricing

export function findDistance(distanceId) {
  return distances.find((d) => d.id === distanceId) ?? null
}

export function findWeightClass(weightId) {
  return weightClasses.find((w) => w.tier === weightId || w.id === weightId) ?? null
}

function classForTier(tier) {
  return weightClasses.find((w) => w.tier === tier) ?? null
}

/** Muotoilee kokonaiseurot suomalaisittain: 55 → "55 €". */
export function formatEuro(amount) {
  return `${amount} €`
}

/**
 * Palauttaa hinnan ja suomenkielisen perustelun valitulle yhdistelmälle.
 * Jos jompikumpi valinta puuttuu, palautetaan null.
 *
 * @returns {{price: string, from: boolean, explanation: string, tier: number|null} | null}
 */
export function resolvePrice(distanceId, weightId) {
  const distance = findDistance(distanceId)
  const weight = findWeightClass(weightId)
  if (!distance || !weight) return null

  // --- Yli 50 km: kilometrihinnoittelu, vain alkaen-hinta ------------------
  if (distance.perKm) {
    return {
      price: `Alkaen ${formatEuro(distance.fromPrice)}`,
      from: true,
      tier: null,
      explanation: `Yli 50 km kuljetukset hinnoitellaan ${distance.value} meno + paluu. Minimihinta on ${formatEuro(distance.fromPrice)}. Lopullinen hinta määräytyy ajetun kokonaismatkan mukaan.`,
    }
  }

  // --- Veloitettava painoluokka: valittu tai matkan vähimmäisluokka -------
  const chargedTier = Math.max(weight.tier, distance.minTier)
  const charged = classForTier(chargedTier)
  const price = formatEuro(charged.price)

  // --- Perustelu sen mukaan, kumpi sääntö ratkaisi hinnan ------------------
  let explanation
  if (distance.minTier <= 1) {
    // Alle 8 km: hinta tulee suoraan kuorman painoluokasta.
    explanation = `Hinta on ${price}. Alle 8 km kuljetuksissa hinta määräytyy kuorman painoluokan mukaan.`
  } else if (weight.tier > distance.minTier) {
    // Kuorman paino on matkan vähimmäisluokkaa korkeampi.
    explanation = `Hinta on ${price}. Kuorman paino kuuluu painoluokkaan ${weight.tier}, joka on korkeampi kuin matkan vähimmäispainoluokka.`
  } else {
    // Matkan vähimmäispainoluokka ratkaisee hinnan.
    explanation = `Hinta on ${price}. Matkalla ${distance.option} käytetään vähintään painoluokan ${distance.minTier} hintaa.`
  }

  return { price, from: false, tier: chargedTier, explanation }
}

export default resolvePrice
