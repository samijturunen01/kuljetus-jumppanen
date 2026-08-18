import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Yhtenäinen painike. Renderöityy joko reitityslinkiksi, ulkoiseksi
 * linkiksi (tel:/mailto:) tai <button>-elementiksi tarpeen mukaan.
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        <svg viewBox="0 0 20 12" width="20" height="12" fill="none" focusable="false">
          <path d="M0 6h17M12.5 1 18 6l-5.5 5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    </>
  )

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {inner}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {inner}
      </a>
    )
  }

  return (
    <button className={classes} type="button" {...rest}>
      {inner}
    </button>
  )
}
