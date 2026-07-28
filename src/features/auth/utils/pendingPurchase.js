const PENDING_KEY = 'eshop_pending_purchase'

export function savePendingPurchase({ type, productId }) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ type, productId }))
  } catch {
  }
}

export function getPendingPurchase() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPendingPurchase() {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
  }
}
