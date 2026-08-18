import { media } from '../data/media.js'
import './Media.css'

/**
 * Kuvapaikka, joka näyttää valokuvan jos sellainen on määritelty
 * tiedostossa src/data/media.js – muutoin sivuston omaa grafiikkaa.
 *
 * Näin oikeat kuvat Roopen pakettiautosta voidaan lisätä myöhemmin
 * koskematta yhteenkään sivukomponenttiin.
 *
 * @param {{ name: keyof typeof media, fallback: React.ReactNode,
 *           priority?: boolean, className?: string }} props
 */
export default function Media({ name, fallback, priority = false, className = '' }) {
  const item = media[name]

  if (!item?.src) {
    return <div className={`media media--graphic ${className}`}>{fallback}</div>
  }

  return (
    <figure className={`media ${className}`}>
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    </figure>
  )
}
