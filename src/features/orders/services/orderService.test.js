import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as authFetch from '../../auth/services/authenticatedFetch.js'
import { createOrder, downloadOrderReport, getOrderById, getOrders } from './orderService.js'

const ORDERS_URL = import.meta.env.VITE_ORDERS_API_URL

vi.mock('../../auth/services/authenticatedFetch.js', () => ({
  authenticatedFetch: vi.fn(),
}))

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createOrder usa POST /api/orders y envia Idempotency-Key', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => '{"order":{"id":"o1"}}',
    })

    await createOrder({ idempotencyKey: 'key-123', customerId: 'user-real-123', basketId: 'compat-exam' })

    expect(authFetch.authenticatedFetch).toHaveBeenCalledWith(`${ORDERS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': 'key-123',
      },
      body: JSON.stringify({ customerId: 'user-real-123', basketId: 'compat-exam' }),
    })
  })

  it('createOrder llega a authenticatedFetch con body no vacio', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => '{"order":{"id":"o1"}}',
    })

    await createOrder({ idempotencyKey: 'key-123', customerId: 'user-real-123' })

    expect(authFetch.authenticatedFetch).toHaveBeenCalledTimes(1)
    const [, options] = authFetch.authenticatedFetch.mock.calls[0]
    expect(options.body).toBeTruthy()
    expect(JSON.parse(options.body)).toEqual({
      customerId: 'user-real-123',
      basketId: 'compat-exam',
    })
  })

  it('createOrder falla antes de authenticatedFetch si falta customerId', async () => {
    await expect(createOrder({ idempotencyKey: 'key-123' }))
      .rejects.toThrow('No fue posible identificar tu sesión para crear la orden')
    expect(authFetch.authenticatedFetch).not.toHaveBeenCalled()
  })

  it('createOrder traduce 400 a carrito vacio o datos invalidos', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({ ok: false, status: 400, text: async () => '{}' })

    await expect(createOrder({ idempotencyKey: 'key-123', customerId: 'user-real-123' }))
      .rejects.toThrow('No fue posible crear la orden porque los datos son inválidos o el carrito está vacío.')
  })

  it('getOrderById consulta Orders.API como fuente de verdad', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"order":{"id":"o1","total":100}}',
    })

    await expect(getOrderById('o1')).resolves.toEqual({ id: 'o1', total: 100 })
    expect(authFetch.authenticatedFetch).toHaveBeenCalledWith(`${ORDERS_URL}/api/orders/o1`)
  })

  it('getOrders consume el contrato paginado real de GET /api/orders', async () => {
    const response = {
      items: [
        {
          id: 'order-1',
          customerId: 'customer-1',
          createdAt: '2026-08-13T22:11:56Z',
          status: 'Pending',
          itemsCount: 1,
          subtotal: 2500,
          tax: 450,
          total: 2950,
        },
        {
          id: 'order-2',
          customerId: 'customer-1',
          createdAt: '2026-08-13T22:07:56Z',
          status: 'Pending',
          itemsCount: 3,
          subtotal: 329.97,
          tax: 59.39,
          total: 389.36,
        },
      ],
      page: 1,
      pageSize: 20,
      totalItems: 2,
      totalPages: 1,
    }
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(response),
    })

    await expect(getOrders()).resolves.toEqual(response)
    expect(authFetch.authenticatedFetch).toHaveBeenCalledWith(`${ORDERS_URL}/api/orders`)
  })

  it('downloadOrderReport descarga blob PDF generado por Orders.API', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' })
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="orden-o1.pdf"',
      }),
      blob: async () => blob,
    })

    await expect(downloadOrderReport('o1')).resolves.toEqual({ blob, filename: 'orden-o1.pdf' })
    expect(authFetch.authenticatedFetch).toHaveBeenCalledWith(`${ORDERS_URL}/api/orders/o1/report`)
  })

  it('rechaza reportes que no son application/pdf', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Type': 'text/html' }),
      blob: async () => new Blob(['html'], { type: 'text/html' }),
    })

    await expect(downloadOrderReport('o1')).rejects.toThrow('Orders.API no devolvió un archivo PDF válido.')
  })
})
