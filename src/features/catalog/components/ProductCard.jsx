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

export default function ProductCard({ product }) {
  const { isAuthenticated, isAdmin, isCliente } = useAuth()
  const { addProduct, loading, operationLoading } = useBasket()
  const navigate = useNavigate()
  const categories = getCategories(product.category)
  const price = Number(product.price)

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
    <article className="card h-100 border-0 shadow-sm product-card rounded-4 overflow-hidden">
      <div className="product-image-wrapper bg-light">
        <RemoteImage
          src={getProductImage(product)}
          alt={`Imagen de ${product.name ?? 'Producto'}`}
          className="card-img-top product-image"
        />
      </div>
      <div className="card-body d-flex flex-column p-4">
        {categories.length > 0 ? (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <span className="badge text-bg-light border text-primary" key={category}>{category}</span>
            ))}
          </div>
        ) : null}
        <h2 className="h5 fw-bold text-dark">{product.name ?? 'Producto sin nombre disponible'}</h2>
        {product.description ? <p className="product-description text-secondary flex-grow-1">{product.description}</p> : null}
        {Number.isFinite(price) ? <p className="fs-4 fw-bold text-primary mb-0">{mxnFormatter.format(price)}</p> : null}
      </div>
      <div className="card-footer bg-transparent border-0 p-4 pt-0 mt-auto">
        <div className="d-grid gap-2">
          <Link className="btn btn-outline-primary" to={`/productos/${product.id}`}>
            <i className="bi bi-eye me-2" />Ver detalle
          </Link>
          {isAdmin ? (
            <>
              <Link className="btn btn-outline-warning" to={`/admin/productos/${product.id}/editar`}>
                <i className="bi bi-pencil me-2" />Editar producto
              </Link>
              <Link className="btn btn-outline-secondary" to="/admin">
                <i className="bi bi-shield-lock me-2" />Administración
              </Link>
            </>
          ) : (
            <>
              <button className="btn btn-primary" type="button" disabled={loading || operationLoading} onClick={handleAddToCart} aria-label={`Agregar ${product.name} al carrito`}>
                {operationLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Agregando...</>
                ) : (
                  <><i className="bi bi-cart-plus me-2" />Agregar al carrito</>
                )}
              </button>
              {isCliente && (
                <button className="btn btn-success" type="button" disabled={loading || operationLoading} onClick={handleBuyNow} aria-label={`Comprar ${product.name} ahora`}>
                  <i className="bi bi-lightning me-2" />Comprar ahora
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}
