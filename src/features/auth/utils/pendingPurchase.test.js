import { describe, expect, it } from 'vitest'
import { savePendingPurchase, getPendingPurchase, clearPendingPurchase } from './pendingPurchase.js'

describe('pendingPurchase', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('savePendingPurchase almacena { type, productId }', () => {
    savePendingPurchase({ type: 'add-to-cart', productId: 'prod-1' })
    const result = getPendingPurchase()
    expect(result).toEqual({ type: 'add-to-cart', productId: 'prod-1' })
  })

  it('getPendingPurchase retorna null si no hay datos', () => {
    expect(getPendingPurchase()).toBeNull()
  })

  it('clearPendingPurchase remueve los datos', () => {
    savePendingPurchase({ type: 'buy-now', productId: 'prod-2' })
    clearPendingPurchase()
    expect(getPendingPurchase()).toBeNull()
  })

  it('nunca almacena tokens ni información personal', () => {
    savePendingPurchase({ type: 'add-to-cart', productId: 'prod-1' })
    const raw = sessionStorage.getItem('eshop_pending_purchase')
    const parsed = JSON.parse(raw)
    expect(parsed).not.toHaveProperty('token')
    expect(parsed).not.toHaveProperty('accessToken')
    expect(parsed).not.toHaveProperty('password')
    expect(parsed).not.toHaveProperty('email')
    expect(parsed).not.toHaveProperty('name')
    expect(parsed).not.toHaveProperty('roles')
  })
})
