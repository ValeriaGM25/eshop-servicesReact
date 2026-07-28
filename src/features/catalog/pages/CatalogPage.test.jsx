import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import { BasketContext } from '../../basket/context/BasketContext.jsx'
import CatalogPage from './CatalogPage.jsx'

const mockAuthValue = { isAuthenticated: false, isAdmin: false, isCliente: false, user: null, authLoading: false, logoutLoading: false, logout: () => {} }

const product = {
  id: '019fa190-4830-411e-a2b0-1689542a3504',
  name: 'Laptop Pro 14',
  description: 'Laptop ultraligera',
  category: ['Computadoras', 'Laptop'],
  imageFiles: '',
  price: 1299.99,
}

function renderCatalog() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <BasketContext.Provider value={{ addProduct: vi.fn(), loading: false, operationLoading: false }}>
          <CatalogPage />
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('CatalogPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra productos desde Catalog.API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: {
          pageNumber: 1,
          pageSize: 10,
          totalCount: 1,
          data: [product],
        },
      }),
    }))

    renderCatalog()

    expect(await screen.findByText('Laptop Pro 14')).toBeInTheDocument()
    expect(screen.getByText(/1 productos/)).toBeInTheDocument()

    await waitFor(() => expect(fetch).toHaveBeenCalled())
  })
})
