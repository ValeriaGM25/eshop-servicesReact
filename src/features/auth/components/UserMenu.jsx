import { Link } from 'react-router-dom'

export default function UserMenu({ user, onLogout, logoutLoading }) {
  return (
    <li className="nav-item dropdown">
      <button
        className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none d-flex align-items-center gap-1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-person-circle" aria-hidden="true" />
        {user?.fullName ?? user?.name ?? 'Usuario'}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
        <li><span className="dropdown-item-text small text-secondary">{user?.email}</span></li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <Link className="dropdown-item" to="/mi-cuenta">
            <i className="bi bi-person me-2" />Mi cuenta
          </Link>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={onLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Cerrando sesión…</>
            ) : (
              <><i className="bi bi-box-arrow-right me-2" />Cerrar sesión</>
            )}
          </button>
        </li>
      </ul>
    </li>
  )
}
