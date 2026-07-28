export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div>
          <p className="fw-bold mb-1">
            <i className="bi bi-shop me-2" aria-hidden="true" />
            E-Shop Microservices
          </p>
          <p className="text-white-50 small mb-0">React conectado con microservicios .NET.</p>
          <p className="text-white-50 small mb-0">Imágenes proporcionadas por Unsplash.</p>
        </div>
        <div className="d-flex align-items-center gap-3 text-white-50 small">
          <span>
            <i className="bi bi-box-seam me-1" aria-hidden="true" />
            Catálogo
          </span>
          <span>
            <i className="bi bi-cart3 me-1" aria-hidden="true" />
            Carrito
          </span>
          <span>{currentYear}</span>
        </div>
      </div>
    </footer>
  )
}
