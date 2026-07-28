import { mxnFormatter } from '../../../shared/utils/formatters.js'
import { useBasket } from '../hooks/useBasket.js'

export default function BasketSummary() {
  const { clearBasket, operationLoading, totalItems, totalPrice } = useBasket()

  function handleClearBasket() {
    const confirmed = window.confirm('¿Quieres vaciar el carrito?')

    if (confirmed) {
      clearBasket()
    }
  }

  return (
    <aside className="card border-0 shadow-sm basket-summary rounded-4">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-4">Resumen</h2>
        <div className="d-flex justify-content-between mb-3">
          <span className="text-secondary">Total de artículos</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span className="text-secondary">Subtotal</span>
          <strong>{mxnFormatter.format(totalPrice)}</strong>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="h5 fw-bold mb-0">Total</span>
          <strong className="h4 text-primary mb-0">{mxnFormatter.format(totalPrice)}</strong>
        </div>
        <button className="btn btn-outline-danger w-100" type="button" disabled={operationLoading || totalItems === 0} onClick={handleClearBasket} aria-label="Vaciar carrito">
          <i className="bi bi-trash me-2" aria-hidden="true" />
          Vaciar carrito
        </button>
      </div>
    </aside>
  )
}
