export default function LoadingMessage({ children = 'Cargando productos...' }) {
  return (
    <div className="loading-message d-flex align-items-center justify-content-center gap-3 py-5 text-primary" role="status" aria-live="polite">
      <span className="spinner-border" aria-hidden="true" />
      <span className="fw-semibold">{children}</span>
    </div>
  )
}
