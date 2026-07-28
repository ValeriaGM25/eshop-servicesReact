import { useAuth } from '../hooks/useAuth.js'

export default function AccountPage() {
  const { user, isAdmin, isCliente, logout, logoutLoading } = useAuth()

  const roles = user?.roles ?? []

  return (
    <section className="container py-5" style={{ maxWidth: 600 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h2 className="card-title mb-4">
            <i className="bi bi-person-circle me-2" />
            Mi cuenta
          </h2>
          <dl className="row mb-3">
            <dt className="col-sm-4 text-secondary">Nombre</dt>
            <dd className="col-sm-8">{user?.fullName ?? user?.name ?? '—'}</dd>
            <dt className="col-sm-4 text-secondary">Correo</dt>
            <dd className="col-sm-8">{user?.email ?? '—'}</dd>
            <dt className="col-sm-4 text-secondary">Rol(es)</dt>
            <dd className="col-sm-8">
              {roles.length > 0
                ? roles.map((r) => (
                    <span className={`badge me-1 ${r === 'Admin' ? 'bg-warning text-dark' : 'bg-primary'}`} key={r}>
                      {r}
                    </span>
                  ))
                : '—'}
            </dd>
            <dt className="col-sm-4 text-secondary">Estado</dt>
            <dd className="col-sm-8">
              <span className="badge bg-success">Sesión activa</span>
            </dd>
          </dl>
          <button className="btn btn-outline-danger" onClick={logout} disabled={logoutLoading}>
            {logoutLoading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Cerrando sesión…</>
            ) : (
              <><i className="bi bi-box-arrow-right me-2" />Cerrar sesión</>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
