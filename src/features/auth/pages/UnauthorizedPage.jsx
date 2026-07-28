import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function UnauthorizedPage() {
  const { isAuthenticated, isAdmin } = useAuth()

  let button
  if (isAdmin) {
    button = (
      <Link className="btn btn-primary btn-lg" to="/admin">
        <i className="bi bi-shield-lock me-2" />Ir al panel
      </Link>
    )
  } else if (isAuthenticated) {
    button = (
      <Link className="btn btn-primary btn-lg" to="/productos">
        <i className="bi bi-grid me-2" />Ir al catálogo
      </Link>
    )
  } else {
    button = (
      <Link className="btn btn-primary btn-lg" to="/login">
        <i className="bi bi-box-arrow-in-right me-2" />Iniciar sesión
      </Link>
    )
  }

  return (
    <section className="container py-5 text-center">
      <div className="mx-auto p-5 bg-white shadow-sm rounded-4" style={{ maxWidth: 500 }}>
        <i className="bi bi-shield-exclamation display-1 text-danger" />
        <p className="display-3 fw-bold text-dark mb-0">403</p>
        <h1 className="h2 fw-bold mb-3">Acceso no autorizado</h1>
        <p className="text-secondary mb-4">No tienes permisos para acceder a esta sección.</p>
        {button}
      </div>
    </section>
  )
}
