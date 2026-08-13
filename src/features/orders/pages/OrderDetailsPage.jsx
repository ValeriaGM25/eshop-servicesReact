import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from '../components/OrderStatusBadge.jsx'
import { downloadOrderReport, getOrderById } from '../services/orderService.js'
import { formatDateTime, getLineTotal, getOrderCustomerId, getOrderId, getOrderItems, getOrderSubtotal, getOrderTax, getOrderTotal, triggerPdfDownload } from '../utils/orderFormatters.js'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadOrder() {
      try {
        setLoading(true)
        setError('')
        const nextOrder = await getOrderById(id)
        if (!ignore) setOrder(nextOrder)
      } catch (requestError) {
        if (!ignore) {
          setOrder(null)
          setError(requestError.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadOrder()
    return () => { ignore = true }
  }, [id])

  async function handleDownloadReport() {
    try {
      setDownloadLoading(true)
      setDownloadError('')
      const report = await downloadOrderReport(id)
      triggerPdfDownload(report.blob, report.filename)
    } catch (requestError) {
      setDownloadError(requestError.message)
    } finally {
      setDownloadLoading(false)
    }
  }

  const items = getOrderItems(order)

  return (
    <section className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Catálogo</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Orden</li>
        </ol>
      </nav>

      {loading ? <LoadingMessage>Cargando orden...</LoadingMessage> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && order ? (
        <>
          <div className="d-flex flex-column flex-lg-row align-items-lg-start justify-content-between gap-3 mb-4">
            <div>
              <span className="badge text-bg-light border rounded-pill mb-3">Orders.API</span>
              <h1 className="display-6 fw-bold mb-2">Orden de compra</h1>
              <p className="text-secondary text-break mb-0">{getOrderId(order)}</p>
            </div>
            <button className="btn btn-outline-primary btn-lg" type="button" disabled={downloadLoading} onClick={handleDownloadReport}>
              {downloadLoading ? (
                <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Descargando...</>
              ) : (
                <><i className="bi bi-file-earmark-pdf me-2" aria-hidden="true" />Descargar comprobante PDF</>
              )}
            </button>
          </div>

          {downloadError ? <div className="alert alert-danger" role="alert">{downloadError}</div> : null}

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100 neo-card">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Información general</h2>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Id de orden</dt>
                    <dd className="col-sm-8 text-break">{getOrderId(order)}</dd>
                    <dt className="col-sm-4">CustomerId</dt>
                    <dd className="col-sm-8 text-break">{getOrderCustomerId(order)}</dd>
                    <dt className="col-sm-4">Fecha</dt>
                    <dd className="col-sm-8">{formatDateTime(order.createdAt ?? order.createdOn)}</dd>
                    <dt className="col-sm-4">Estado</dt>
                    <dd className="col-sm-8"><OrderStatusBadge status={order.status} /></dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 neo-card">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3">Resumen financiero</h2>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>{mxnFormatter.format(getOrderSubtotal(order))}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax</span>
                    <strong>{mxnFormatter.format(getOrderTax(order))}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0">Total</span>
                    <strong className="h4 text-primary mb-0">{mxnFormatter.format(getOrderTotal(order))}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 neo-card">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-3">Productos</h2>
              <div className="table-responsive order-desktop-table">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">ProductId</th>
                      <th scope="col" className="text-end">Cantidad</th>
                      <th scope="col" className="text-end">UnitPrice</th>
                      <th scope="col" className="text-end">LineTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const productId = item.productId ?? item.productID ?? item.id ?? `item-${index}`
                      const productName = item.productName ?? item.name ?? 'Producto'
                      const quantity = Number(item.quantity ?? 0)
                      const unitPrice = Number(item.unitPrice ?? item.price ?? 0)
                      return (
                        <tr key={`${productId}-${index}`}>
                          <td className="fw-semibold">{productName}</td>
                          <td className="text-break small text-secondary">{productId}</td>
                          <td className="text-end">{quantity}</td>
                          <td className="text-end">{mxnFormatter.format(unitPrice)}</td>
                          <td className="text-end fw-semibold">{mxnFormatter.format(getLineTotal(item))}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="order-mobile-card">
                {items.map((item, index) => {
                  const productId = item.productId ?? item.productID ?? item.id ?? `item-${index}`
                  const productName = item.productName ?? item.name ?? 'Producto'
                  const quantity = Number(item.quantity ?? 0)
                  const unitPrice = Number(item.unitPrice ?? item.price ?? 0)
                  return (
                    <article className="border rounded-4 p-3 mb-3" key={`${productId}-mobile-${index}`}>
                      <h3 className="h6 fw-bold mb-1">{productName}</h3>
                      <p className="small text-secondary text-break mb-3">{productId}</p>
                      <div className="d-flex justify-content-between"><span>Cantidad</span><strong>{quantity}</strong></div>
                      <div className="d-flex justify-content-between"><span>UnitPrice</span><strong>{mxnFormatter.format(unitPrice)}</strong></div>
                      <div className="d-flex justify-content-between"><span>LineTotal</span><strong>{mxnFormatter.format(getLineTotal(item))}</strong></div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
