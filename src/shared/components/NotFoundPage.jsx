import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="container py-5 text-center">
      <div className="not-found-card mx-auto p-5 bg-white shadow-sm rounded-4">
        <i className="bi bi-compass display-1 text-primary" aria-hidden="true" />
        <p className="display-3 fw-bold text-dark mb-0">404</p>
        <h1 className="h2 fw-bold mb-3">Pagina no encontrada</h1>
        <p className="text-secondary mb-4">La ruta solicitada no existe.</p>
        <Link className="btn btn-primary btn-lg" to="/">
          <i className="bi bi-house me-2" aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
