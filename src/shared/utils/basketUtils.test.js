import { describe, expect, it } from 'vitest'
import {
  addOrIncreaseItem,
  decreaseItemQuantity,
  removeBasketItem,
} from './basketUtils.js'

describe('basketUtils', () => {
  it('aumenta cantidades y elimina productos', () => {
    const item = {
      quantity: 1,
      color: 'Sin especificar',
      price: 10,
      productId: 'product-1',
      productName: 'Producto 1',
    }

    const increased = addOrIncreaseItem([item], item)
    expect(increased[0].quantity).toBe(2)

    const decreased = decreaseItemQuantity(increased, 'product-1')
    expect(decreased[0].quantity).toBe(1)

    expect(removeBasketItem(decreased, 'product-1')).toEqual([])
  })
})
