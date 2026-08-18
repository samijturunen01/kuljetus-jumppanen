import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Company from './pages/Company.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * Reititys.
 *
 * `basename` tulee Viten base-asetuksesta, joten sivusto toimii sekä
 * omalla verkkotunnuksella että GitHub Pagesin projektiosoitteessa
 * (esim. kayttaja.github.io/repo/) ilman koodimuutoksia.
 *
 * Suoraan alasivulle tuleva pyyntö ohjautuu GitHub Pagesissa
 * public/404.html-tiedoston kautta takaisin sovellukseen, joten
 * sivun päivittäminen ei riko sivustoa.
 */
export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename || '/'}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="kuljetuspalvelut" element={<Services />} />
          <Route path="yritys" element={<Company />} />
          <Route path="yhteystiedot" element={<Contact />} />
          <Route path="tietosuoja" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
