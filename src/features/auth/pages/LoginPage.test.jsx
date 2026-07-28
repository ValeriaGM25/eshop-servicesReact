import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext.jsx'
import { BasketContext } from '../../basket/context/BasketContext.jsx'
import LoginPage from './LoginPage.jsx'

const emptyBasket = { addProduct: vi.fn(), loading: false, operationLoading: false, items: [], totalItems: 0, totalPrice: 0 }

function renderLogin(authValue = {}) {
  const defaultAuth = {
    isAuthenticated: false,
    isAdmin: false,
    isCliente: false,
    authLoading: false,
    login: vi.fn(),
    ...authValue,
  }
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthContext.Provider value={defaultAuth}>
        <BasketContext.Provider value={emptyBasket}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div data-testid="admin-page">Admin Panel</div>} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('login 401 muestra "Credenciales inválidas."', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Credenciales inválidas.'))
    renderLogin({ login })

    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'a@b.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas.')).toBeInTheDocument()
    })
  })

  it('login 429 muestra mensaje de límite de intentos', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Demasiados intentos. Intenta nuevamente más tarde.'))
    renderLogin({ login })

    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'a@b.com')
    await user.type(screen.getByLabelText('Contraseña'), 'test')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => {
      expect(screen.getByText('Demasiados intentos. Intenta nuevamente más tarde.')).toBeInTheDocument()
    })
  })

  it('Admin redirige a /admin tras login exitoso', async () => {
    const login = vi.fn().mockResolvedValue({
      accessToken: 'token',
      user: { name: 'Admin', email: 'admin@test.com', roles: ['Admin'] },
    })
    renderLogin({ login, isAdmin: false })

    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'pass')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => {
      expect(screen.getByTestId('admin-page')).toBeInTheDocument()
    })
  })

  it('Cliente con pending purchase ejecuta la acción y redirige', async () => {
    sessionStorage.setItem('eshop_pending_purchase', JSON.stringify({ type: 'add-to-cart', productId: 'prod-1' }))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ product: { id: 'prod-1', name: 'Test', price: 10 } }),
    }))

    const addProduct = vi.fn().mockResolvedValue(true)
    const login = vi.fn().mockResolvedValue({
      accessToken: 'token',
      user: { name: 'Client', email: 'c@test.com', roles: ['Cliente'] },
    })
    renderLogin({ login, isAdmin: false })

    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'c@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'pass')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => {
      expect(sessionStorage.getItem('eshop_pending_purchase')).toBeNull()
    })

    sessionStorage.removeItem('eshop_pending_purchase')
  })
})
