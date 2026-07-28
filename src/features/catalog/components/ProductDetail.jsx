import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useBasket } from '../../basket/hooks/useBasket.js'
import RemoteImage from '../../../shared/components/RemoteImage.jsx'
import { getProductImage } from '../../../shared/config/remoteImages.js'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import { savePendingPurchase } from '../../auth/utils/pendingPurchase.js'

function getCategories(category) {
  return Array.isArray(category) ? category : [category].filter(Boolean)
}

export default function ProductDetail({ product }) {
  const { isAuthenticated, isAdmin, isCliente } = useAuth()
  const { addProduct, loading, operationLoading } = useBasket()
  const navigate = useNavigate()
  const price = Number(product.price)
  const categories = getCategories(product.category)

  function handleAddToCart() {
    if (!isAuthenticated) {
      savePendingPurchase({ type: 'add-to-cart', productId: product.id, returnTo: '/productos/' + product.id })
      navigate('/login', { state: { from: { pathname: '/productos/' + product.id } } })
      return
    }
    addProduct(product)
  }

  function handleBuyNow() {
    if (!isAuthenticated) {
      savePendingPurchase({ type: 'buy-now', productId: product.id })
      navigate('/login', { state: { from: { pathname: '/productos/' + product.id } } })
      return
    }
    addProduct(product)
    navigate('/carrito')
  }

  return (
    <article className="card border-0 shadow rounded-4 overflow-hidden product-detail-card">
      <div className="row g-0">
        <div className="col-lg-6 bg-light">
          <RemoteImage
            src={getProductImage(product)}
            alt={`Imagen de ${product.name ?? 'Producto'}`}
            className="product-detail-image"
          />
        </div>
        <div className="col-lg-6">
          <div className="card-body p-4 p-lg-5 h-100 d-flex flex-column">
            {categories.length > 0 ? (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {categories.map((category) => (
                  <span className="badge text-bg-light border text-primary" key={category}>{category}</span>
                ))}
              </div>
            ) : null}
            <h1 className="display-6 fw-bold text-dark mb-3">{product.name}</h1>
            {product.description ? <p className="lead text-secondary">{product.description}</p> : null}
            {Number.isFinite(price) ? <p className="display-6 fw-bold text-primary mt-2">{mxnFormatter.format(price)}</p> : null}
            <div className="d-grid gap-2 mt-auto">
              {isAdmin ? (
                <>
                  <Link className="btn btn-outline-warning btn-lg" to={`/admin/productos/${product.id}/editar`}>
                    <i className="bi bi-pencil me-2" />Editar producto
                  </Link>
                  <Link className="btn btn-outline-secondary btn-lg" to="/admin">
                    <i className="bi bi-shield-lock me-2" />Ir a administración
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" type="button" disabled={loading || operationLoading} onClick={handleAddToCart} aria-label={`Agregar ${product.name} al carrito`}>
                    {operationLoading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Agregando...</>
                    ) : (
                      <><i className="bi bi-cart-plus me-2" />Agregar al carrito</>
                    )}
                  </button>
                  {isCliente && (
                    <button className="btn btn-success btn-lg" type="button" disabled={loading || operationLoading} onClick={handleBuyNow} aria-label={`Comprar ${product.name} ahora`}>
                      <i className="bi bi-lightning me-2" />Comprar ahora
                    </button>
                  )}
                  <Link className="btn btn-outline-primary btn-lg" to="/carrito">
                    <i className="bi bi-cart3 me-2" />Ir al carrito
                  </Link>
                </>
              )}
              <Link className="btn btn-outline-secondary btn-lg" to="/productos">
                <i className="bi bi-arrow-left me-2" />Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
