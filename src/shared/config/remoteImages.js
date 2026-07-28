export const productRemoteImages = {
  'laptop pro 14': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'mouse inalámbrico': 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  'teclado mecánico rgb': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
  'monitor 27 pulgadas': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  'audífonos bluetooth': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'webcam full hd': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=900&q=80',
  'disco ssd 1tb': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80',
  'silla gamer ergonómica': 'https://images.unsplash.com/photo-1612011213721-3936d387f318?auto=format&fit=crop&w=900&q=80',
}

export const heroRemoteImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'

export const fallbackRemoteImage = 'https://placehold.co/900x600/e9ecef/6c757d?text=Imagen+no+disponible'

function normalizeProductName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

function isUsableHttpImageUrl(value) {
  if (!value || typeof value !== 'string') {
    return false
  }

  try {
    const url = new URL(value)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isExample = url.hostname.toLowerCase().includes('example.com')

    return isHttp && !isExample
  } catch {
    return false
  }
}

const normalizedProductRemoteImages = Object.fromEntries(
  Object.entries(productRemoteImages).map(([name, imageUrl]) => [normalizeProductName(name), imageUrl]),
)

export function getProductImage(product) {
  if (isUsableHttpImageUrl(product?.imageFiles)) {
    return product.imageFiles
  }

  const normalizedName = normalizeProductName(product?.name)

  return normalizedProductRemoteImages[normalizedName] ?? fallbackRemoteImage
}
