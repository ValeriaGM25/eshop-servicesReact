import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getBasket, deleteBasket, storeBasket } from './basketService.js'
import * as authFetch from '../../auth/services/authenticatedFetch.js'

const BASKET_URL = `${import.meta.env.VITE_BASKET_API_URL}/basket`

vi.mock('../../auth/services/authenticatedFetch.js', () => ({
  authenticatedFetch: vi.fn(),
}))

describe('basketService URLs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getBasket usa /basket (sin userName)', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[]}}',
    })

    await getBasket()

    const url = authFetch.authenticatedFetch.mock.calls[0][0]
    expect(url).toBe(BASKET_URL)
    expect(url).not.toContain('userName')
    expect(url).not.toMatch(/\/basket\/\w+/)
  })

  it('deleteBasket usa /basket (sin userName)', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{}',
    })

    await deleteBasket()

    const url = authFetch.authenticatedFetch.mock.calls[0][0]
    expect(url).toBe(BASKET_URL)
    expect(url).not.toContain('userName')
    expect(url).not.toMatch(/\/basket\/\w+/)
  })

  it('storeBasket usa POST /basket con wrapper cart y sin userName', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[{"productId":"p1","productName":"Test","price":10,"quantity":1,"color":"Sin especificar"}],"totalPrice":10}}',
    })

    await storeBasket({
      items: [{ productId: 'p1', productName: 'Test', price: 10, quantity: 1, color: 'Sin especificar' }],
    })

    const [url, options] = authFetch.authenticatedFetch.mock.calls[0]
    expect(url).toBe(BASKET_URL)
    expect(url).not.toContain('userName')
    expect(url).not.toMatch(/\/basket\/\w+/)
    expect(options.method).toBe('POST')
    expect(options).not.toHaveProperty('credentials')
    expect(JSON.parse(options.body)).toEqual({
      cart: {
        items: [{ productId: 'p1', productName: 'Test', price: 10, quantity: 1, color: 'Sin especificar' }],
      },
    })
  })

  it('storeBasket devuelve cart cuando POST 200 responde con wrapper', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[{"productId":"p1","quantity":1}],"totalPrice":10}}',
    })

    await expect(storeBasket({ items: [{ productId: 'p1', quantity: 1 }] })).resolves.toEqual({
      items: [{ productId: 'p1', quantity: 1 }],
      totalPrice: 10,
    })
  })

  it('storeBasket traduce POST 400 a error de datos inválidos', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => '{"title":"Bad Request"}',
    })

    await expect(storeBasket({ items: [] }))
      .rejects.toThrow('No fue posible guardar el carrito porque los datos enviados no son válidos.')
  })

  it('storeBasket traduce error de red a Basket.API no disponible', async () => {
    authFetch.authenticatedFetch.mockRejectedValue(new TypeError('fetch failed'))

    await expect(storeBasket({ items: [] }))
      .rejects.toThrow('No fue posible conectar con Basket.API.')
  })
})
