import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import { mxnFormatter } from '../../../shared/utils/formatters.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import OrderStatusBadge from '../components/OrderStatusBadge.jsx'
import { downloadOrderReport, getOrdersByCustomer } from '../services/orderService.js'
import { formatDateTime, getCustomerIdFromUser, getOrderId, getOrderItems, getOrderTotal, triggerPdfDownload } from '../utils/orderFormatters.js'

const filters = [
  { value: '', label: 'Todas' },
  { value: 'Pending', label: 'Pendientes' },
  { value: 'Confirmed', label: 'Confirmadas' },
  { value: 'Cancelled', label: 'Canceladas' },
]

export default function MyOrdersPage() {
  const { user } = useAuth()
  const customerId = getCustomerIdFromUser(user)
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingId, setDownloadingId] = useState('')

  useEffect(() => {
    let ignore = false
    async function loadOrders() {
      if (!customerId) {
        setLoading(false)
        setError('No fue posible identificar tu CustomerId desde la sesión actual.')
        return
      }
      try {
        setLoading(true)
        setError('')
        const nextOrders = await getOrdersByCustomer(customerId)
        if (!ignore) setOrders(Array.isArray(nextOrders) ? nextOrders : [])
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadOrders()
    return () => { ignore = true }
  }, [customerId])

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const id = String(getOrderId(order) ?? '').toLowerCase()
    const matchesStatus = !status || order.status === status
    const matchesSearch = !search || id.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  }), [orders, search, status])

  async function handleDownload(orderId) {
    try {
      setDownloadingId(orderId)
      const report = await downloadOrderReport(orderId)
      triggerPdfDownload(report.blob, report.filename)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDownloadingId('')
    }
  }

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border rounded-pill mb-3">Orders.API</span>
          <h1 className="display-5 fw-bold mb-2">Mis compras</h1>
          <p className="text-secondary mb-0">Consulta órdenes reales asociadas a tu CustomerId.</p>
        </div>
      </div>

      <div className="card neo-card rounded-4 mb-4"><div className="card-body p-3 p-md-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-7"><label className="form-label" htmlFor="orderSearch">Buscar por Order Id</label><input id="orderSearch" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="col-md-5"><label className="form-label" htmlFor="statusFilter">Estado</label><select id="statusFilter" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>{filters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}</select></div>
        </div>
      </div></div>

      {loading ? <div className="neo-skeleton" /> : null}
      {error && !loading ? <ErrorMessage message={error} /> : null}
      {!loading && !error && filteredOrders.length === 0 ? <div className="empty-state neo-card rounded-4 p-5 text-center"><i className="bi bi-bag-x display-3 text-primary" /><h2 className="h4 mt-3">No encontramos compras con estos filtros.</h2></div> : null}
      <div className="row g-3">
        {!loading && !error && filteredOrders.map((order) => {
          const orderId = getOrderId(order)
          return <div className="col-lg-6" key={orderId}><article className="card neo-card rounded-4 h-100"><div className="card-body p-4"><div className="d-flex justify-content-between gap-3 mb-3"><div><p className="small text-secondary mb-1">Order Id</p><h2 className="h5 text-break">{orderId}</h2></div><OrderStatusBadge status={order.status} /></div><p className="text-secondary mb-2">{formatDateTime(order.createdAt ?? order.createdOn)}</p><div className="d-flex justify-content-between mb-2"><span>Productos</span><strong>{getOrderItems(order).length}</strong></div><div className="d-flex justify-content-between mb-4"><span>Total</span><strong className="text-primary">{mxnFormatter.format(getOrderTotal(order))}</strong></div><div className="d-flex flex-column flex-sm-row gap-2"><Link className="btn btn-primary" to={`/ordenes/${encodeURIComponent(orderId)}`}>Ver detalle</Link><button className="btn btn-outline-primary" type="button" disabled={downloadingId === orderId} onClick={() => handleDownload(orderId)}>{downloadingId === orderId ? 'Descargando...' : 'Descargar PDF'}</button></div></div></article></div>
        })}
      </div>
    </section>
  )
}
