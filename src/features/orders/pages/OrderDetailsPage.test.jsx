import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as orderService from '../services/orderService.js'
import OrderDetailsPage from './OrderDetailsPage.jsx'

vi.mock('../services/orderService.js', () => ({
  getOrderById: vi.fn(),
  downloadOrderReport: vi.fn(),
}))

function renderDetails() {
  return render(
    <MemoryRouter initialEntries={['/ordenes/o1']}>
      <Routes>
        <Route path="/ordenes/:id" element={<OrderDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('OrderDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.URL.createObjectURL = vi.fn(() => 'blob:url')
    global.URL.revokeObjectURL = vi.fn()
    HTMLAnchorElement.prototype.click = vi.fn()
  })

  const order = {
    id: 'o1',
    customerId: 'c1',
    createdAt: '2026-08-13T10:00:00Z',
    status: 'Confirmed',
    subtotal: 100,
    tax: 16,
    total: 116,
    items: [{ productId: 'p1', productName: 'Producto 1', quantity: 2, unitPrice: 50, lineTotal: 100 }],
  }

  it('obtiene la orden desde Orders.API y muestra Items/Subtotal/Tax/Total', async () => {
    orderService.getOrderById.mockResolvedValue(order)

    renderDetails()

    expect(await screen.findByText('Orden de compra')).toBeInTheDocument()
    expect(orderService.getOrderById).toHaveBeenCalledWith('o1')
    expect(screen.getAllByText('Producto 1')).not.toHaveLength(0)
    expect(screen.getAllByText('p1')).not.toHaveLength(0)
    expect(screen.getAllByText('$100.00')).not.toHaveLength(0)
    expect(screen.getByText('$16.00')).toBeInTheDocument()
    expect(screen.getByText('$116.00')).toBeInTheDocument()
  })

  it('boton PDF llama Orders.API y no genera PDF localmente', async () => {
    const user = userEvent.setup()
    orderService.getOrderById.mockResolvedValue(order)
    orderService.downloadOrderReport.mockResolvedValue({ blob: new Blob(['pdf'], { type: 'application/pdf' }), filename: 'orden.pdf' })
    const appendSpy = vi.spyOn(document.body, 'appendChild')

    renderDetails()

    await screen.findByText('Orden de compra')
    await user.click(screen.getByRole('button', { name: /Descargar comprobante PDF/ }))

    await waitFor(() => expect(orderService.downloadOrderReport).toHaveBeenCalledWith('o1'))
    expect(appendSpy).toHaveBeenCalled()
  })
})
