import React from 'react'

export function SkeletonBlock({ rows = 3, className = '' }) {
  return (
    <div className={`skeleton-block ${className}`.trim()}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-line" />
      ))}
    </div>
  )
}

export function SkeletonCard({ lines = 4, hasMedia = true, className = '' }) {
  return (
    <article className={`skeleton-card ${className}`.trim()}>
      {hasMedia && <div className="skeleton-card-media" />}
      <div className="skeleton-card-body">
        <SkeletonBlock rows={lines} />
      </div>
    </article>
  )
}

export default SkeletonBlock
