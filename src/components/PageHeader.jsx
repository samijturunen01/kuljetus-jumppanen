import './PageHeader.css'

/** Alasivujen yhtenäinen otsikko-osa. */
export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <section className="page-header">
      <div className="page-header__grid" aria-hidden="true" />
      <div className="container page-header__inner">
        {eyebrow && (
          <p className="page-header__eyebrow">
            <span className="page-header__mark" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="page-header__title">{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </section>
  )
}
