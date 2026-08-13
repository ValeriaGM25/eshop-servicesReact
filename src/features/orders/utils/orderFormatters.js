export function getOrderId(order) {
  return order?.id ?? order?.orderId ?? order?.orderID
}

export function getOrderItems(order) {
  return order?.items ?? order?.orderItems ?? order?.products ?? []
}

export function getCustomerIdFromUser(user) {
  return user?.customerId ?? user?.customerID ?? user?.id ?? user?.userId ?? user?.sub ?? user?.nameIdentifier ?? null
}

export function getOrderCustomerId(order) {
  return order?.customerId ?? order?.customerID ?? order?.userId ?? 'No disponible'
}

export function getOrderSubtotal(order) {
  return Number(order?.subtotal ?? order?.subTotal ?? order?.totalPrice ?? 0)
}

export function getOrderTax(order) {
  return Number(order?.tax ?? order?.taxTotal ?? 0)
}

export function getOrderTotal(order) {
  return Number(order?.total ?? order?.grandTotal ?? order?.totalPrice ?? getOrderSubtotal(order) + getOrderTax(order))
}

export function getLineTotal(item) {
  const value = item?.lineTotal ?? item?.total
  if (value !== undefined && value !== null) return Number(value)
  return Number(item?.unitPrice ?? item?.price ?? 0) * Number(item?.quantity ?? 0)
}

export function formatDateTime(value) {
  if (!value) return 'No disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function getStatusLabel(status) {
  if (status === 'Pending') return 'Pendiente'
  if (status === 'Confirmed') return 'Confirmada'
  if (status === 'Cancelled') return 'Cancelada'
  return status || 'Pendiente'
}

export function triggerPdfDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
