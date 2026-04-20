export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow-label">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <p className="section-description">{children}</p> : null}
    </div>
  )
}
