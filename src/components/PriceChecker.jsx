import { useState } from 'react'
import { pricing } from '../data/pricing.js'
import { resolvePrice } from '../lib/priceCheck.js'
import './PriceChecker.css'

const { checker, distances, weightClasses } = pricing

/**
 * Yksi valintapainike. Toteutettu natiivina radiona, jotta näppäimistö- ja
 * ruudunlukijakäyttö toimii ilman omaa näppäinlogiikkaa. Itse radio on
 * piilotettu ja valinta piirretään labelin sisään.
 */
function Option({ name, value, checked, onChange, title, hint }) {
  return (
    <label className="pc-option">
      <input
        type="radio"
        className="pc-option__input"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span className="pc-option__face">
        <span className="pc-option__title">{title}</span>
        {hint ? <span className="pc-option__hint">{hint}</span> : null}
      </span>
    </label>
  )
}

/**
 * "Tarkista kuljetuksen hinta" – matka ja painoluokka valitaan painikkeista,
 * ja tulos perusteluineen lasketaan säännöistä (src/lib/priceCheck.js).
 */
export default function PriceChecker() {
  const [distanceId, setDistanceId] = useState(null)
  const [weightTier, setWeightTier] = useState(null)

  const result = resolvePrice(distanceId, weightTier)
  const hasSelection = distanceId !== null || weightTier !== null

  return (
    <div className="price-checker">
      <div className="price-checker__intro">
        <h2 className="price-checker__title" id="price-checker-title">
          {checker.title}
        </h2>
        <p className="price-checker__lead">{checker.lead}</p>
      </div>

      <div className="price-checker__body">
        <div className="price-checker__choices">
          {/* --- 1. Matka ---------------------------------------------------- */}
          <fieldset className="pc-group">
            <legend className="pc-group__legend">{checker.distanceLegend}</legend>
            <div className="pc-options">
              {distances.map((distance) => (
                <Option
                  key={distance.id}
                  name="pc-distance"
                  value={distance.id}
                  checked={distanceId === distance.id}
                  onChange={setDistanceId}
                  title={distance.option}
                />
              ))}
            </div>
          </fieldset>

          {/* --- 2. Kuorman paino -------------------------------------------- */}
          <fieldset className="pc-group">
            <legend className="pc-group__legend">{checker.weightLegend}</legend>
            <div className="pc-options pc-options--weight">
              {weightClasses.map((weight) => (
                <Option
                  key={weight.id}
                  name="pc-weight"
                  value={weight.tier}
                  checked={weightTier === weight.tier}
                  onChange={setWeightTier}
                  title={weight.name}
                  hint={weight.option}
                />
              ))}
            </div>
          </fieldset>

          {hasSelection ? (
            <button
              type="button"
              className="pc-reset"
              onClick={() => {
                setDistanceId(null)
                setWeightTier(null)
              }}
            >
              {checker.reset}
            </button>
          ) : null}
        </div>

        {/* --- Tulos ------------------------------------------------------- */}
        <div className="pc-result" aria-live="polite">
          {result ? (
            <>
              <p className="pc-result__label">{checker.resultLabel}</p>
              <p className={`pc-result__price ${result.from ? 'pc-result__price--from' : ''}`}>
                {result.price}
              </p>
              <p className="pc-result__vat">{checker.vat}</p>
              <p className="pc-result__explanation">{result.explanation}</p>
            </>
          ) : (
            <>
              <p className="pc-result__label">{checker.resultLabel}</p>
              <p className="pc-result__placeholder">{checker.placeholder}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
