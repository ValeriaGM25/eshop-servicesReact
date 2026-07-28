import { Link } from 'react-router-dom'
import RemoteImage from '../shared/components/RemoteImage.jsx'
import { heroRemoteImage } from '../shared/config/remoteImages.js'

const benefits = [
  {
    icon: 'bi-grid-fill',
    title: 'Catálogo de productos',
    text: 'Explora artículos tecnológicos con precios, categorías y detalles actualizados.',
  },
  {
    icon: 'bi-bag-check-fill',
    title: 'Carrito persistente',
    text: 'Agrega productos y conserva tu carrito usando Basket.API.',
  },
  {
    icon: 'bi-hdd-network-fill',
    title: 'Microservicios y Docker',
    text: 'Frontend React integrado con servicios .NET listos para entornos modernos.',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="hero-section text-white">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-light text-primary mb-3">Frontend React independiente</span>
              <h1 className="display-4 fw-bold lh-1 mb-4">Explora nuestro catálogo tecnológico</h1>
              <p className="lead mb-4 text-white-75">
                Consulta productos, revisa sus detalles y administra tu carrito conectado con microservicios .NET.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link className="btn btn-light btn-lg px-4 fw-semibold" to="/productos">
                  <i className="bi bi-grid-fill me-2" aria-hidden="true" />
                  Ver catálogo
                </Link>
                <Link className="btn btn-outline-light btn-lg px-4 fw-semibold" to="/carrito">
                  <i className="bi bi-cart3 me-2" aria-hidden="true" />
                  Ver carrito
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div className="card border-0 shadow rounded-4 overflow-hidden hero-image-card mx-auto">
                <RemoteImage
                  src={heroRemoteImage}
                  alt="Tienda tecnológica con computadoras y accesorios"
                  className="img-fluid hero-image"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {benefits.map((benefit) => (
            <div className="col-md-4" key={benefit.title}>
              <article className="card h-100 border-0 shadow-sm rounded-4 benefit-card">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${benefit.icon}`} aria-hidden="true" />
                  </div>
                  <h2 className="h5 fw-bold">{benefit.title}</h2>
                  <p className="text-secondary mb-0">{benefit.text}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
