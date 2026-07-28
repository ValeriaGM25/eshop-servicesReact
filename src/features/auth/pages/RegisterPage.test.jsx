import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext.jsx'
import RegisterPage from './RegisterPage.jsx'

function renderRegister(authValue = {}) {
  const defaultAuth = {
    isAuthenticated: false,
    authLoading: false,
    register: vi.fn(),
    ...authValue,
  }
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={defaultAuth}>
        <RegisterPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  it('no contiene selector de roles en la interfaz', () => {
    renderRegister()
    expect(screen.queryByLabelText(/rol/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('el formulario solo pide nombre, correo y contraseñas', () => {
    renderRegister()
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
  })
})
