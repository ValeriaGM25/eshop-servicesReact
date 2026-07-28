import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'

const PASSWORD_REQUIREMENTS = [
  { label: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Una mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una minúscula', test: (v) => /[a-z]/.test(v) },
  { label: 'Un número', test: (v) => /\d/.test(v) },
  { label: 'Un carácter especial', test: (v) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\]/.test(v) },
]

export default function RegisterPage() {
  const { register, isAuthenticated, authLoading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const missing = PASSWORD_REQUIREMENTS.find((r) => !r.test(password))
    if (missing) {
      setError(`La contraseña debe cumplir: ${missing.label.toLowerCase()}.`)
      return
    }

    setLoading(true)
    try {
      await register({ fullName, email, password, confirmPassword })
      navigate('/login', {
        state: {
          email,
          successMessage: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
        },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <AuthLayout>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">
            <i className="bi bi-person-plus me-2" />
            Crear Cuenta
          </h2>
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Nombre completo</label>
              <input id="fullName" type="text" className="form-control" value={fullName}
                onChange={(e) => setFullName(e.target.value)} required autoFocus />
            </div>
            <div className="mb-3">
              <label htmlFor="reg-email" className="form-label">Correo electrónico</label>
              <input id="reg-email" type="email" className="form-control" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <PasswordField id="reg-password" label="Contraseña" value={password}
              onChange={setPassword} required minLength={8} />
            <div className="mb-3">
              <div className="small text-secondary">
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const met = req.test(password)
                  return (
                    <div key={req.label} className={met ? 'text-success' : ''}>
                      <i className={`bi ${met ? 'bi-check-circle-fill' : 'bi-circle'} me-1`} />
                      {req.label}
                    </div>
                  )
                })}
              </div>
            </div>
            <PasswordField id="reg-confirm" label="Confirmar contraseña" value={confirmPassword}
              onChange={setConfirmPassword} required minLength={8} />
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Creando cuenta…</>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
          <p className="text-center mb-0">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
