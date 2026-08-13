import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../features/auth/context/AuthContext.jsx'
import RoleRoute from '../features/auth/components/RoleRoute.jsx'

function OrdersRouteContent() {
  return <div data-testid="orders-content">Ordenes</div>
}

describe('rutas de ordenes protegidas', () => {
  function renderRoute(authValue) {
    return render(
      <MemoryRouter initialEntries={['/ordenes/o1']}>
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login</div>} />
            <Route path="/no-autorizado" element={<div data-testid="unauthorized">No autorizado</div>} />
            <Route path="/ordenes/:id" element={<RoleRoute roles={['Cliente']}><OrdersRouteContent /></RoleRoute>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )
  }

  it('permite Cliente autenticado', () => {
    renderRoute({ isAuthenticated: true, authLoading: false, user: { roles: ['Cliente'] } })
    expect(screen.getByTestId('orders-content')).toBeInTheDocument()
  })

  it('redirige visitante a login', () => {
    renderRoute({ isAuthenticated: false, authLoading: false, user: null })
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('redirige Admin sin rol Cliente a no autorizado', () => {
    renderRoute({ isAuthenticated: true, authLoading: false, user: { roles: ['Admin'] } })
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument()
  })
})
