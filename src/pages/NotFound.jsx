import Seo from '../components/Seo.jsx'
import Button from '../components/Button.jsx'
import { navigation } from '../data/navigation.js'
import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Sivua ei löytynyt"
        description="Etsimääsi sivua ei löytynyt."
        path="/404"
        noindex
      />

      <section className="notfound">
        <div className="container notfound__inner">
          <p className="notfound__code">404</p>
          <h1 className="notfound__title">Tämä reitti ei johda perille</h1>
          <p className="notfound__text">
            Etsimääsi sivua ei löytynyt. Se on voitu poistaa tai osoitteessa on
            kirjoitusvirhe.
          </p>

          <div className="btn-row notfound__actions">
            <Button to="/" variant="primary" size="lg">
              Takaisin etusivulle
            </Button>
          </div>

          <nav aria-label="Sivut" className="notfound__nav">
            <ul>
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}
