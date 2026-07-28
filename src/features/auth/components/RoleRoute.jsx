import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function RoleRoute({ children, roles }) {
  const { isAuthenticated, authLoading, user } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 text-primary" role="status">
        <span className="spinner-border me-2" aria-hidden="true" />
        Verificando sesión…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRoles = user?.roles ?? []
  const hasRole = roles.some((role) => userRoles.includes(role))

  if (!hasRole) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}
