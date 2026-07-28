const catalogApiUrl = import.meta.env.VITE_CATALOG_API_URL

function getCatalogApiUrl() {
  if (!catalogApiUrl) {
    throw new Error('VITE_CATALOG_API_URL no esta configurada.')
  }

  return catalogApiUrl
}

async function requestCatalog(url) {
  try {
    return await fetch(url)
  } catch {
    throw new Error('No fue posible conectar con Catalog.API. Verifica que el servicio este encendido.')
  }
}

async function readJsonResponse(response, fallbackMessage) {
  try {
    return await response.json()
  } catch {
    throw new Error(fallbackMessage)
  }
}

function buildProductsUrl(pageNumber, pageSize, search) {
  const url = new URL(`${getCatalogApiUrl()}/products`)
  url.searchParams.set('pageNumber', pageNumber)
  url.searchParams.set('pageSize', pageSize)

  if (search) {
    url.searchParams.set('search', search)
  }

  return url.toString()
}

export async function getProducts(pageNumber = 1, pageSize = 10, search = '') {
  const response = await requestCatalog(buildProductsUrl(pageNumber, pageSize, search))

  if (!response.ok) {
    throw new Error(`No fue posible consultar los productos. Codigo HTTP: ${response.status}`)
  }

  const payload = await readJsonResponse(
    response,
    'Catalog.API devolvio una respuesta JSON invalida para el catalogo.',
  )

  if (!payload?.products) {
    throw new Error('La respuesta de Catalog.API no contiene la pagina de productos esperada.')
  }

  return payload.products
}

export async function getProductById(id) {
  if (!id) {
    throw new Error('El id del producto no es valido.')
  }

  const response = await requestCatalog(`${getCatalogApiUrl()}/products/${encodeURIComponent(id)}`)

  if (response.status === 404) {
    throw new Error('Producto no encontrado.')
  }

  if (!response.ok) {
    throw new Error(`No fue posible consultar el producto. Codigo HTTP: ${response.status}`)
  }

  const payload = await readJsonResponse(
    response,
    'Catalog.API devolvio una respuesta JSON invalida para el producto.',
  )

  return payload?.product ?? payload
}
