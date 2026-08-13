import { Link } from 'react-router-dom'
import AuroraBackground from '../components/react-bits/AuroraBackground.jsx'
import SpotlightCard from '../components/react-bits/SpotlightCard.jsx'
import RemoteImage from '../shared/components/RemoteImage.jsx'
import { heroRemoteImage } from '../shared/config/remoteImages.js'

const benefits = [
  {
    icon: 'bi-grid-fill',
    title: 'Selección inteligente',
    text: 'Productos listos para crear, trabajar y disfrutar con mejor ritmo.',
  },
  {
    icon: 'bi-bag-check-fill',
    title: 'Compra sin fricción',
    text: 'Carrito persistente, checkout protegido y órdenes verificables.',
  },
  {
    icon: 'bi-hdd-network-fill',
    title: 'Comprobantes reales',
    text: 'Descarga tickets PDF generados por Orders.API, no por React.',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="hero-section text-white container py-4 py-lg-5">
        <AuroraBackground className="neo-card shadow-lg">
          <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-light border mb-3">Digital Store</span>
              <h1 className="display-3 fw-bold lh-1 mb-4">Tecnología que acompaña tu ritmo.</h1>
              <p className="lead mb-4 text-white-75">
                Descubre productos para crear, trabajar y disfrutar mejor en una tienda conectada con APIs reales.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link className="btn btn-primary btn-lg px-4 fw-semibold" to="/productos">
                  <i className="bi bi-grid-fill me-2" aria-hidden="true" />
                  Explorar productos
                </Link>
                <Link className="btn btn-outline-primary btn-lg px-4 fw-semibold" to="/login">
                  <i className="bi bi-cart3 me-2" aria-hidden="true" />
                  Iniciar compra
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
        </AuroraBackground>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {benefits.map((benefit) => (
            <div className="col-md-4" key={benefit.title}>
              <SpotlightCard as="article" className="card h-100 border-0 shadow-sm rounded-4 benefit-card">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${benefit.icon}`} aria-hidden="true" />
                  </div>
                  <h2 className="h5 fw-bold">{benefit.title}</h2>
                  <p className="text-secondary mb-0">{benefit.text}</p>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
