import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import { BasketContext } from '../../basket/context/BasketContext.jsx'
import ProductDetail from './ProductDetail.jsx'

const product = {
  id: 'product-1',
  name: 'Audifonos Bluetooth',
  description: 'Audio inalambrico',
  category: ['Audio'],
  imageFiles: '',
  price: 120,
}

const authValue = {
  isAuthenticated: true,
  isAdmin: false,
  isCliente: true,
  user: { name: 'Client', email: 'client@test.com', roles: ['Cliente'] },
  authLoading: false,
}

function renderDetail(value = {}) {
  return render(
    <MemoryRouter initialEntries={['/productos/product-1']}>
      <AuthContext.Provider value={authValue}>
        <BasketContext.Provider value={{ addProduct: vi.fn().mockResolvedValue(true), error: '', loading: false, operationLoading: false, ...value }}>
          <Routes>
            <Route path="/productos/product-1" element={<ProductDetail product={product} />} />
            <Route path="/carrito" element={<div data-testid="basket-page">Carrito</div>} />
          </Routes>
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('ProductDetail', () => {
  it('agregar al carrito espera addProduct y muestra confirmación', async () => {
    const user = userEvent.setup()
    const addProduct = vi.fn().mockResolvedValue(true)

    renderDetail({ addProduct })

    await user.click(screen.getByRole('button', { name: /agregar audifonos bluetooth al carrito/i }))

    await waitFor(() => expect(addProduct).toHaveBeenCalledWith(product))
    expect(await screen.findByText('Producto agregado al carrito.')).toBeInTheDocument()
  })

  it('comprar ahora navega a /carrito solo después de addProduct exitoso', async () => {
    const user = userEvent.setup()
    const addProduct = vi.fn().mockResolvedValue(true)

    renderDetail({ addProduct })

    await user.click(screen.getByRole('button', { name: /comprar audifonos bluetooth ahora/i }))

    await waitFor(() => expect(addProduct).toHaveBeenCalledWith(product))
    expect(await screen.findByTestId('basket-page')).toBeInTheDocument()
  })

  it('comprar ahora no navega si addProduct falla', async () => {
    const user = userEvent.setup()
    const addProduct = vi.fn().mockResolvedValue(false)

    renderDetail({ addProduct, error: 'No fue posible guardar el carrito porque los datos enviados no son válidos.' })

    await user.click(screen.getByRole('button', { name: /comprar audifonos bluetooth ahora/i }))

    await waitFor(() => expect(addProduct).toHaveBeenCalledWith(product))
    expect(screen.queryByTestId('basket-page')).not.toBeInTheDocument()
    expect(screen.getByText('No fue posible guardar el carrito porque los datos enviados no son válidos.')).toBeInTheDocument()
  })
})
