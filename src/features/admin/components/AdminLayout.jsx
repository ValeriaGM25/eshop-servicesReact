import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/admin', label: 'Resumen', icon: 'bi-speedometer2' },
  { path: '/admin/productos', label: 'Productos', icon: 'bi-box-seam' },
  { path: '/admin/productos/nuevo', label: 'Nuevo producto', icon: 'bi-plus-circle' },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <section className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="bi bi-shield-lock text-primary me-2" />
            Administración
          </h1>
          <p className="text-secondary small mb-0">Panel protegido por rol Admin</p>
        </div>
        <Link className="btn btn-outline-primary btn-sm" to="/">
          <i className="bi bi-arrow-left me-1" />Volver a la tienda
        </Link>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`btn btn-sm ${location.pathname === item.path ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            <i className={`bi ${item.icon} me-1`} />
            {item.label}
          </Link>
        ))}
      </div>

      <Outlet />
    </section>
  )
}
