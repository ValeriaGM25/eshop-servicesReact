import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getProductById } from '../../catalog/services/catalogService.js'
import { useBasket } from '../../basket/hooks/useBasket.js'
import { getPendingPurchase, clearPendingPurchase } from '../utils/pendingPurchase.js'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin, authLoading } = useAuth()
  const { addProduct } = useBasket()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login({ email, password })
      const user = data?.user
      const roles = user?.roles ?? []
      const isUserAdmin = roles.includes('Admin')

      if (isUserAdmin) {
        const adminFrom = from.startsWith('/admin') ? from : '/admin'
        navigate(adminFrom, { replace: true })
        return
      }

      const pending = getPendingPurchase()
      if (pending) {
        clearPendingPurchase()
        try {
          const product = await getProductById(pending.productId)
          await addProduct(product)
          if (pending.type === 'buy-now') {
            navigate('/carrito', { replace: true })
            return
          }
          navigate(pending.returnTo || '/productos/' + pending.productId, { replace: true })
          return
        } catch {
        }
      }

      navigate(from === '/login' || from === '/registro' ? '/' : from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <AuthLayout mode="login">
      <div className="card shadow-lg border-0 rounded-4 neo-card">
        <div className="card-body p-4">
          {successMessage && (
            <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-check-circle-fill" />
              {successMessage}
            </div>
          )}
          <h2 className="card-title text-center mb-4">
            <i className="bi bi-box-arrow-in-right me-2" />
            Iniciar sesión
          </h2>
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <PasswordField
              id="password"
              label="Contraseña"
              value={password}
              onChange={setPassword}
              required
            />
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Ingresando…</>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
          <p className="text-center mb-2">
            ¿No tienes cuenta?{' '}
            <Link to="/registro">Regístrate</Link>
          </p>
          <p className="text-center mb-0">
            <Link to="/productos" className="text-secondary small">
              <i className="bi bi-arrow-left me-1" />Volver al catálogo
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
