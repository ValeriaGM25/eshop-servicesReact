import { Link } from 'react-router-dom'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import BasketItem from '../components/BasketItem.jsx'
import BasketSummary from '../components/BasketSummary.jsx'
import { useBasket } from '../hooks/useBasket.js'

export default function BasketPage() {
  const { error, items, loading, totalItems } = useBasket()

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border rounded-pill mb-3">
            <i className="bi bi-cart3 me-1" aria-hidden="true" />
            Basket.API
          </span>
          <h1 className="display-5 fw-bold mb-0">Carrito de compra</h1>
        </div>
        <span className="badge rounded-pill text-bg-light border text-primary fs-6 px-3 py-2">
          {totalItems} artículos
        </span>
      </div>

      {loading ? <LoadingMessage>Cargando carrito...</LoadingMessage> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && items.length === 0 ? (
        <div className="empty-state text-center neo-card rounded-4 shadow-sm p-5">
          <i className="bi bi-cart-x display-1 text-primary" aria-hidden="true" />
          <h2 className="h3 fw-bold mt-3">Tu carrito está vacío.</h2>
          <p className="text-secondary mb-4">Explora el catálogo y agrega productos para comenzar.</p>
          <Link className="btn btn-primary btn-lg" to="/productos">
            <i className="bi bi-grid me-2" aria-hidden="true" />
            Explorar catálogo
          </Link>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="row g-4 align-items-start">
          <div className="col-lg-8" aria-label="Productos en el carrito">
            {items.map((item) => (
              <BasketItem key={item.productId} item={item} />
            ))}
          </div>
          <div className="col-lg-4">
            <BasketSummary />
          </div>
        </div>
      ) : null}
    </section>
  )
}
