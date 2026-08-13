import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as orderService from '../../orders/services/orderService.js'
import AdminOrdersPage from './AdminOrdersPage.jsx'

vi.mock('../../orders/services/orderService.js', () => ({
  getOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
  downloadOrderReport: vi.fn(),
}))

const ordersResponse = {
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

describe('AdminOrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista ordenes del contrato paginado real y permite confirmar una Pending', async () => {
    orderService.getOrders.mockResolvedValue(ordersResponse)
    orderService.updateOrderStatus.mockResolvedValue({ id: 'order-1', status: 'Confirmed' })
    render(<MemoryRouter><AdminOrdersPage /></MemoryRouter>)

    expect(await screen.findByText('order-1')).toBeInTheDocument()
    expect(screen.getByText('order-2')).toBeInTheDocument()
    expect(screen.getAllByText('customer-1')).toHaveLength(2)
    expect(screen.getAllByText('Total')[0].closest('.card')).toHaveTextContent('2')
    expect(screen.getAllByText('Pendientes')[0].closest('.card')).toHaveTextContent('2')
    expect(screen.getAllByText('Confirmadas')[0].closest('.card')).toHaveTextContent('0')
    expect(screen.getAllByText('Canceladas')[0].closest('.card')).toHaveTextContent('0')
    expect(screen.getByText('$2,950.00')).toBeInTheDocument()
    expect(screen.getByText('$389.36')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: 'Confirmar' })[0])
    await waitFor(() => expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'Confirmed'))
  })

  it('transicion invalida muestra error 409 controlado', async () => {
    orderService.getOrders.mockResolvedValue(ordersResponse)
    orderService.updateOrderStatus.mockRejectedValue(new Error('No fue posible completar la operación por un conflicto con el estado actual.'))
    render(<MemoryRouter><AdminOrdersPage /></MemoryRouter>)

    await screen.findByText('order-1')
    await userEvent.click(screen.getAllByRole('button', { name: 'Cancelar' })[0])
    expect(await screen.findByRole('alert')).toHaveTextContent('conflicto')
  })
})
