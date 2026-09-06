/**
 * Sivuston tekniset asetukset ja hakukoneoptimoinnin oletukset.
 * Vaihda `siteUrl` julkaisun yhteydessä lopulliseen osoitteeseen.
 */
import { business } from './business.js'

export const site = {
  /** Ilman kauttaviivaa lopussa. Käytetään canonical- ja OG-osoitteissa.
      Samat osoitteet ovat myös tiedostoissa index.html, public/sitemap.xml
      ja public/robots.txt – päivitä ne yhtä aikaa. */
  siteUrl: 'https://kuljetusjumppanen.fi',
  locale: 'fi_FI',
  lang: 'fi',
  titleTemplate: `%s | ${business.name}`,
  defaultTitle: `${business.name} – tavarankuljetus Joensuusta`,
  defaultDescription:
    'Kuljetus Jumppanen Oy on joensuulainen kuljetusyritys. Hoidamme tavarankuljetukset lava-autolla. Kysy kuljetuksesta tai pyydä tarjous.',
  ogImage: '/og-kuljetus-jumppanen.png',
  ogImageAlt: `${business.name} – tavarankuljetus Joensuusta`,
  /** Yrityksen tunnus rakenteista dataa varten (public-kansiossa, jotta
      osoite on absoluuttinen ja pysyvä). */
  logo: '/logo-kuljetus-jumppanen.png',
}

/** Muodostaa absoluuttisen osoitteen canonical/OG-käyttöön. */
export function absoluteUrl(path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${site.siteUrl}${clean === '/' ? '/' : clean.replace(/\/$/, '')}`
}

export default site
