/**
 * Kuljetuspalvelut.
 *
 * Palvelut on kuvattu yleisellä tasolla, koska tarkkoja palvelutyyppejä ja
 * toimialuetta ei ole vielä vahvistettu. Kun ne tarkentuvat, lisää uusi
 * objekti tähän listaan – Kuljetuspalvelut-sivu ja etusivu päivittyvät itse.
 *
 * Kentät:
 *   id      – yksilöivä tunniste
 *   number  – järjestysnumero käyttöliittymässä
 *   title   – lyhyt otsikko
 *   summary – 1–2 lausetta
 *   points  – lyhyet tarkennukset (valinnainen)
 */
export const services = [
  {
    id: 'tavarankuljetus',
    number: '01',
    title: 'Tavarankuljetukset',
    summary:
      'Hoidamme tavaroiden kuljetukset lava-autolla. Kerro mitä on kuljetettavana, mistä ja minne – sovitaan kuljetus sen mukaan.',
    points: ['Nouto ja toimitus sovitusti', 'Tavarat käsitellään huolellisesti'],
  },
  {
    id: 'sopimuksen-mukaan',
    number: '02',
    title: 'Kuljetukset sopimuksen mukaan',
    summary:
      'Kuljetustarpeet ovat erilaisia. Käydään tarpeesi läpi yhdessä ja sovitaan aikataulusta ja toteutuksesta suoraan yrittäjän kanssa.',
    points: ['Joustava aikataulu', 'Selkeä hinnoittelu ennen kuljetusta'],
  },
  {
    id: 'saannolliset',
    number: '03',
    title: 'Säännölliset kuljetukset',
    summary:
      'Toistuvat kuljetukset onnistuvat sopimalla. Kun kuljetusreitti ja aikataulu ovat tiedossa, asiat hoituvat rutiinilla.',
    points: ['Sama tuttu kuljettaja', 'Sovitaan tapauskohtaisesti'],
  },
]

/** Miksi pieni, yrittäjävetoinen kuljetusyritys – ei keksittyjä lukuja. */
export const promises = [
  {
    id: 'suora-yhteys',
    title: 'Suora yhteys yrittäjään',
    text: 'Ei puhelinvalikoita eikä välikäsiä. Puhut sen kanssa, joka myös ajaa kuljetuksen.',
  },
  {
    id: 'joustavuus',
    title: 'Joustavuutta',
    text: 'Pieni yritys pystyy sopimaan asioista nopeasti ja mukautumaan tarpeeseen.',
  },
  {
    id: 'paikallisuus',
    title: 'Joensuusta käsin',
    text: 'Toimimme Joensuusta. Paikallinen kuljettaja tuntee alueen ja sen reitit.',
  },
  {
    id: 'selkeys',
    title: 'Selkeät sopimukset',
    text: 'Sovitaan kuljetuksesta ja hinnasta etukäteen. Ei yllätyksiä jälkikäteen.',
  },
]

export default services
