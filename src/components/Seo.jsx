import { useEffect } from 'react'
import { site, absoluteUrl } from '../config/site.js'

/**
 * Kevyt hakukoneoptimoinnin apukomponentti.
 *
 * Hoitaa sivukohtaisen otsikon, kuvauksen, canonical-osoitteen,
 * Open Graph- ja Twitter-tiedot sekä valinnaisen rakenteisen datan
 * ilman ulkoisia riippuvuuksia.
 */

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description = site.defaultDescription,
  path = '/',
  noindex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? site.titleTemplate.replace('%s', title) : site.defaultTitle
  const canonical = absoluteUrl(path)
  const image = `${site.siteUrl}${site.ogImage}`

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = site.lang

    upsertMeta('name', 'description', description)
    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', site.defaultTitle)
    upsertMeta('property', 'og:locale', site.locale)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:alt', site.ogImageAlt)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    // Hakukoneiden indeksointi (esim. 404-sivu jätetään indeksoimatta)
    let robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, follow')
    } else if (robots) {
      robots.remove()
    }
  }, [fullTitle, description, canonical, image, noindex])

  useEffect(() => {
    if (!jsonLd) return undefined

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'page'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => script.remove()
  }, [jsonLd])

  return null
}
