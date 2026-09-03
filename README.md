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

Yritystiedot lisätään ja päivitetään **vain tähän tiedostoon** – koko sivusto
(painikkeet, alatunniste, yhteystietosivu, rakenteinen data) päivittyy
automaattisesti.

#### Puhelinnumero ja sähköposti

```js
contact: {
  phone: { display: '045 264 6870', href: '+358452646870' },
  email: 'jumppanenroope@gmail.com',
  formEnabled: true,
  ctaTarget: 'page',
},
```

Puhelin ja sähköposti näkyvät automaattisesti alatunnisteessa, yhteystietosivulla
(suorina soitto- ja sähköpostilinkkeinä) sekä Schema.org-rakenteisessa datassa.
Jos numero tai osoite vaihtuu, riittää että muutat sen tähän – sivukomponentteihin
ei tarvitse koskea. **Muista päivittää samat tiedot myös `index.html`:n
staattiseen rakenteiseen dataan ja `<noscript>`-osaan**, koska ne näkyvät myös
ilman JavaScriptiä.

`ctaTarget` ratkaisee, mihin sivuston pääkehotus **Kysy kuljetuksesta** johtaa:

| Arvo | Painikkeen toiminta |
| --- | --- |
| `'page'` (nykyinen) | vie yhteystietosivulle, jossa puhelin ja sähköposti näkyvät rinnakkain ja asiakas valitsee kanavan itse |
| `'direct'` | avaa suoraan puhelinsovelluksen (`tel:`) tai sähköpostin (`mailto:`) |

Tyhjä arvo (`null`) tarkoittaa edelleen "ei tiedossa": silloin kyseinen kanava
jätetään käyttöliittymästä kokonaan pois. **Sivustolla ei näytetä
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

### `src/data/pricing.js`

Kuljetushinnasto. Hinnasto-sivu (`/hinnasto`, `src/pages/Pricing.jsx`)
rakentuu kokonaan tästä tiedostosta: painoluokat painon mukaan, matkan
mukaan määräytyvät lisäehdot, tuntiveloitus sekä huomautukset. Tiedot ovat
yrityksen virallisesta hinnastosta ja kaikki hinnat ovat ilman
arvonlisäveroa (ALV 0). Kun hinnat muuttuvat, päivitä vain tämä tiedosto.

### `src/data/media.js`

Valokuvat. Tiedostot ovat kansiossa `src/assets/` ja ne tuodaan tähän
tiedostoon importilla. Käytössä ovat `owner` (yrittäjä) sekä `truckSide`,
`truckFront` ja `truckLogo` (lava-auto). Etusivun yritysnostossa näkyy
`owner`, ja Yritys-sivun galleriassa kaikki neljä.

Kohdat `hero`, `services` ja `company` ovat yhä `null`, eli niissä näytetään
sivuston omaa SVG-grafiikkaa.

Kun kuva vaihdetaan tai uusi lisätään:

1. Lisää tiedosto kansioon `src/assets/` (mieluiten `.webp` tai `.avif`)
2. Tuo se `media.js`-tiedostoon ja täytä `src`, `alt`, `width`, `height`
3. Sivusto vaihtaa kuvan automaattisesti – sivukomponentteihin ei tarvitse
   koskea

### `src/config/forms.js`

Yhteydenottolomakkeen taustapalvelun osoite ja reCAPTCHA v3 -sivustoavain.
Kumpikin on julkinen tunniste; reCAPTCHAn **salainen** avain tallennetaan vain
Apps Scriptiin. Asennusohje: [`google-apps-script/README.md`](google-apps-script/README.md).

```js
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycb.../exec'
const RECAPTCHA_SITE_KEY = '6Lc...'
```

Jos `ENDPOINT_URL` on tyhjä, lomaketta ei näytetä lainkaan – myöskään
tietosuojaselosteen lomaketta koskevia kohtia ei silloin näytetä.

### `src/config/site.js`

Verkkotunnus (`siteUrl`), sivuston oletusotsikko ja -kuvaus. **Muista vaihtaa
`siteUrl` julkaisun yhteydessä** – sitä käytetään canonical-osoitteissa ja
Open Graph -tiedoissa.

Samat osoitteet ovat myös tiedostoissa `public/sitemap.xml`, `public/robots.txt`
ja `index.html` (staattinen rakenteinen data). Päivitä ne yhtä aikaa.

### Tunnus (logo)

Alkuperäinen logotiedosto on projektin juuressa:
**`kuljetus-jumppanen-logo.png`** (sininen–musta tunnus valkoisella pohjalla).
Siitä on rajattu ja skaalattu kaikki sivuston käyttämät versiot:

| Tiedosto | Käyttö |
| --- | --- |
| `src/assets/logo-kuljetus-jumppanen.png` | tunnus läpinäkyvällä taustalla vaalealle pohjalle – ylätunniste |
| `src/assets/logo-kuljetus-jumppanen-light.png` | versio tummalle pohjalle: mustat osat käännetty valkoisiksi, sininen ennallaan – alatunniste |
| `public/logo-kuljetus-jumppanen.png` | Schema.org-rakenteinen data (`logo`), valkoisella pohjalla |
| `public/favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | selainkuvakkeet: tunnuksen J-merkki valkoisella laatalla |
| `public/og-kuljetus-jumppanen.png` | jakokuva sosiaaliseen mediaan |

Tunnuksen sininen on mitattu logotiedostosta, ja se on koko sivuston
tunnusväri (`--c-brand`, `#0846f5`, ks. `src/styles/tokens.css`). Tummalla
taustalla teksteissä ja ohuissa viivoissa käytetään kirkkaampaa sävyä
(`--c-brand-bright`), jotta kontrasti riittää. Mustaa ja valkoista käytetään
tukiväreinä; muita tehovärejä sivustolla ei ole. Tie- ja autoanimaation
keskiviiva on tarkoituksella edelleen keltainen (`--c-road-marking`) –
se kuuluu animaatioon, ei brändiin.

Tunnus näytetään `src/components/Logo.jsx`-komponentilla:

```jsx
<Logo tone="dark" className="brand__logo" />   // vaalealle taustalle (ylätunniste)
<Logo className="site-footer__logo" />          // vaalea versio tummalle taustalle (alatunniste)
```

Koko tulee CSS-muuttujasta `--logo-h`, joten se voi vaihdella näytön leveyden
mukaan (ks. `Header.css`). Jos logo joskus vaihtuu, korvaa yllä olevat
kuvatiedostot – komponentteihin ei tarvitse koskea.

---

## Yhteydenottolomake

Yhteystiedot-sivulla on lomake, joka lähettää viestin **Google Apps Script**
-taustapalveluun. Palvelu tarkistaa **reCAPTCHA v3** -pisteet ja lähettää
viestin yrityksen sähköpostiin (vastaus menee suoraan lähettäjälle, koska
viestin `Reply-To` on asiakkaan osoite). Staattinen sivusto ei siis tarvitse
omaa palvelinta, eikä palvelusta tule kustannuksia.

Käyttöönotto vaatii kaksi asiaa – **täydellinen ohje:**
[`google-apps-script/README.md`](google-apps-script/README.md)

1. reCAPTCHA v3 -avainpari ja Apps Script -projektin julkaisu web-sovelluksena
2. `ENDPOINT_URL` ja `RECAPTCHA_SITE_KEY` tiedostoon `src/config/forms.js`

Ennen kuin osoite on täytetty, lomaketta ei näytetä sivustolla lainkaan.

Roskapostisuojaus on kolminkertainen: reCAPTCHA v3 -pisteet (tarkistetaan
palvelimella salaisella avaimella), piilotettu hunajapurkkikenttä ja
määrärajoitus. Kenttien tarkistus tehdään sekä selaimessa että palvelimella.

**Väliaikainen tila ilman reCAPTCHA-avainta:** lomake toimii myös ennen kuin
avainpari on luotu. Silloin `RECAPTCHA_SITE_KEY` on tyhjä eikä reCAPTCHAa
ladata, Apps Script hyväksyy viestit ilman pistetarkistusta ja määrärajoitus
kiristyy 10 viestiin tunnissa. Suojana on tällöin vain hunajapurkkikenttä,
joten **lisää avain heti kun se on saatavilla.** Kun sivustoavain on tyhjä,
myöskään tietosuojaseloste ei kerro reCAPTCHAsta – seloste kuvaa aina
sivuston todellista tilaa.

**Tietosuoja:** `src/pages/Privacy.jsx` kertoo lomakkeen tiedonkäsittelystä ja
reCAPTCHAsta automaattisesti silloin, kun lomake on käytössä. Jos lomakkeen
kenttiä muutetaan, päivitä myös selosteen kohta “Yhteydenottolomake”.

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
google-apps-script/ yhteydenottolomakkeen taustapalvelu (Code.gs) + asennusohje
src/
  config/          business.js (yritystiedot), site.js (SEO-perusasetukset),
                   forms.js (yhteydenottolomake)
  data/            navigation.js, services.js, pricing.js, media.js
  components/      uudelleenkäytettävät osat (Header, Footer, Seo, Button,
                   ContactForm, …)
  layouts/         SiteLayout.jsx
  pages/           Home, Services, Pricing, Company, Contact, Privacy, NotFound
  lib/             structuredData.js (Schema.org), recaptcha.js
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
**JUMPPANEN**-sanamerkki; väljästi harvennetut versaalit toistavat tunnuksen harvennetun
**KULJETUS**-tekstin. Barlow on samaa matalan kontrastin groteskiperhettä mutta
avoimempi, joten pidemmätkin kappaleet pysyvät luettavina.

Molemmat ovat SIL Open Font License 1.1 -lisenssillä; katso
`src/assets/fonts/LICENSE.md`. Uusia painoja lisätään pudottamalla `.woff2`
kansioon `src/assets/fonts/` ja lisäämällä `@font-face` tiedostoon
`src/styles/fonts.css`.

## Periaatteet, joita kannattaa noudattaa jatkossakin

- **Sivustolla esitetään vain varmistettuja tietoja.** Ei keksittyjä
  palvelukuvauksia, toimialueita, kokemusvuosia, asiakasmääriä tai arvosteluja.
- **Kalusto:** yrityksellä on yksi auto – yksittäisohjaamolla varustettu
  lava-auto, jonka mukaan sivuston piirroskuva
  (`src/components/VehicleGraphic.jsx`) on piirretty. Kuvituksen ja tekstien
  tulee kertoa pienestä, ketterästä kuljetusyrityksestä – ei
  kuorma-autokalustosta.
- **Ei seurantaa.** Sivustolla ei ole analytiikkaa, evästeitä eikä kolmansien
  osapuolten pyyntöjä. Myös kirjasimet tarjoillaan sivuston omalta palvelimelta
  (`src/assets/fonts/`, ei Google Fonts -CDN:ää), joten selain ei ota yhteyttä
  ulkopuolisiin palveluihin. Siksi sivustolla ei myöskään tarvita
  evästeilmoitusta. Jos seurantaa joskus lisätään, päivitä `src/pages/Privacy.jsx`.
  **Älä lisää kirjasimia CDN-linkkinä** – se rikkoisi tämän periaatteen.
  Ainoa poikkeus on yhteydenottolomakkeen reCAPTCHA, joka ladataan vasta kun
  käyttäjä alkaa täyttää lomaketta – **älä lataa sitä sivun latauksen yhteydessä.**
- **Lomaketta ei näytetä ilman toimivaa taustapalvelua.** Jos
  `src/config/forms.js`:n osoite on tyhjä, lomake jää kokonaan pois. Sivustolla
  ei esitetä lomaketta, joka näyttäisi lähettävän viestin lähettämättä sitä oikeasti.
