/**
 * Schema.org-rakenteinen data.
 *
 * Mukaan otetaan vain varmistetut tiedot (PRH/YTJ, y-tunnus 3634642-5).
 * Puhelin, sähköposti ja toimialue lisätään automaattisesti sitten,
 * kun ne täytetään tiedostoon src/config/business.js.
 *
 * Tyyppi: Organization. LocalBusiness ei ole tässä vaiheessa oikea tyyppi,
 * koska yrityksellä ei ole julkista toimipistettä eikä aukioloaikoja.
 */
import { business } from '../config/business.js'
import { site, absoluteUrl } from '../config/site.js'

export function organizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.siteUrl}/#organization`,
    name: business.name,
    legalName: business.name,
    url: site.siteUrl,
    logo: `${site.siteUrl}${site.logo}`,
    image: `${site.siteUrl}${site.ogImage}`,
    description: site.defaultDescription,
    foundingDate: business.foundingDate,
    vatID: business.vatId,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Y-tunnus',
      value: business.businessId,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.countryCode,
    },
    founder: {
      '@type': 'Person',
      name: business.owner.name,
    },
  }

  if (business.contact.phone?.href) {
    data.telephone = business.contact.phone.href
  }
  if (business.contact.email) {
    data.email = business.contact.email
  }
  if (business.social.length > 0) {
    data.sameAs = business.social.map((s) => s.url)
  }

  return data
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.siteUrl}/#website`,
    url: site.siteUrl,
    name: business.name,
    inLanguage: 'fi-FI',
    publisher: { '@id': `${site.siteUrl}/#organization` },
  }
}

/** Murupolku rakenteisena datana alasivuille. */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.path),
    })),
  }
}
