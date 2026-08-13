import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import { BasketContext } from '../context/BasketContext.jsx'
import BasketSummary from './BasketSummary.jsx'
import * as orderService from '../../orders/services/orderService.js'

vi.mock('../../orders/services/orderService.js', () => ({
  createOrder: vi.fn(),
  resolveOrderId: vi.fn((order) => order.id ?? order.orderId),
}))

function renderSummary(value, authValue = { user: { id: 'user-real-123', roles: ['Cliente'] } }) {
  return render(
    <MemoryRouter initialEntries={['/carrito']}>
      <AuthContext.Provider value={authValue}>
        <BasketContext.Provider value={value}>
          <Routes>
            <Route path="/carrito" element={<BasketSummary />} />
            <Route path="/compra/confirmacion/:orderId" element={<div data-testid="confirmation-page">Confirmación</div>} />
          </Routes>
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('BasketSummary checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('crypto', { randomUUID: () => 'idem-123' })
  })

  const basketValue = {
    clearBasket: vi.fn(),
    fetchBasket: vi.fn().mockResolvedValue(true),
    operationLoading: false,
    totalItems: 2,
    totalPrice: 150,
  }

  it('muestra Realizar compra cuando el basket tiene productos', () => {
    renderSummary(basketValue)

    expect(screen.getByRole('button', { name: 'Realizar compra' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Realizar compra' })).not.toBeDisabled()
  })

  it('deshabilita el boton mientras procesa', async () => {
    const user = userEvent.setup()
    let resolveOrder
    orderService.createOrder.mockReturnValue(new Promise((resolve) => { resolveOrder = resolve }))
    renderSummary(basketValue)

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    expect(screen.getByRole('button', { name: 'Realizar compra' })).toBeDisabled()
    expect(screen.getByText('Procesando compra...')).toBeInTheDocument()
    resolveOrder({ id: 'o1' })
    await screen.findByTestId('confirmation-page')
  })

  it('creacion exitosa redirige a confirmacion', async () => {
    const user = userEvent.setup()
    orderService.createOrder.mockResolvedValue({ id: 'o1' })
    renderSummary(basketValue)

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    expect(await screen.findByTestId('confirmation-page')).toBeInTheDocument()
  })

  it('obtiene user.id real y llama createOrder con body requerido', async () => {
    const user = userEvent.setup()
    orderService.createOrder.mockResolvedValue({ id: 'o1' })
    renderSummary(basketValue, { user: { id: 'identity-user-id-1', roles: ['Cliente'] } })

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    await waitFor(() => expect(orderService.createOrder).toHaveBeenCalledTimes(1))
    expect(orderService.createOrder).toHaveBeenCalledWith({
      idempotencyKey: 'idem-123',
      customerId: 'identity-user-id-1',
      basketId: 'compat-exam',
    })
  })

  it('no llama createOrder si falta user.id y muestra error de sesion', async () => {
    const user = userEvent.setup()
    renderSummary(basketValue, { user: { email: 'client@test.com', roles: ['Cliente'] } })

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    expect(orderService.createOrder).not.toHaveBeenCalled()
    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible identificar tu sesión para crear la orden')
  })

  it('error de creacion no redirige y mantiene mensaje visible', async () => {
    const user = userEvent.setup()
    orderService.createOrder.mockRejectedValue(new Error('Orders.API no disponible'))
    renderSummary(basketValue)

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Orders.API no disponible')
    expect(screen.queryByTestId('confirmation-page')).not.toBeInTheDocument()
  })

  it('envia y reutiliza Idempotency-Key al reintentar la misma compra', async () => {
    const user = userEvent.setup()
    orderService.createOrder
      .mockRejectedValueOnce(new Error('Error de red'))
      .mockResolvedValueOnce({ id: 'o1' })
    renderSummary(basketValue)

    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))
    await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: 'Realizar compra' }))

    await waitFor(() => expect(orderService.createOrder).toHaveBeenCalledTimes(2))
    expect(orderService.createOrder.mock.calls[0][0].idempotencyKey).toBe('idem-123')
    expect(orderService.createOrder.mock.calls[1][0].idempotencyKey).toBe('idem-123')
    expect(orderService.createOrder.mock.calls[0][0].customerId).toBe('user-real-123')
    expect(orderService.createOrder.mock.calls[0][0].basketId).toBe('compat-exam')
  })
})
