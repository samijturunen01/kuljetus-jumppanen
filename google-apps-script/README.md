# Yhteydenottolomakkeen taustapalvelu (Google Apps Script)

Verkkosivusto on staattinen (GitHub Pages), joten sillä ei ole omaa
palvelinta. Yhteydenottolomake lähettää viestin **Google Apps Script**
-web-sovellukselle, joka tarkistaa **reCAPTCHA v3** -pisteet ja lähettää
viestin sähköpostiin. Palvelu on Google-tilillä maksuton.

Koodi on tiedostossa [`Code.gs`](Code.gs). Se kopioidaan Apps Script
-editoriin – tätä kansiota ei julkaista sivuston mukana.

---

## 1. reCAPTCHA v3 -avaimet

1. Avaa <https://www.google.com/recaptcha/admin/create>
2. **Label:** esim. `kuljetusjumppanen.fi`
3. **Type:** valitse **reCAPTCHA v3** (Score based)
4. **Domains:** lisää molemmat osoitteet, joissa lomake toimii:
   - `samijturunen01.github.io`
   - `localhost` (kehityskonetta varten)
   - myöhemmin oma verkkotunnus, esim. `kuljetusjumppanen.fi`
5. Hyväksy ehdot ja tallenna. Saat kaksi avainta:

| Avain | Mihin se tulee | Julkinen? |
| --- | --- | --- |
| **Site key** (sivustoavain) | `src/config/forms.js` → `RECAPTCHA_SITE_KEY` | kyllä, näkyy selaimessa |
| **Secret key** (salainen avain) | Apps Script → Script properties | **ei koskaan koodiin tai GitHubiin** |

---

## 2. Apps Script -projekti

1. Avaa <https://script.google.com> sillä Google-tilillä, jolta viestit
   saa lähettää (esim. yrityksen Gmail-tili).
2. **New project** → nimeä esim. `Kuljetus Jumppanen – yhteydenottolomake`.
3. Korvaa `Code.gs`-tiedoston sisältö tämän kansion
   [`Code.gs`](Code.gs)-tiedoston sisällöllä ja tallenna.

### Asetukset (Script properties)

**Project Settings** (ratas vasemmalla) → **Script properties** →
*Add script property*:

| Nimi | Arvo | Pakollinen |
| --- | --- | --- |
| `RECIPIENT_EMAIL` | minne viestit lähetetään, esim. `jumppanenroope@gmail.com` | kyllä |
| `RECAPTCHA_SECRET` | reCAPTCHAn salainen avain | ks. alla |
| `SCORE_THRESHOLD` | pisteraja `0`–`1`, oletus `0.5` | ei |
| `SHEET_ID` | Google Sheets -taulukon tunnus, jos viestit halutaan myös taulukkoon | ei |

> **Ennen kuin reCAPTCHA-avain on olemassa.** Lomake toimii myös ilman
> `RECAPTCHA_SECRET`-arvoa: silloin reCAPTCHA-tarkistusta ei tehdä, ja suojana
> ovat vain hunajapurkkikenttä ja tiukennettu määrärajoitus (10 viestiä
> tunnissa 40:n sijaan). Tämä on tarkoitettu väliaikaiseksi tilaksi.
> **Lisää avain heti kun se on saatavilla** – tarkistus kytkeytyy päälle
> automaattisesti, kun arvo ilmestyy Script properties -kohtaan, eikä koodiin
> tarvitse koskea. Ilman reCAPTCHAa avoin osoite kerää ennen pitkää
> roskapostia sähköpostiin.

> `SHEET_ID` on taulukon osoitteesta löytyvä pitkä merkkijono:
> `docs.google.com/spreadsheets/d/`**`TÄMÄ_OSA`**`/edit`

### Julkaisu web-sovelluksena

1. Oikea yläkulma: **Deploy → New deployment**
2. Tyyppi (rataskuvake): **Web app**
3. **Execute as:** `Me` (viestit lähtevät sinun tililtäsi)
4. **Who has access:** `Anyone` – tämä on pakollinen, jotta sivuston
   lomake voi lähettää viestin. Suojaus perustuu reCAPTCHAan, ei
   osoitteen salaisuuteen.
5. **Deploy** → hyväksy Googlen lupapyynnöt (sähköpostin lähetys,
   ulkoinen yhteys reCAPTCHAan)
6. Kopioi **Web app URL** – se päättyy `/exec`

> **Muutosten julkaisu:** kun `Code.gs`-koodia muuttaa, muutos ei tule
> voimaan pelkällä tallennuksella. Valitse **Deploy → Manage deployments
> → (kynä) Edit → Version: New version → Deploy**. Osoite säilyy samana.

### Tarkistus

Aja editorissa funktio `testaaAsetukset` (valitse se funktiovalikosta ja
paina **Run**). Se tarkistaa asetukset ja lähettää testiviestin. Voit myös
avata `/exec`-osoitteen selaimessa: sen pitäisi vastata
`{"ok":true,"service":"..."}`.

---

## 3. Sivuston asetukset

Avaa [`src/config/forms.js`](../src/config/forms.js) ja täytä:

```js
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycb.../exec'
const RECAPTCHA_SITE_KEY = '6Lc...'
```

Molemmat arvot ovat julkisia tunnisteita, joten ne saa tallentaa
versionhallintaan. Vaihtoehtoisesti ne voi antaa GitHubin repoasetuksista
(**Settings → Secrets and variables → Actions → Variables**) nimillä
`VITE_FORM_ENDPOINT` ja `VITE_RECAPTCHA_SITE_KEY`; julkaisutyönkulku
välittää ne käännökseen.

Varmista lopuksi, että [`src/config/business.js`](../src/config/business.js)
sisältää `formEnabled: true`. Jos osoite puuttuu, lomaketta ei näytetä
lainkaan – sivustolla ei siis koskaan ole lomaketta, joka ei lähetä viestiä.

---

## Miten suojaus toimii

| Kerros | Tarkoitus |
| --- | --- |
| reCAPTCHA v3 | Google antaa lähetykselle pisteet 0–1 taustalla, ilman kuvatehtäviä. Pisteet tarkistetaan Apps Scriptissä salaisella avaimella, joten tarkistusta ei voi ohittaa selaimesta. Käytössä vasta kun `RECAPTCHA_SECRET` on asetettu. |
| Hunajapurkkikenttä | Piilotettu kenttä, jonka vain robotit täyttävät. Täytetty kenttä hiljaisesti hylätään. |
| Määrärajoitus | Enintään 40 viestiä tunnissa (ilman reCAPTCHAa 10), sama sähköpostiosoite kerran minuutissa. |
| Kenttien tarkistus | Pituudet ja muoto tarkistetaan sekä selaimessa että palvelimella. |

reCAPTCHA-skripti ladataan vasta, kun käyttäjä koskee lomakkeeseen. Pelkkä
sivuston selailu ei siis tee yhtään pyyntöä Googlelle. Jos sivustoavainta ei
ole täytetty tiedostoon `src/config/forms.js`, skriptiä ei ladata lainkaan –
eikä tietosuojaseloste silloin myöskään kerro reCAPTCHAsta.

---

## Vianetsintä

| Oire | Syy ja korjaus |
| --- | --- |
| `Viestin lähetys ei onnistunut` heti | Tarkista `/exec`-osoite ja että julkaisun **Who has access** on `Anyone`. |
| Lomake ei näy sivustolla | `ENDPOINT_URL` on tyhjä tai `formEnabled: false`. |
| `Roskapostisuojaus hylkäsi lähetyksen` | Site key ja secret key eivät ole samasta avainparista, tai sivuston verkkotunnus puuttuu reCAPTCHAn Domains-listalta. |
| `Lähetys tulkittiin automaattiseksi` | reCAPTCHA-pisteet jäivät rajan alle. Laske `SCORE_THRESHOLD` esim. arvoon `0.3`. |
| Viestit eivät tule perille | Katso Apps Scriptin **Executions**-loki. Gmailin päivittäinen lähetysraja on 100 viestiä/vrk. |
| Muutos ei näy | Julkaisematon versio: **Deploy → Manage deployments → Edit → New version**. |
