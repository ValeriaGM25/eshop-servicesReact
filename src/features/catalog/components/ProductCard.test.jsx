import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import { BasketContext } from '../../basket/context/BasketContext.jsx'
import { fallbackRemoteImage, productRemoteImages } from '../../../shared/config/remoteImages.js'
import ProductCard from './ProductCard.jsx'

const mouseProduct = {
  id: 'product-1',
  name: 'Mouse Inalambrico',
  description: 'Mouse ergonomico',
  category: ['Accesorios'],
  imageFiles: '',
  price: 24.99,
}

const mockAuthValue = { isAuthenticated: true, isAdmin: false, isCliente: true, user: { name: 'Test', email: 'test@test.com' }, authLoading: false, logoutLoading: false, logout: () => {} }

function renderProductCard(product = mouseProduct, value = {}) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <BasketContext.Provider value={{ addProduct: vi.fn().mockResolvedValue(true), loading: false, operationLoading: false, ...value }}>
          <ProductCard product={product} />
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('ejecuta agregar al carrito', async () => {
    const user = userEvent.setup()
    const addProduct = vi.fn().mockResolvedValue(true)

    renderProductCard(mouseProduct, { addProduct })

    await user.click(screen.getByRole('button', { name: /agregar mouse inalambrico/i }))

    await waitFor(() => expect(addProduct).toHaveBeenCalledTimes(1))
  })

  it('usa la imagen remota correspondiente, alt y loading lazy', () => {
    renderProductCard({ ...mouseProduct, name: 'Mouse Inalámbrico' })

    const image = screen.getByRole('img', { name: 'Imagen de Mouse Inalámbrico' })

    expect(image).toHaveAttribute('src', productRemoteImages['mouse inalámbrico'])
    expect(image).toHaveAttribute('alt', 'Imagen de Mouse Inalámbrico')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('cambia una URL inválida al fallback', () => {
    renderProductCard({ ...mouseProduct, imageFiles: 'https://example.com/broken.jpg' })

    const image = screen.getByRole('img', { name: 'Imagen de Mouse Inalambrico' })

    fireEvent.error(image)

    expect(image).toHaveAttribute('src', fallbackRemoteImage)
  })
})
