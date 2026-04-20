import { useState } from 'react'

function PlaceholderMedia({ src, alt, label, wrapperClass = '', imageClass = '' }) {
  const [hasError, setHasError] = useState(false)
  const initial = label?.trim()?.charAt(0).toUpperCase() || '?'
  const showImage = src && !hasError

  return (
    <div className={`${wrapperClass} placeholder-media`}>
      {showImage ? (
        <img
          className={imageClass}
          src={src}
          alt={alt || label || 'Placeholder image'}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="placeholder-letter">{initial}</span>
      )}
    </div>
  )
}

export default PlaceholderMedia
