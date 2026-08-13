import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import * as orderService from '../services/orderService.js'
import MyOrdersPage from './MyOrdersPage.jsx'

vi.mock('../services/orderService.js', () => ({
  getOrdersByCustomer: vi.fn(),
  downloadOrderReport: vi.fn(),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/mis-compras']}>
      <AuthContext.Provider value={{ user: { customerId: 'c1', roles: ['Cliente'] } }}>
        <Routes>
          <Route path="/mis-compras" element={<MyOrdersPage />} />
          <Route path="/ordenes/:id" element={<div data-testid="details">Detalle</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('MyOrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.URL.createObjectURL = vi.fn(() => 'blob:url')
    global.URL.revokeObjectURL = vi.fn()
    HTMLAnchorElement.prototype.click = vi.fn()
  })

  it('obtiene ordenes reales y filtra por estado', async () => {
    orderService.getOrdersByCustomer.mockResolvedValue([
      { id: 'o1', status: 'Confirmed', total: 100, items: [] },
      { id: 'o2', status: 'Pending', total: 50, items: [] },
    ])
    renderPage()

    expect(await screen.findByText('o1')).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'Pending')
    expect(screen.queryByText('o1')).not.toBeInTheDocument()
    expect(screen.getByText('o2')).toBeInTheDocument()
  })

  it('muestra empty state con filtros sin resultados', async () => {
    orderService.getOrdersByCustomer.mockResolvedValue([{ id: 'o1', status: 'Confirmed', total: 100, items: [] }])
    renderPage()
    await screen.findByText('o1')
    await userEvent.type(screen.getByLabelText('Buscar por Order Id'), 'zzz')
    expect(screen.getByText('No encontramos compras con estos filtros.')).toBeInTheDocument()
  })

  it('navega a detalle y descarga PDF', async () => {
    orderService.getOrdersByCustomer.mockResolvedValue([{ id: 'o1', status: 'Confirmed', total: 100, items: [] }])
    orderService.downloadOrderReport.mockResolvedValue({ blob: new Blob(['pdf'], { type: 'application/pdf' }), filename: 'o1.pdf' })
    renderPage()
    await screen.findByText('o1')
    await userEvent.click(screen.getByRole('button', { name: 'Descargar PDF' }))
    await waitFor(() => expect(orderService.downloadOrderReport).toHaveBeenCalledWith('o1'))
    await userEvent.click(screen.getByRole('link', { name: 'Ver detalle' }))
    expect(screen.getByTestId('details')).toBeInTheDocument()
  })
})
