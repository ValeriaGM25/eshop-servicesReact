import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import OrderConfirmationPage from './OrderConfirmationPage.jsx'

vi.mock('../services/orderService.js', () => ({
  getOrderById: vi.fn(),
}))

describe('OrderConfirmationPage', () => {
  it('muestra Order Id y navega a Ver orden de compra', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={[{ pathname: '/compra/confirmacion/o1', state: { order: { id: 'o1', total: 120, status: 'Confirmed', createdAt: '2026-08-13T10:00:00Z' } } }]}>
        <Routes>
          <Route path="/compra/confirmacion/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/ordenes/:id" element={<div data-testid="order-details">Detalle</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Compra confirmada')).toBeInTheDocument()
    expect(screen.getByText('o1')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Ver detalle de la orden/ }))

    expect(screen.getByTestId('order-details')).toBeInTheDocument()
  })
})
