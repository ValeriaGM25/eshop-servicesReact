import { authenticatedFetch } from '../../auth/services/authenticatedFetch.js'

const basketApiUrl = import.meta.env.VITE_BASKET_API_URL

function getUrl(path = '') {
  if (!basketApiUrl) throw new Error('VITE_BASKET_API_URL no esta configurada.')
  return `${basketApiUrl}${path}`
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

function getBasketErrorMessage(response, action) {
  if (response.status === 400) return 'No fue posible guardar el carrito porque los datos enviados no son válidos.'
  if (response.status === 401) return 'La sesión venció. Inicia sesión nuevamente.'
  if (response.status === 403) return 'Tu cuenta no tiene permiso para utilizar el carrito.'
  if (response.status >= 500) return 'No fue posible guardar el carrito. Intenta nuevamente.'
  if (action === 'consultar') return 'No fue posible consultar el carrito.'
  if (action === 'vaciar') return 'No fue posible vaciar el carrito.'
  return 'No fue posible guardar el carrito.'
}

function normalizeRequestError(error) {
  if (error?.message?.includes('fetch') || error instanceof TypeError) {
    return new Error('No fue posible conectar con Basket.API.')
  }
  return error
}

export async function getBasket() {
  let response
  try {
    response = await authenticatedFetch(getUrl('/basket'))
  } catch (error) {
    throw normalizeRequestError(error)
  }

  if (response.status === 404) return null

  const data = await readJson(response)
  if (!response.ok) {
    throw new Error(getBasketErrorMessage(response, 'consultar'))
  }
  return data?.cart ?? null
}

export async function storeBasket(cart) {
  let response
  try {
    response = await authenticatedFetch(getUrl('/basket'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    })
  } catch (error) {
    throw normalizeRequestError(error)
  }
  const data = await readJson(response)
  if (!response.ok) {
    throw new Error(getBasketErrorMessage(response, 'guardar'))
  }
  return data?.cart ?? data ?? null
}

export async function deleteBasket() {
  let response
  try {
    response = await authenticatedFetch(getUrl('/basket'), {
      method: 'DELETE',
    })
  } catch (error) {
    throw normalizeRequestError(error)
  }

  if (response.status === 404) return { isSuccess: true }

  if (!response.ok) {
    throw new Error(getBasketErrorMessage(response, 'vaciar'))
  }
  return { isSuccess: true }
}
