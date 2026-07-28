import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth.js'
import { useBasket } from '../../features/basket/hooks/useBasket.js'
import UserMenu from '../../features/auth/components/UserMenu.jsx'

export default function Navbar() {
  const { isAuthenticated, isAdmin, isCliente, user, logout, logoutLoading } = useAuth()
  const { totalItems } = useBasket()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" aria-label="Navegacion principal">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/" aria-label="Ir al inicio">
          <i className="bi bi-shop" aria-hidden="true" />
          E-Shop Microservices
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Alternar navegacion"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/" end>
                <i className="bi bi-house me-1" />Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/productos">
                <i className="bi bi-grid me-1" />Catálogo
              </NavLink>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/admin">
                  <i className="bi bi-shield-lock me-1" />Administración
                </NavLink>
              </li>
            )}

            {isCliente && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/carrito">
                  <i className="bi bi-cart3 me-1" />Carrito
                  <span className="badge rounded-pill bg-danger ms-2">{totalItems}</span>
                </NavLink>
              </li>
            )}

            {isAuthenticated ? (
              <UserMenu user={user} isAdmin={isAdmin} onLogout={logout} logoutLoading={logoutLoading} />
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/login">
                    <i className="bi bi-box-arrow-in-right me-1" />Iniciar sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/registro">
                    <i className="bi bi-person-plus me-1" />Crear cuenta
                  </NavLink>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}
