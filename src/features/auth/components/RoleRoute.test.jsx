import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../context/AuthContext.jsx'
import RoleRoute from './RoleRoute.jsx'

describe('RoleRoute', () => {
  function renderWithUser(roles, authLoading = false) {
    const isAuthenticated = roles !== null
    const user = isAuthenticated ? { name: 'Test', roles } : null
    return render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ isAuthenticated, authLoading, user }}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login</div>} />
            <Route path="/no-autorizado" element={<div data-testid="unauthorized">No autorizado</div>} />
            <Route path="/admin" element={
              <RoleRoute roles={['Admin']}>
                <div data-testid="admin-content">Panel Admin</div>
              </RoleRoute>
            } />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )
  }

  it('permite Admin y renderiza children', () => {
    renderWithUser(['Admin'])
    expect(screen.getByTestId('admin-content')).toBeInTheDocument()
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument()
  })

  it('rechaza Cliente en ruta Admin y redirige a /no-autorizado', () => {
    renderWithUser(['Cliente'])
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('redirige visitante a /login', () => {
    renderWithUser(null)
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('muestra spinner mientras authLoading es true', () => {
    renderWithUser(null, true)
    expect(screen.getByText('Verificando sesión…')).toBeInTheDocument()
  })
})
