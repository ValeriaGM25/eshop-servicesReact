import { getStatusLabel } from '../utils/orderFormatters.js'

const STATUS_CLASSES = {
  Pending: 'text-bg-warning text-dark',
  Confirmed: 'text-bg-success',
  Cancelled: 'text-bg-danger',
}

const STATUS_ICONS = {
  Pending: 'bi-hourglass-split',
  Confirmed: 'bi-check-circle-fill',
  Cancelled: 'bi-x-circle-fill',
}

export default function OrderStatusBadge({ status }) {
  const label = status || 'Pending'
  const className = STATUS_CLASSES[label] ?? 'text-bg-secondary'

  return <span className={`badge rounded-pill ${className}`}><i className={`bi ${STATUS_ICONS[label] ?? 'bi-circle'} me-1`} aria-hidden="true" />{getStatusLabel(label)}</span>
}
