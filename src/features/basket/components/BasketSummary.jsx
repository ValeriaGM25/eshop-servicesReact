import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { createOrder, resolveOrderId } from '../../orders/services/orderService.js'
import { useBasket } from '../hooks/useBasket.js'

function createIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function BasketSummary() {
  const { clearBasket, fetchBasket, operationLoading, totalItems, totalPrice } = useBasket()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const checkoutInProgressRef = useRef(false)
  const idempotencyKeyRef = useRef(null)

  function handleClearBasket() {
    const confirmed = window.confirm('¿Quieres vaciar el carrito?')

    if (confirmed) {
      clearBasket()
    }
  }

  async function handleCheckout() {
    if (checkoutLoading || checkoutInProgressRef.current || operationLoading || totalItems === 0) return

    const customerId = user?.id
    if (!customerId) {
      setCheckoutError('No fue posible identificar tu sesión para crear la orden. Cierra sesión e inicia nuevamente.')
      return
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = createIdempotencyKey()
    }

    try {
      checkoutInProgressRef.current = true
      setCheckoutLoading(true)
      setCheckoutError('')
      const order = await createOrder({
        idempotencyKey: idempotencyKeyRef.current,
        customerId,
        basketId: 'compat-exam',
      })
      const orderId = resolveOrderId(order)
      await fetchBasket()
      idempotencyKeyRef.current = null
      navigate(`/compra/confirmacion/${encodeURIComponent(orderId)}`, { state: { order } })
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      checkoutInProgressRef.current = false
      setCheckoutLoading(false)
    }
  }

  return (
    <aside className="card border-0 shadow-sm basket-summary rounded-4 neo-card">
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
        <div className="d-flex justify-content-between mb-3">
          <span className="text-secondary">Impuestos</span>
          <strong>{mxnFormatter.format(0)}</strong>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="h5 fw-bold mb-0">Total</span>
          <strong className="h4 text-primary mb-0">{mxnFormatter.format(totalPrice)}</strong>
        </div>
        {checkoutError ? <div className="alert alert-danger py-2" role="alert">{checkoutError}</div> : null}
        <button className="btn btn-success btn-lg w-100 mb-3" type="button" disabled={operationLoading || checkoutLoading || totalItems === 0} onClick={handleCheckout} aria-label="Realizar compra">
          {checkoutLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Procesando compra...</>
          ) : (
            <><i className="bi bi-bag-check me-2" aria-hidden="true" />Realizar compra</>
          )}
        </button>
        <button className="btn btn-outline-danger w-100" type="button" disabled={operationLoading || checkoutLoading || totalItems === 0} onClick={handleClearBasket} aria-label="Vaciar carrito">
          <i className="bi bi-trash me-2" aria-hidden="true" />
          Vaciar carrito
        </button>
      </div>
    </aside>
  )
}
