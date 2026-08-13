import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'
import { downloadOrderReport, getOrders, updateOrderStatus } from '../../orders/services/orderService.js'
import { formatDateTime, getOrderCustomerId, getOrderId, getOrderSubtotal, getOrderTax, getOrderTotal, triggerPdfDownload } from '../../orders/utils/orderFormatters.js'

const EMPTY_ORDERS_PAGE = {
  items: [],
  page: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 0,
}

export default function AdminOrdersPage() {
  const [ordersPage, setOrdersPage] = useState(EMPTY_ORDERS_PAGE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  async function loadOrders() {
    try {
      setLoading(true)
      setError('')
      const response = await getOrders()
      setOrdersPage({
        items: response.items ?? [],
        page: response.page,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const orders = ordersPage.items ?? []

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const text = `${getOrderId(order)} ${getOrderCustomerId(order)}`.toLowerCase()
    return (!status || order.status === status) && (!search || text.includes(search.trim().toLowerCase()))
  }), [orders, search, status])

  const metrics = useMemo(() => ({
    total: Number(ordersPage.totalItems) || 0,
    pending: orders.filter((o) => o.status === 'Pending').length,
    confirmed: orders.filter((o) => o.status === 'Confirmed').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  }), [orders, ordersPage.totalItems])

  async function handleStatus(orderId, nextStatus) {
    try {
      setActionLoading(`${orderId}-${nextStatus}`)
      setActionError('')
      await updateOrderStatus(orderId, nextStatus)
      await loadOrders()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setActionLoading('')
    }
  }

  async function handleDownload(orderId) {
    try {
      setActionLoading(`${orderId}-pdf`)
      setActionError('')
      const report = await downloadOrderReport(orderId)
      triggerPdfDownload(report.blob, report.filename)
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setActionLoading('')
    }
  }

  return (
    <section>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4"><div><h2 className="h3 fw-bold mb-1">Gestión de órdenes</h2><p className="text-secondary mb-0">Dashboard administrativo conectado a Orders.API.</p></div></div>
      <div className="row g-3 mb-4">{[['Total', metrics.total], ['Pendientes', metrics.pending], ['Confirmadas', metrics.confirmed], ['Canceladas', metrics.cancelled]].map(([label, value]) => <div className="col-6 col-lg-3" key={label}><div className="card neo-card rounded-4"><div className="card-body"><p className="text-secondary mb-1">{label}</p><strong className="h3 text-primary">{value}</strong></div></div></div>)}</div>
      <div className="card neo-card rounded-4 mb-4"><div className="card-body"><div className="row g-3"><div className="col-md-7"><input className="form-control" placeholder="Buscar Order Id o CustomerId" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="col-md-5"><select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option><option value="Pending">Pendientes</option><option value="Confirmed">Confirmadas</option><option value="Cancelled">Canceladas</option></select></div></div></div></div>
      {loading ? <div className="neo-skeleton" /> : null}
      {error && !loading ? <ErrorMessage message={error} onRetry={loadOrders} /> : null}
      {actionError ? <div className="alert alert-danger" role="alert">{actionError}</div> : null}
      {!loading && !error && <div className="table-responsive"><table className="table table-dark table-hover align-middle"><thead><tr><th>Order Id</th><th>CustomerId</th><th>CreatedAt</th><th>Status</th><th>ItemsCount</th><th className="text-end">Subtotal</th><th className="text-end">Tax</th><th className="text-end">Total</th><th>Acciones</th></tr></thead><tbody>{filteredOrders.map((order) => { const orderId = getOrderId(order); return <tr key={orderId}><td className="text-break">{orderId}</td><td className="text-break">{getOrderCustomerId(order)}</td><td>{formatDateTime(order.createdAt ?? order.createdOn)}</td><td><OrderStatusBadge status={order.status} /></td><td>{Number(order.itemsCount) || 0}</td><td className="text-end">{mxnFormatter.format(getOrderSubtotal(order))}</td><td className="text-end">{mxnFormatter.format(getOrderTax(order))}</td><td className="text-end">{mxnFormatter.format(getOrderTotal(order))}</td><td><div className="d-flex flex-wrap gap-2"><Link className="btn btn-sm btn-outline-primary" to={`/ordenes/${encodeURIComponent(orderId)}`}>Detalle</Link>{order.status === 'Pending' ? <><button className="btn btn-sm btn-success" disabled={actionLoading === `${orderId}-Confirmed`} onClick={() => handleStatus(orderId, 'Confirmed')}>Confirmar</button><button className="btn btn-sm btn-outline-danger" disabled={actionLoading === `${orderId}-Cancelled`} onClick={() => handleStatus(orderId, 'Cancelled')}>Cancelar</button></> : null}<button className="btn btn-sm btn-outline-primary" disabled={actionLoading === `${orderId}-pdf`} onClick={() => handleDownload(orderId)}>PDF</button></div></td></tr> })}</tbody></table></div>}
    </section>
  )
}
