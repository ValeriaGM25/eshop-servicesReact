import AuroraBackground from '../../../components/react-bits/AuroraBackground.jsx'

export default function AuthLayout({ children, mode = 'login' }) {
  return (
    <section className="container py-5">
      <div className="row g-4 align-items-stretch justify-content-center">
        <div className="col-lg-6 d-none d-lg-block">
          <AuroraBackground className="h-100 neo-card shadow-lg">
            <div className="p-5 d-flex flex-column justify-content-between h-100" style={{ minHeight: 560 }}>
              <div>
                <span className="badge rounded-pill text-bg-light border mb-4">Neo Commerce</span>
                <h1 className="display-5 fw-bold mb-3">Tu tienda digital, segura y conectada.</h1>
                <p className="lead text-secondary">Accede a productos, carrito persistente, órdenes y comprobantes desde una experiencia moderna.</p>
              </div>
              <div className="d-flex gap-3">
                <div className="feature-icon"><i className="bi bi-shield-lock" aria-hidden="true" /></div>
                <div>
                  <p className="fw-semibold mb-1">Sesión protegida</p>
                  <p className="text-secondary small mb-0">Autenticación existente con permisos por tipo de usuario.</p>
                </div>
              </div>
            </div>
          </AuroraBackground>
        </div>
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="d-lg-none text-center mb-4">
            <span className="neo-brand-mark mx-auto mb-3"><i className="bi bi-cpu" /></span>
            <h1 className="h3 fw-bold">{mode === 'register' ? 'Crear cuenta' : 'Bienvenido a eShop Neo'}</h1>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
