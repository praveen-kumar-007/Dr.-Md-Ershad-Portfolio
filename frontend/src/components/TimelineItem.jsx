export default function TimelineItem({ title, organization, duration, description }) {
  return (
    <article className="timeline-item">
      <div className="timeline-header">
        <h3>{title}</h3>
        <span>{duration}</span>
      </div>
      <p className="timeline-meta">{organization}</p>
      <p>{description}</p>
    </article>
  )
}
