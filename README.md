# Kuljetus Jumppanen Oy – verkkosivusto

Joensuulaisen tavarankuljetusyrityksen verkkosivusto. React + Vite, ei ulkoisia
riippuvuuksia reitityksen lisäksi, ei seurantaa eikä evästeitä.

## Käynnistys

```bash
npm install
npm run dev      # kehityspalvelin
npm run build    # tuotantoversio kansioon dist/
npm run preview  # esikatselu tuotantoversiosta
```

---

## Tärkeintä: mistä yritystiedot päivitetään

**Kaikki yritystiedot ovat yhdessä tiedostossa:**

### `src/config/business.js`

Kun seuraavat tiedot saadaan, ne lisätään **vain tähän tiedostoon** – koko
sivusto (painikkeet, alatunniste, yhteystietosivu, rakenteinen data) päivittyy
automaattisesti.

#### Puhelinnumero ja sähköposti

```js
contact: {
  phone: { display: '040 123 4567', href: '+358401234567' },
  email: 'roope@kuljetusjumppanen.fi',
  formEnabled: false,
},
```

Tämän jälkeen tapahtuu automaattisesti:

- navigaation ja etusivun **Kysy kuljetuksesta** -painike muuttuu suoraksi
  `tel:`- tai `mailto:`-linkiksi
- alatunnisteeseen ilmestyvät puhelin ja sähköposti
- yhteystietosivun "julkaistaan pian" -huomautus katoaa ja tilalle tulevat
  varsinaiset yhteystiedot
- Schema.org-rakenteiseen dataan lisätään `telephone` ja `email`

**Ennen kuin tiedot on lisätty, sivustolla ei näytetä minkäänlaisia
paikkamerkkejä tai keksittyjä yhteystietoja.**

#### Some-tilit

```js
social: [
  { name: 'Facebook', url: 'https://www.facebook.com/...' },
],
```

Tyhjä lista tarkoittaa, ettei some-osiota näytetä lainkaan. Lisää vain
varmistetut, viralliset tilit.

### `src/data/services.js`

Kuljetuspalvelut. Lisää uusi objekti listaan, niin palvelu ilmestyy sekä
etusivulle että Kuljetuspalvelut-sivulle. Palvelut on tarkoituksella kuvattu
yleisellä tasolla, koska tarkkoja palvelutyyppejä ja toimialuetta ei ole vielä
vahvistettu.

### `src/data/media.js`

Valokuvat. Sivustolla ei tällä hetkellä ole yhtään valokuvaa – kaikki
visuaalisuus on sivuston omaa SVG-grafiikkaa, jottei mikään kuva anna
virheellistä kuvaa kalustosta.

Kun oikeat kuvat Roopen pakettiautosta saadaan:

1. Lisää tiedostot kansioon `src/assets/` (mieluiten `.webp` tai `.avif`)
2. Tuo ne `media.js`-tiedostoon ja täytä `src`, `alt`, `width`, `height`
3. Sivusto vaihtaa grafiikan valokuvaan automaattisesti – sivukomponentteihin
   ei tarvitse koskea

### `src/config/site.js`

Verkkotunnus (`siteUrl`), sivuston oletusotsikko ja -kuvaus. **Muista vaihtaa
`siteUrl` julkaisun yhteydessä** – sitä käytetään canonical-osoitteissa ja
Open Graph -tiedoissa.

Samat osoitteet ovat myös tiedostoissa `public/sitemap.xml`, `public/robots.txt`
ja `index.html` (staattinen rakenteinen data). Päivitä ne yhtä aikaa.

### Tunnus (logo)

Alkuperäinen logotiedosto on projektin juuressa: **`Jumppanen oy logo 5.png`**.
Siitä on rajattu ja skaalattu kaikki sivuston käyttämät versiot:

| Tiedosto | Käyttö |
| --- | --- |
| `src/assets/logo-kuljetus-jumppanen-light.png` | vaalea versio tummalle taustalle – ylä- ja alatunniste |
| `src/assets/logo-kuljetus-jumppanen.png` | alkuperäinen musta–keltainen versio vaalealle taustalle |
| `public/logo-kuljetus-jumppanen.png` | Schema.org-rakenteinen data (`logo`) |
| `public/favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | selainkuvakkeet: keltainen laatta ja tunnuksen pakettiauto |
| `public/og-kuljetus-jumppanen.png` | jakokuva sosiaaliseen mediaan |

Vaaleassa versiossa on vaihdettu vain musta ja valkoinen keskenään – tunnuksen
keltainen on täsmälleen sama kuin alkuperäisessä (`--c-signal`, `#ffc233`).

Tunnus näytetään `src/components/Logo.jsx`-komponentilla:

```jsx
<Logo className="brand__logo" />            // vaalea, tummalle taustalle
<Logo tone="dark" className="jokin-luokka" /> // vaalealle taustalle
```

Koko tulee CSS-muuttujasta `--logo-h`, joten se voi vaihdella näytön leveyden
mukaan (ks. `Header.css`). Jos logo joskus vaihtuu, korvaa yllä olevat
kuvatiedostot – komponentteihin ei tarvitse koskea.

---

## Julkaisu GitHub Pagesiin

Repossa on valmis työnkulku `.github/workflows/deploy.yml`, joka rakentaa ja
julkaisee sivuston `main`-haaraan tehdyistä muutoksista. Ota Pages käyttöön
repon asetuksista: **Settings → Pages → Source: GitHub Actions**.

### Nykyinen kokoonpano: projektisivu

Sivusto julkaistaan osoitteessa
**https://samijturunen01.github.io/kuljetus-jumppanen/**, ja repo on
konfiguroitu sitä varten:

| Missä | Asetus |
| --- | --- |
| `.github/workflows/deploy.yml` | `VITE_BASE: /kuljetus-jumppanen/` |
| `public/404.html` | `pathSegmentsToKeep = 1` |
| `src/config/site.js` | `siteUrl` julkaisuosoitteeseen |
| `public/sitemap.xml`, `public/robots.txt` | samat osoitteet |
| `public/site.webmanifest` | `start_url`, `scope` ja kuvakkeet base-polulla |
| `index.html` | canonical, Open Graph ja rakenteinen data |

Reitityksen `basename` tulee automaattisesti Viten `BASE_URL`-arvosta
(`src/App.jsx`), joten sovelluskoodiin ei tarvitse koskea.

### Vaihto omaan verkkotunnukseen (esim. kuljetusjumppanen.fi)

1. Lisää `public/CNAME`, jossa on pelkkä verkkotunnus
2. Poista `VITE_BASE` työnkulusta (`deploy.yml`)
3. Palauta `public/404.html`:ssä `pathSegmentsToKeep` arvoon `0`
4. Palauta `public/site.webmanifest`:ssa `start_url`, `scope` ja kuvakepolut
   juureen (`/`)
5. Vaihda osoitteet yllä olevan taulukon muista tiedostoista

### Reititys ja sivun päivittäminen

GitHub Pages ei tunne yksisivusovelluksen reittejä, joten suora osoite
(esim. `/yritys`) päätyisi 404-sivulle. `public/404.html` tallentaa alkuperäisen
osoitteen ja ohjaa sovelluksen juureen, jossa `index.html` palauttaa osoitteen
ennen Reactin käynnistymistä. Sivun päivittäminen alasivulla toimii siis
normaalisti.

---

## Rakenne

```
public/            robots.txt, sitemap.xml, 404.html, kuvakkeet, OG-kuva
src/
  config/          business.js (yritystiedot), site.js (SEO-perusasetukset)
  data/            navigation.js, services.js, media.js
  components/      uudelleenkäytettävät osat (Header, Footer, Seo, Button, …)
  layouts/         SiteLayout.jsx
  pages/           Home, Services, Company, Contact, Privacy, NotFound
  lib/             structuredData.js (Schema.org)
  assets/fonts/    itse isännöidyt kirjasintiedostot (Archivo, Barlow, woff2)
  styles/          tokens.css (värit, typografia), fonts.css (@font-face),
                   global.css
```

### Typografia

Kirjasimet on valittu yrityksen tunnuksen mukaan:

| Rooli | Kirjasin | Missä |
| --- | --- | --- |
| `--font-display` | **Archivo** (muuttujakirjasin 400–900) | otsikot, painikkeet, navigaatio, versaalitarrat, numerot |
| `--font-sans` | **Barlow** (400/600/700) | leipäteksti, ingressit, listat, alatunnisteen linkit |

Archivon lihavat leikkaukset ovat kulmikkaita ja tiiviitä kuten tunnuksen
**JUMPPANEN**-sanamerkki; väljästi harvennetut versaalit toistavat auton kyljen
**KULJETUS**-tekstin. Barlow on samaa matalan kontrastin groteskiperhettä mutta
avoimempi, joten pidemmätkin kappaleet pysyvät luettavina.

Molemmat ovat SIL Open Font License 1.1 -lisenssillä; katso
`src/assets/fonts/LICENSE.md`. Uusia painoja lisätään pudottamalla `.woff2`
kansioon `src/assets/fonts/` ja lisäämällä `@font-face` tiedostoon
`src/styles/fonts.css`.

## Periaatteet, joita kannattaa noudattaa jatkossakin

- **Sivustolla esitetään vain varmistettuja tietoja.** Ei keksittyjä
  palvelukuvauksia, toimialueita, kokemusvuosia, asiakasmääriä tai arvosteluja.
- **Kalusto:** yrityksellä on yksi pakettiauto. Kuvituksen ja tekstien tulee
  kertoa pienestä, ketterästä kuljetusyrityksestä – ei kuorma-autokalustosta.
- **Ei seurantaa.** Sivustolla ei ole analytiikkaa, evästeitä eikä kolmansien
  osapuolten pyyntöjä. Myös kirjasimet tarjoillaan sivuston omalta palvelimelta
  (`src/assets/fonts/`, ei Google Fonts -CDN:ää), joten selain ei ota yhteyttä
  ulkopuolisiin palveluihin. Siksi sivustolla ei myöskään tarvita
  evästeilmoitusta. Jos seurantaa joskus lisätään, päivitä `src/pages/Privacy.jsx`.
  **Älä lisää kirjasimia CDN-linkkinä** – se rikkoisi tämän periaatteen.
- **Yhteydenottolomaketta ei ole toteutettu**, koska toimivaa vastaanottavaa
  taustajärjestelmää ei vielä ole. Sivustolla ei esitetä lomaketta, joka
  näyttäisi lähettävän viestin lähettämättä sitä oikeasti.
