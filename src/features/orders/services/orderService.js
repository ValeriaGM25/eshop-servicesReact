import { authenticatedFetch } from '../../auth/services/authenticatedFetch.js'

const ordersApiUrl = import.meta.env.VITE_ORDERS_API_URL

function getUrl(path = '') {
  if (!ordersApiUrl) throw new Error('VITE_ORDERS_API_URL no esta configurada.')
  return `${ordersApiUrl}${path}`
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

function normalizeOrderResponse(data) {
  return data?.order ?? data
}

function getOrderId(order) {
  return order?.id ?? order?.orderId ?? order?.orderID
}

function getOrdersErrorMessage(response, action) {
  if (response.status === 400) return 'No fue posible crear la orden porque los datos son inválidos o el carrito está vacío.'
  if (response.status === 401) return 'La sesión venció. Inicia sesión nuevamente.'
  if (response.status === 403) return 'Tu cuenta no tiene permiso para consultar órdenes.'
  if (response.status === 404) return 'La orden solicitada no existe.'
  if (response.status === 409) return 'No fue posible completar la operación por un conflicto con el estado actual.'
  if (response.status >= 500) return 'Orders.API tiene un problema temporal. Intenta nuevamente.'
  if (action === 'reporte') return 'No fue posible descargar el reporte de la orden.'
  if (action === 'consultar') return 'No fue posible consultar la orden.'
  return 'No fue posible crear la orden.'
}

function normalizeRequestError(error) {
  if (error?.message?.includes('fetch') || error instanceof TypeError) {
    return new Error('No fue posible conectar con Orders.API.')
  }
  return error
}

function getFilenameFromDisposition(disposition) {
  if (!disposition) return 'orden.pdf'
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/"/g, ''))
  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i)
  return filenameMatch?.[1] ?? 'orden.pdf'
}

export async function createOrder({ idempotencyKey, customerId, basketId = 'compat-exam' }) {
  if (!customerId) {
    throw new Error('No fue posible identificar tu sesión para crear la orden. Cierra sesión e inicia nuevamente.')
  }

  let response
  try {
    response = await authenticatedFetch(getUrl('/api/orders'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ customerId, basketId }),
    })
  } catch (error) {
    throw normalizeRequestError(error)
  }

  const data = await readJson(response)
  if (response.status !== 201) {
    throw new Error(getOrdersErrorMessage(response, 'crear'))
  }

  const order = normalizeOrderResponse(data)
  if (!getOrderId(order)) throw new Error('Orders.API no devolvió el identificador de la orden creada.')
  return order
}

export async function getOrderById(id) {
  let response
  try {
    response = await authenticatedFetch(getUrl(`/api/orders/${encodeURIComponent(id)}`))
  } catch (error) {
    throw normalizeRequestError(error)
  }

  const data = await readJson(response)
  if (!response.ok) throw new Error(getOrdersErrorMessage(response, 'consultar'))
  return normalizeOrderResponse(data)
}

export async function getOrdersByCustomer(customerId) {
  let response
  try {
    response = await authenticatedFetch(getUrl(`/api/orders/customer/${encodeURIComponent(customerId)}`))
  } catch (error) {
    throw normalizeRequestError(error)
  }

  const data = await readJson(response)
  if (!response.ok) throw new Error(getOrdersErrorMessage(response, 'consultar'))
  return data?.orders ?? data ?? []
}

export async function getOrders() {
  let response
  try {
    response = await authenticatedFetch(getUrl('/api/orders'))
  } catch (error) {
    throw normalizeRequestError(error)
  }

  const data = await readJson(response)
  if (!response.ok) throw new Error(getOrdersErrorMessage(response, 'consultar'))
  return {
    items: data?.items ?? [],
    page: data?.page,
    pageSize: data?.pageSize,
    totalItems: data?.totalItems,
    totalPages: data?.totalPages,
  }
}

export async function updateOrderStatus(id, status) {
  let response
  try {
    response = await authenticatedFetch(getUrl(`/api/orders/${encodeURIComponent(id)}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  } catch (error) {
    throw normalizeRequestError(error)
  }

  const data = await readJson(response)
  if (!response.ok) throw new Error(getOrdersErrorMessage(response, 'actualizar'))
  return normalizeOrderResponse(data)
}

export async function downloadOrderReport(id) {
  let response
  try {
    response = await authenticatedFetch(getUrl(`/api/orders/${encodeURIComponent(id)}/report`))
  } catch (error) {
    throw normalizeRequestError(error)
  }

  if (!response.ok) throw new Error(getOrdersErrorMessage(response, 'reporte'))

  const contentType = response.headers?.get('Content-Type') ?? ''
  if (!contentType.toLowerCase().includes('application/pdf')) {
    throw new Error('Orders.API no devolvió un archivo PDF válido.')
  }

  const blob = await response.blob()
  return {
    blob,
    filename: getFilenameFromDisposition(response.headers?.get('Content-Disposition')),
  }
}

export function resolveOrderId(order) {
  return getOrderId(order)
}
