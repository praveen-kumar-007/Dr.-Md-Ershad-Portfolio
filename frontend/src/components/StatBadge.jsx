export default function StatBadge({ label, value, detail }) {
  const badgeClass = label === 'Google Scholar'
    ? 'stat-badge-google'
    : label === 'Scopus'
    ? 'stat-badge-scopus'
    : ''

  const showIcon = badgeClass !== ''

  return (
    <div className={`stat-badge ${badgeClass}`}>
      <span className="stat-label">
        {showIcon && <span className="stat-icon" aria-hidden="true" />}
        {label}
      </span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  )
}
