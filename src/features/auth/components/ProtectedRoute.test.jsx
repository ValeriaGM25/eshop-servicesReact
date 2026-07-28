import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

describe('ProtectedRoute', () => {
  function renderWithAuth(isAuthenticated, authLoading = false) {
    return render(
      <MemoryRouter initialEntries={['/protegido']}>
        <AuthContext.Provider value={{ isAuthenticated, authLoading }}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route path="/protegido" element={
              <ProtectedRoute>
                <div data-testid="protected-content">Contenido protegido</div>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )
  }

  it('renderiza children cuando está autenticado', () => {
    renderWithAuth(true)
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })

  it('redirige a /login cuando no está autenticado', () => {
    renderWithAuth(false)
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('no renderiza contenido protegido mientras authLoading es true', () => {
    renderWithAuth(false, true)
    expect(screen.getByText('Verificando sesión…')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })
})
