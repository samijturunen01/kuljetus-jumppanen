/**
 * =============================================================================
 *  KULJETUS JUMPPANEN OY – yhteydenottolomakkeen taustapalvelu
 * =============================================================================
 *
 *  Tämä koodi ajetaan Google Apps Scriptissä (script.google.com), ei tässä
 *  repossa. Se ottaa vastaan verkkosivuston lomakkeen, tarkistaa
 *  reCAPTCHA v3 -pisteet ja lähettää viestin sähköpostiin. Halutessaan
 *  viestit voi myös tallentaa Google Sheets -taulukkoon.
 *
 *  Asennusohje: google-apps-script/README.md
 *
 *  Salaisuudet (reCAPTCHAn secret key, vastaanottajan osoite) asetetaan
 *  Apps Scriptin kohtaan Project Settings -> Script properties. Niitä ei
 *  kirjoiteta tähän tiedostoon eikä versionhallintaan.
 *
 *    RECAPTCHA_SECRET   ks. alla    reCAPTCHA v3:n salainen avain
 *
 *  Jos RECAPTCHA_SECRET puuttuu, lomake toimii mutta reCAPTCHA-tarkistusta
 *  ei tehdä – suojana ovat vain hunajapurkkikenttä ja tiukennettu
 *  määrärajoitus (10 viestiä/tunti). Lisää avain heti kun se on saatavilla.
 *    RECIPIENT_EMAIL    pakollinen  minne viestit lähetetään
 *    SCORE_THRESHOLD    valinnainen oletus 0.5 (0–1, isompi = tiukempi)
 *    SHEET_ID           valinnainen Google Sheets -taulukon tunnus lokia varten
 * =============================================================================
 */

var SETTINGS = {
  /** Sama toiminnon nimi kuin selaimessa (src/config/forms.js). */
  expectedAction: 'yhteydenotto',
  /** Oletusraja reCAPTCHA-pisteille, jos SCORE_THRESHOLD puuttuu. */
  defaultScoreThreshold: 0.5,
  /** Koko palvelun yläraja: enintään näin monta viestiä tunnissa. */
  maxPerHour: 40,
  /** Tiukempi yläraja niin kauan kuin RECAPTCHA_SECRET puuttuu. */
  maxPerHourWithoutRecaptcha: 10,
  /** Sama sähköpostiosoite saa lähettää viestin näin harvoin (sekuntia). */
  sameSenderCooldownSeconds: 60,
  subjectPrefix: 'Yhteydenotto verkkosivuilta',
  /** Kenttien enimmäispituudet – samat kuin selaimessa. */
  limits: {
    name: 120,
    email: 160,
    phone: 40,
    place: 200,
    schedule: 120,
    message: 2000,
  },
};

/** Yleisluontoinen virheilmoitus. Ei kerro robotille, mikä tarkistus esti. */
var GENERIC_ERROR = 'Viestin lähetys ei onnistunut. Yritä hetken kuluttua uudelleen tai ota yhteyttä puhelimitse.';

/**
 * Lomakkeen vastaanotto.
 *
 * Sivusto lähettää rungon JSON-merkkijonona sisältötyypillä text/plain,
 * jotta selain ei tee CORS-esitarkistusta (OPTIONS), jota Apps Script ei
 * osaa käsitellä.
 */
function doPost(e) {
  try {
    var data = parseBody_(e);

    // Hunajapurkki: vain robotti täyttää piilotetun kentän. Vastataan
    // onnistumisella, jottei robotti opi kiertämään tarkistusta.
    if (String(data.company || '').trim() !== '') {
      return jsonOutput_({ ok: true });
    }

    var fields = readFields_(data);
    var validationError = validate_(fields);
    if (validationError) {
      return jsonOutput_({ ok: false, error: validationError });
    }

    var props = PropertiesService.getScriptProperties();

    var recaptchaError = checkRecaptcha_(props, String(data.token || ''));
    if (recaptchaError) {
      return jsonOutput_({ ok: false, error: recaptchaError });
    }

    var throttleError = checkThrottle_(fields.email, isRecaptchaConfigured_(props));
    if (throttleError) {
      return jsonOutput_({ ok: false, error: throttleError });
    }

    sendNotification_(props, fields);
    appendToSheet_(props, fields, data);

    return jsonOutput_({ ok: true });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonOutput_({ ok: false, error: GENERIC_ERROR });
  }
}

/**
 * Selaimella avattaessa kertoo vain, että palvelu on pystyssä.
 * Kätevä tapa varmistaa, että julkaisu onnistui.
 */
function doGet() {
  return jsonOutput_({ ok: true, service: 'Kuljetus Jumppanen – yhteydenottolomake' });
}

/* ---------------------------------------------------------------------------
   Pyynnön lukeminen ja tarkistus
   --------------------------------------------------------------------------- */

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Tyhjä pyyntö.');
  }
  return JSON.parse(e.postData.contents);
}

function clean_(value, maxLength) {
  var text = String(value == null ? '' : value).trim();
  // Poistetaan ohjausmerkit rivinvaihtoja ja sarkaimia lukuun ottamatta.
  text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function readFields_(data) {
  var limits = SETTINGS.limits;
  return {
    name: clean_(data.name, limits.name),
    email: clean_(data.email, limits.email).replace(/[\r\n]/g, ''),
    phone: clean_(data.phone, limits.phone),
    pickup: clean_(data.pickup, limits.place),
    dropoff: clean_(data.dropoff, limits.place),
    schedule: clean_(data.schedule, limits.schedule),
    message: clean_(data.message, limits.message),
    loadingHelp: data.loadingHelp === true,
  };
}

function validate_(fields) {
  if (fields.name.length < 2) return 'Kerro nimesi.';
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(fields.email)) return 'Tarkista sähköpostiosoite.';
  if (fields.phone && !/^[+()\d\s-]{6,}$/.test(fields.phone)) return 'Tarkista puhelinnumero.';
  if (fields.message.length < 10) return 'Kerro lyhyesti, mitä olisi kuljetettavana.';
  return '';
}

/** Onko reCAPTCHA-tarkistus käytössä? Vaatii salaisen avaimen. */
function isRecaptchaConfigured_(props) {
  return Boolean(props.getProperty('RECAPTCHA_SECRET'));
}

/**
 * Tarkistaa reCAPTCHA v3 -tunnisteen Googlen palvelussa.
 * @returns {string} tyhjä merkkijono = hyväksytty, muuten virheilmoitus
 */
function checkRecaptcha_(props, token) {
  var secret = props.getProperty('RECAPTCHA_SECRET');
  if (!secret) {
    // VÄLIAIKAINEN TILA: avainta ei ole vielä luotu. Lomake toimii, mutta
    // roskapostisuojana on tällöin vain hunajapurkkikenttä ja tiukennettu
    // määrärajoitus. Lisää RECAPTCHA_SECRET heti kun avain on saatavilla –
    // sen jälkeen tarkistus kytkeytyy päälle automaattisesti.
    console.warn(
      'RECAPTCHA_SECRET puuttuu: viesti hyväksyttiin ilman reCAPTCHA-tarkistusta.',
    );
    return '';
  }
  if (!token) return 'Roskapostisuojaus ei ehtinyt latautua. Päivitä sivu ja yritä uudelleen.';

  var response = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });

  var result = {};
  try {
    result = JSON.parse(response.getContentText());
  } catch (error) {
    console.error('reCAPTCHA-vastausta ei voitu lukea: ' + response.getContentText());
    return GENERIC_ERROR;
  }

  if (!result.success) {
    console.warn('reCAPTCHA hylkäsi tunnisteen: ' + JSON.stringify(result['error-codes'] || []));
    return 'Roskapostisuojaus hylkäsi lähetyksen. Päivitä sivu ja yritä uudelleen.';
  }

  if (result.action && result.action !== SETTINGS.expectedAction) {
    console.warn('Odottamaton reCAPTCHA-toiminto: ' + result.action);
    return GENERIC_ERROR;
  }

  var threshold = Number(props.getProperty('SCORE_THRESHOLD') || SETTINGS.defaultScoreThreshold);
  if (typeof result.score === 'number' && result.score < threshold) {
    console.warn('reCAPTCHA-pisteet liian matalat: ' + result.score);
    return 'Lähetys tulkittiin automaattiseksi. Ota yhteyttä puhelimitse tai sähköpostilla.';
  }

  return '';
}

/**
 * Yksinkertainen määrärajoitus. Apps Script ei näytä lähettäjän IP-osoitetta,
 * joten rajoitus perustuu kokonaismäärään ja lähettäjän sähköpostiosoitteeseen.
 * @returns {string} tyhjä merkkijono = hyväksytty
 */
function checkThrottle_(email, recaptchaConfigured) {
  var cache = CacheService.getScriptCache();

  var senderKey = 'sender:' + Utilities.base64Encode(email.toLowerCase());
  if (cache.get(senderKey)) {
    return 'Edellinen viestisi lähti hetki sitten. Odota hetki ennen uutta viestiä.';
  }

  // Ilman reCAPTCHAa raja on tiukempi, koska muuta suojaa ei juuri ole.
  var limit = recaptchaConfigured
    ? SETTINGS.maxPerHour
    : SETTINGS.maxPerHourWithoutRecaptcha;

  var hourKey = 'hour:' + Math.floor(Date.now() / 3600000);
  var count = Number(cache.get(hourKey) || 0);
  if (count >= limit) {
    console.warn('Tuntikohtainen yläraja täynnä.');
    return GENERIC_ERROR;
  }

  cache.put(senderKey, '1', SETTINGS.sameSenderCooldownSeconds);
  cache.put(hourKey, String(count + 1), 3600);
  return '';
}

/* ---------------------------------------------------------------------------
   Viestin välitys
   --------------------------------------------------------------------------- */

function sendNotification_(props, fields) {
  var recipient = props.getProperty('RECIPIENT_EMAIL');
  if (!recipient) throw new Error('RECIPIENT_EMAIL puuttuu Script properties -asetuksista.');

  var lines = [
    'Uusi yhteydenotto verkkosivuilta.',
    '',
    'Nimi: ' + fields.name,
    'Sähköposti: ' + fields.email,
    'Puhelin: ' + (fields.phone || '–'),
    'Noutopaikka: ' + (fields.pickup || '–'),
    'Toimitusosoite: ' + (fields.dropoff || '–'),
    'Toivottu ajankohta: ' + (fields.schedule || '–'),
    'Apua lastaamisessa: ' + (fields.loadingHelp ? 'kyllä' : 'ei'),
    '',
    'Viesti:',
    fields.message,
    '',
    '—',
    'Lähetetty ' + Utilities.formatDate(new Date(), 'Europe/Helsinki', 'd.M.yyyy HH:mm'),
    'Vastaa tähän viestiin, niin vastaus menee suoraan lähettäjälle.',
  ];

  MailApp.sendEmail({
    to: recipient,
    replyTo: fields.email,
    subject: SETTINGS.subjectPrefix + ': ' + fields.name.replace(/[\r\n]/g, ' '),
    body: lines.join('\n'),
    name: 'Kuljetus Jumppanen – verkkosivut',
  });
}

/** Valinnainen loki Google Sheets -taulukkoon. Ohitetaan, jos SHEET_ID puuttuu. */
function appendToSheet_(props, fields, data) {
  var sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) return;

  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Aika',
        'Nimi',
        'Sähköposti',
        'Puhelin',
        'Noutopaikka',
        'Toimitusosoite',
        'Ajankohta',
        'Lastausapu',
        'Viesti',
        'Sivu',
      ]);
    }
    sheet.appendRow([
      new Date(),
      fields.name,
      fields.email,
      fields.phone,
      fields.pickup,
      fields.dropoff,
      fields.schedule,
      fields.loadingHelp ? 'kyllä' : 'ei',
      fields.message,
      String(data.page || ''),
    ]);
  } catch (error) {
    // Loki ei saa estää viestin perillemenoa.
    console.error('Taulukkoon kirjoitus epäonnistui: ' + error);
  }
}

/* ---------------------------------------------------------------------------
   Apurit
   --------------------------------------------------------------------------- */

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Aja tämä kerran Apps Script -editorissa käyttöönoton jälkeen:
 * tarkistaa asetukset, pyytää tarvittavat luvat ja lähettää testiviestin.
 */
function testaaAsetukset() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('RECIPIENT_EMAIL')) {
    throw new Error('Script properties puuttuu: RECIPIENT_EMAIL');
  }
  if (!isRecaptchaConfigured_(props)) {
    console.warn(
      'HUOM: RECAPTCHA_SECRET puuttuu. Lomake toimii, mutta ilman ' +
        'reCAPTCHA-tarkistusta. Lisää avain heti kun se on saatavilla.',
    );
  }

  sendNotification_(props, {
    name: 'Testi Testinen',
    email: props.getProperty('RECIPIENT_EMAIL'),
    phone: '045 264 6870',
    pickup: 'Rauhankatu 5, Joensuu',
    dropoff: 'Kauppakatu 1, Joensuu',
    schedule: 'ensi viikolla',
    message: 'Tämä on testiviesti yhteydenottolomakkeen taustapalvelusta.',
    loadingHelp: true,
  });

  console.log('Testiviesti lähetetty osoitteeseen ' + props.getProperty('RECIPIENT_EMAIL'));
}
