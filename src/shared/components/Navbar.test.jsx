import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../../features/auth/context/AuthContext.jsx'
import { BasketContext } from '../../features/basket/context/BasketContext.jsx'
import Navbar from './Navbar.jsx'

function renderNavbar(authValue, basketValue = { totalItems: 0 }) {
  const defaultAuth = {
    isAuthenticated: false,
    isAdmin: false,
    isCliente: false,
    user: null,
    logout: () => {},
    logoutLoading: false,
    ...authValue,
  }
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={defaultAuth}>
        <BasketContext.Provider value={{ ...basketValue }}>
          <Navbar />
        </BasketContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('Cliente ve el badge del carrito con totalItems', () => {
    renderNavbar(
      { isAuthenticated: true, isCliente: true, user: { name: 'Test', email: 'test@test.com' } },
      { totalItems: 3 },
    )

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('Visitante ve Iniciar sesión y Crear cuenta', () => {
    renderNavbar({})

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument()
    expect(screen.queryByText('Mi carrito')).not.toBeInTheDocument()
    expect(screen.queryByText('Órdenes')).not.toBeInTheDocument()
  })

  it('Admin ve Productos y Órdenes y no Carrito', () => {
    renderNavbar({
      isAuthenticated: true,
      isAdmin: true,
      isCliente: false,
      user: { name: 'Admin', email: 'admin@test.com' },
    })

    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Órdenes')).toBeInTheDocument()
    expect(screen.queryByText('Mi carrito')).not.toBeInTheDocument()
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
  })

  it('Cliente ve Mi carrito, Mis compras y enlace Mi cuenta', () => {
    renderNavbar({
      isAuthenticated: true,
      isCliente: true,
      user: { name: 'Client', email: 'c@test.com' },
    })

    expect(screen.getByText('Mi carrito')).toBeInTheDocument()
    expect(screen.getByText('Mis compras')).toBeInTheDocument()
    expect(screen.getByText('Mi cuenta')).toBeInTheDocument()
    expect(screen.queryByText('Órdenes')).not.toBeInTheDocument()
  })
})
