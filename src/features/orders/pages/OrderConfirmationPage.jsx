import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AnimatedContent from '../../../components/react-bits/AnimatedContent.jsx'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from '../components/OrderStatusBadge.jsx'
import { getOrderById } from '../services/orderService.js'
import { formatDateTime, getOrderId, getOrderItems, getOrderTotal } from '../utils/orderFormatters.js'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order ?? null)
  const [error, setError] = useState('')
  const displayedOrderId = getOrderId(order) ?? orderId

  useEffect(() => {
    if (order?.createdAt && order?.total !== undefined && order?.status) return
    let ignore = false
    async function loadOrder() {
      try {
        const nextOrder = await getOrderById(orderId)
        if (!ignore) setOrder(nextOrder)
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      }
    }
    loadOrder()
    return () => { ignore = true }
  }, [orderId])

  return (
    <section className="container py-5">
      <AnimatedContent className="card border-0 shadow-lg rounded-4 mx-auto neo-card" style={{ maxWidth: '820px' }}>
        <div className="card-body p-4 p-md-5 text-center">
          <div className="display-1 text-success mb-3" aria-hidden="true">
            <i className="bi bi-check-circle-fill" />
          </div>
          <span className="badge text-bg-success rounded-pill mb-3">Orders.API</span>
          <h1 className="display-6 fw-bold mb-3">Compra confirmada</h1>
          <p className="text-secondary mb-4">Tu orden quedó registrada y puede verificarse directamente en Orders.API.</p>
          {error ? <div className="alert alert-warning py-2" role="alert">{error}</div> : null}

          <dl className="row text-start bg-light rounded-4 p-3 p-md-4 mb-4">
            <dt className="col-sm-4">Orden</dt>
            <dd className="col-sm-8 fw-semibold text-break">{displayedOrderId}</dd>
            <dt className="col-sm-4">Fecha</dt>
            <dd className="col-sm-8">{formatDateTime(order?.createdAt ?? order?.createdOn)}</dd>
            <dt className="col-sm-4">Total</dt>
            <dd className="col-sm-8 fw-bold text-primary">{order ? mxnFormatter.format(getOrderTotal(order)) : 'Consulta el detalle'}</dd>
            <dt className="col-sm-4">Estado</dt>
            <dd className="col-sm-8"><OrderStatusBadge status={order?.status} /></dd>
            <dt className="col-sm-4">Productos</dt>
            <dd className="col-sm-8">{order ? getOrderItems(order).length : 'Consulta el detalle'}</dd>
          </dl>

          <div className="d-grid d-sm-flex justify-content-center gap-2">
            <Link className="btn btn-primary btn-lg" to={`/ordenes/${encodeURIComponent(displayedOrderId)}`}>
              <i className="bi bi-receipt me-2" aria-hidden="true" />
              Ver detalle de la orden
            </Link>
            <Link className="btn btn-outline-secondary btn-lg" to="/productos">
              <i className="bi bi-grid me-2" aria-hidden="true" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </AnimatedContent>
    </section>
  )
}
