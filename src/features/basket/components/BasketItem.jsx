import { mxnFormatter } from '../../../shared/utils/formatters.js'
import { useBasket } from '../hooks/useBasket.js'

export default function BasketItem({ item }) {
  const { decreaseQuantity, increaseQuantity, operationLoading, removeProduct } = useBasket()
  const price = Number(item.price ?? 0)
  const quantity = Number(item.quantity ?? 0)
  const subtotal = price * quantity

  return (
    <article className="card border-0 shadow-sm mb-3 basket-item-card rounded-4 neo-card">
      <div className="card-body p-4">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <div className="basket-item-icon" aria-hidden="true">
              <i className="bi bi-box-seam" />
            </div>
          </div>
          <div className="col-md">
            <h2 className="h5 fw-bold mb-2">{item.productName}</h2>
            <div className="d-flex flex-wrap gap-3 text-secondary small">
              <span>Color: {item.color || 'Sin especificar'}</span>
              <span>Precio unitario: {mxnFormatter.format(price)}</span>
            </div>
          </div>
          <div className="col-md-auto">
            <div className="btn-group" role="group" aria-label={`Controles de cantidad para ${item.productName}`}>
              <button className="btn btn-outline-secondary btn-sm" type="button" disabled={operationLoading} onClick={() => decreaseQuantity(item.productId)} aria-label={`Disminuir cantidad de ${item.productName}`}>
                <i className="bi bi-dash" aria-hidden="true" />
              </button>
              <span className="btn btn-light btn-sm disabled quantity-value">{quantity}</span>
              <button className="btn btn-outline-secondary btn-sm" type="button" disabled={operationLoading} onClick={() => increaseQuantity(item.productId)} aria-label={`Aumentar cantidad de ${item.productName}`}>
                <i className="bi bi-plus" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="col-md-auto text-md-end">
            <p className="small text-secondary mb-1">Subtotal</p>
            <p className="fw-bold text-primary mb-2">{mxnFormatter.format(subtotal)}</p>
            <button className="btn btn-outline-danger btn-sm" type="button" disabled={operationLoading} onClick={() => removeProduct(item.productId)} aria-label={`Eliminar ${item.productName} del carrito`}>
              <i className="bi bi-trash me-1" aria-hidden="true" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
