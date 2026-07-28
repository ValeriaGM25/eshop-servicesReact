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

export async function getBasket() {
  const response = await authenticatedFetch(getUrl('/basket'))

  if (response.status === 404) return null

  const data = await readJson(response)
  if (!response.ok) {
    throw new Error('No fue posible consultar el carrito.')
  }
  return data?.cart ?? null
}

export async function storeBasket(cart) {
  const response = await authenticatedFetch(getUrl('/basket'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart }),
  })
  const data = await readJson(response)
  if (!response.ok) {
    throw new Error('No fue posible guardar el carrito.')
  }
  return data?.cart ?? null
}

export async function deleteBasket() {
  const response = await authenticatedFetch(getUrl('/basket'), {
    method: 'DELETE',
  })

  if (response.status === 404) return { isSuccess: true }

  if (!response.ok) {
    throw new Error('No fue posible vaciar el carrito.')
  }
  return { isSuccess: true }
}
