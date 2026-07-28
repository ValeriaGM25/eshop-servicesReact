import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import {
  addOrIncreaseItem,
  calculateBasketItemCount,
  createEmptyBasket,
  decreaseItemQuantity,
  increaseItemQuantity,
  mapProductToBasketItem,
  normalizeBasket,
  removeBasketItem,
} from '../../../shared/utils/basketUtils.js'
import { deleteBasket, getBasket, storeBasket } from '../services/basketService.js'
import { BasketContext } from './BasketContext.jsx'

const EMPTY = createEmptyBasket()

export function BasketProvider({ children }) {
  const { isAuthenticated, isCliente, user } = useAuth()
  const [basket, setBasket] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [error, setError] = useState('')
  const operationInProgressRef = useRef(false)
  const prevUserKeyRef = useRef(null)

  async function fetchBasket() {
    try {
      setLoading(true)
      setError('')
      const cart = await getBasket()
      setBasket(normalizeBasket(cart))
    } catch (requestError) {
      setError(requestError.message)
      setBasket(EMPTY)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setBasket(EMPTY)
      setLoading(false)
      prevUserKeyRef.current = null
      return
    }

    if (!isCliente) {
      setBasket(EMPTY)
      setLoading(false)
      prevUserKeyRef.current = null
      return
    }

    const userKey = user?.email || user?.name || ''
    if (prevUserKeyRef.current !== null && prevUserKeyRef.current !== userKey) {
      setBasket(EMPTY)
      prevUserKeyRef.current = userKey
      fetchBasket()
      return
    }
    prevUserKeyRef.current = userKey
    fetchBasket()
  }, [isAuthenticated, isCliente, user])

  async function runBasketOperation(operation) {
    if (loading || operationLoading || operationInProgressRef.current) return false
    try {
      operationInProgressRef.current = true
      setOperationLoading(true)
      setError('')
      await operation()
      return true
    } catch (operationError) {
      setError(operationError.message)
      return false
    } finally {
      operationInProgressRef.current = false
      setOperationLoading(false)
    }
  }

  async function persistItemsOrDelete(items) {
    if (items.length === 0) {
      await deleteBasket()
      setBasket(EMPTY)
      return
    }
    const storedCart = await storeBasket({ items })
    if (!storedCart) {
      throw new Error('Basket.API no devolvio el carrito guardado.')
    }
    setBasket(normalizeBasket(storedCart))
  }

  async function addProduct(product) {
    let itemToAdd
    try {
      itemToAdd = mapProductToBasketItem(product)
    } catch (validationError) {
      setError(validationError.message)
      return false
    }
    return runBasketOperation(async () => {
      await persistItemsOrDelete(addOrIncreaseItem(basket.items, itemToAdd))
    })
  }

  async function increaseQuantity(productId) {
    return runBasketOperation(async () => {
      await persistItemsOrDelete(increaseItemQuantity(basket.items, productId))
    })
  }

  async function decreaseQuantity(productId) {
    return runBasketOperation(async () => {
      await persistItemsOrDelete(decreaseItemQuantity(basket.items, productId))
    })
  }

  async function removeProduct(productId) {
    return runBasketOperation(async () => {
      await persistItemsOrDelete(removeBasketItem(basket.items, productId))
    })
  }

  async function clearBasket() {
    return runBasketOperation(async () => {
      await deleteBasket()
      setBasket(EMPTY)
    })
  }

  const items = basket.items ?? []
  const value = {
    basket,
    items,
    totalPrice: basket.totalPrice,
    totalItems: calculateBasketItemCount(items),
    loading,
    operationLoading,
    error,
    addProduct,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    clearBasket,
    fetchBasket,
  }

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
}
