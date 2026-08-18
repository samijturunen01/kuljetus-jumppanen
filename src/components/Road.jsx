import './Road.css'

/**
 * Tienpinta liikkuvine keskiviivoineen.
 * Puhtaasti koristeellinen elementti, siksi aria-hidden.
 */
export default function Road({ slim = false, className = '' }) {
  return (
    <div className={`road ${slim ? 'road--slim' : ''} ${className}`.trim()} aria-hidden="true">
      <div className="road__markings" />
    </div>
  )
}
