import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import './SiteLayout.css'

export default function SiteLayout() {
  const mainRef = useRef(null)

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Siirry sisältöön
      </a>
      <ScrollToTop mainRef={mainRef} />
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="site__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
