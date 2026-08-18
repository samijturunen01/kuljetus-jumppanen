import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Vie sivun alkuun reitin vaihtuessa ja siirtää kohdistuksen
 * pääsisältöön, jotta ruudunlukija ilmoittaa uuden sivun.
 */
export default function ScrollToTop({ mainRef }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'instant' })
    mainRef?.current?.focus({ preventScroll: true })
  }, [pathname, mainRef])

  return null
}
