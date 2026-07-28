import { authenticatedFetch } from '../../auth/services/authenticatedFetch.js'

const catalogApiUrl = import.meta.env.VITE_CATALOG_API_URL

function getUrl(path) {
  if (!catalogApiUrl) throw new Error('VITE_CATALOG_API_URL no esta configurada.')
  return `${catalogApiUrl}${path}`
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

export async function createProduct(product) {
  const response = await authenticatedFetch(getUrl('/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (response.status === 201) {
    const data = await readJson(response)
    return data ?? null
  }
  const data = await readJson(response)
  throw new Error(data?.detail ?? data?.title ?? 'No fue posible crear el producto.')
}

export async function updateProduct(id, product) {
  const response = await authenticatedFetch(getUrl(`/products/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (response.ok) {
    const data = await readJson(response)
    return data ?? null
  }
  if (response.status === 404) throw new Error('Producto no encontrado.')
  const data = await readJson(response)
  throw new Error(data?.detail ?? data?.title ?? 'No fue posible actualizar el producto.')
}

export async function deleteProduct(id) {
  const response = await authenticatedFetch(getUrl(`/products/${encodeURIComponent(id)}`), {
    method: 'DELETE',
  })
  if (response.ok || response.status === 404) return
  const data = await readJson(response)
  throw new Error(data?.detail ?? data?.title ?? 'No fue posible eliminar el producto.')
}
