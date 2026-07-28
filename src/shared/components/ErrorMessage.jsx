export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3 shadow-sm border-0" role="alert">
      <div>
        <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true" />
        {message}
      </div>
      {onRetry ? (
        <button className="btn btn-sm btn-outline-danger" type="button" onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
