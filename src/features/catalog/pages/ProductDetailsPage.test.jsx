import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BasketContext } from '../../basket/context/BasketContext.jsx'
import ProductDetailsPage from './ProductDetailsPage.jsx'

describe('ProductDetailsPage', () => {
  it('maneja 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      json: async () => ({}),
    }))

    render(
      <MemoryRouter initialEntries={["/productos/no-existe"]}>
        <BasketContext.Provider value={{ addProduct: vi.fn(), loading: false, operationLoading: false }}>
          <Routes>
            <Route path="/productos/:id" element={<ProductDetailsPage />} />
          </Routes>
        </BasketContext.Provider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Producto no encontrado.')).toBeInTheDocument()
  })
})
