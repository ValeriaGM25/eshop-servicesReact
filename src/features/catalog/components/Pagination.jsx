export default function Pagination({ canGoBack, canGoNext, currentPage, loading, onNext, onPrevious }) {
  return (
    <nav className="mt-5" aria-label="Paginación del catálogo">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!canGoBack || loading ? 'disabled' : ''}`}>
          <button className="page-link" type="button" disabled={!canGoBack || loading} onClick={onPrevious} aria-label="Pagina anterior">
            Anterior
          </button>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">{currentPage}</span>
        </li>
        <li className={`page-item ${!canGoNext || loading ? 'disabled' : ''}`}>
          <button className="page-link" type="button" disabled={!canGoNext || loading} onClick={onNext} aria-label="Pagina siguiente">
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  )
}
