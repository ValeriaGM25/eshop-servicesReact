import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth.js'
import { useBasket } from '../../features/basket/hooks/useBasket.js'
import UserMenu from '../../features/auth/components/UserMenu.jsx'

export default function Navbar() {
  const { isAuthenticated, isAdmin, isCliente, user, logout, logoutLoading } = useAuth()
  const { totalItems } = useBasket()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm neo-navbar" aria-label="Navegacion principal">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/" aria-label="Ir al inicio">
          <span className="neo-brand-mark" style={{ width: '2.35rem', height: '2.35rem', borderRadius: '.85rem' }}>
            <i className="bi bi-cpu" aria-hidden="true" />
          </span>
          eShop Neo
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
              <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/productos">
                <i className="bi bi-grid me-1" />Catálogo
              </NavLink>
            </li>

            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/admin/productos">
                    <i className="bi bi-box-seam me-1" />Productos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/admin/ordenes">
                    <i className="bi bi-receipt-cutoff me-1" />Órdenes
                  </NavLink>
                </li>
                <li className="nav-item"><span className="badge rounded-pill text-bg-warning text-dark">Admin</span></li>
              </>
            )}

            {isCliente && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/carrito">
                    <i className="bi bi-cart3 me-1" />Mi carrito
                    <span className="badge rounded-pill bg-danger ms-2">{totalItems}</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link rounded-pill px-3 ${isActive ? 'active nav-link-active' : ''}`} to="/mis-compras">
                    <i className="bi bi-bag-check me-1" />Mis compras
                  </NavLink>
                </li>
              </>
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
