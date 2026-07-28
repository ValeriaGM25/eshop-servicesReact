import { useEffect, useState } from 'react'
import { fallbackRemoteImage } from '../config/remoteImages.js'

export default function RemoteImage({
  alt,
  className = '',
  fallbackSrc = fallbackRemoteImage,
  fetchPriority,
  loading = 'lazy',
  src,
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)
  const [hasFallbackFailed, setHasFallbackFailed] = useState(false)

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc)
    setHasFallbackFailed(false)
  }, [fallbackSrc, src])

  function handleError() {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      return
    }

    setHasFallbackFailed(true)
  }

  if (hasFallbackFailed) {
    return (
      <div className={`product-placeholder ${className}`} role="img" aria-label={alt}>
        <i className="bi bi-image" aria-hidden="true" />
        <span>Imagen no disponible</span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`remote-image ${className}`.trim()}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={handleError}
    />
  )
}
