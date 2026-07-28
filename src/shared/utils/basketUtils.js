export function createEmptyBasket() {
  return {
    items: [],
    totalPrice: 0,
  }
}

export function calculateBasketTotal(items) {
  return (items ?? []).reduce(
    (total, item) => total + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  )
}

export function calculateBasketItemCount(items) {
  return (items ?? []).reduce((total, item) => total + Number(item.quantity ?? 0), 0)
}

export function normalizeBasket(cart) {
  if (!cart) return createEmptyBasket()

  const items = Array.isArray(cart.items) ? cart.items : []
  const hasValidTotalPrice = typeof cart.totalPrice === 'number' && Number.isFinite(cart.totalPrice)

  return {
    ...cart,
    items,
    totalPrice: hasValidTotalPrice ? cart.totalPrice : calculateBasketTotal(items),
  }
}

export function mapProductToBasketItem(product) {
  const price = Number(product?.price)

  if (!product?.id || typeof product.id !== 'string') {
    throw new Error('No fue posible agregar el producto: el id del producto no es valido.')
  }

  if (!product?.name || typeof product.name !== 'string' || product.name.trim() === '') {
    throw new Error('No fue posible agregar el producto: el nombre del producto no es valido.')
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('No fue posible agregar el producto: el precio del producto no es valido.')
  }

  return {
    quantity: 1,
    color: 'Sin especificar',
    price,
    productId: product.id,
    productName: product.name,
  }
}

export function addOrIncreaseItem(items, itemToAdd) {
  const currentItems = Array.isArray(items) ? items : []
  const existingItem = currentItems.find((item) => item.productId === itemToAdd.productId)

  if (!existingItem) {
    return [...currentItems, itemToAdd]
  }

  return currentItems.map((item) =>
    item.productId === itemToAdd.productId
      ? { ...item, quantity: Number(item.quantity ?? 0) + 1 }
      : item,
  )
}

export function increaseItemQuantity(items, productId) {
  return (items ?? []).map((item) =>
    item.productId === productId ? { ...item, quantity: Number(item.quantity ?? 0) + 1 } : item,
  )
}

export function decreaseItemQuantity(items, productId) {
  return (items ?? [])
    .map((item) =>
      item.productId === productId ? { ...item, quantity: Number(item.quantity ?? 0) - 1 } : item,
    )
    .filter((item) => Number(item.quantity ?? 0) > 0)
}

export function removeBasketItem(items, productId) {
  return (items ?? []).filter((item) => item.productId !== productId)
}
