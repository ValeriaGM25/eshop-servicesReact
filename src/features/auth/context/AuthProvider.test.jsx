import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getAccessToken } from '../services/tokenStore.js'
import * as authService from '../services/authService.js'

function TestConsumer() {
  const { user, isAuthenticated, login, logout, authLoading } = useAuth()
  if (authLoading) return <span>Loading auth...</span>
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Autenticado' : 'Visitante'}</span>
      {user && <span data-testid="user-name">{user.name}</span>}
      <button data-testid="btn-login" onClick={() => login({ email: 'a@b.com', password: 'pass' })}>Login</button>
      <button data-testid="btn-logout" onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('llama refreshSession al montar el componente', async () => {
    const refreshSpy = vi.spyOn(authService, 'refreshSession')
    refreshSpy.mockResolvedValue({ accessToken: 'new-token', user: { name: 'Test' } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => expect(refreshSpy).toHaveBeenCalledTimes(1))
  })

  it('login guarda accessToken en tokenStore', async () => {
    vi.spyOn(authService, 'refreshSession').mockResolvedValue(null)
    vi.spyOn(authService, 'loginUser').mockResolvedValue({
      accessToken: 'login-token-abc',
      user: { name: 'Test', email: 'a@b.com', roles: ['Cliente'] },
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => screen.getByTestId('btn-login'))
    screen.getByTestId('btn-login').click()

    await waitFor(() => {
      expect(getAccessToken()).toBe('login-token-abc')
    })
  })

  it('logout limpia user y accessToken', async () => {
    vi.spyOn(authService, 'refreshSession').mockResolvedValue(null)
    vi.spyOn(authService, 'loginUser').mockResolvedValue({
      accessToken: 'test-token',
      user: { name: 'Test', email: 'a@b.com', roles: ['Cliente'] },
    })
    vi.spyOn(authService, 'logoutUser').mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => screen.getByTestId('btn-login'))
    screen.getByTestId('btn-login').click()
    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('Autenticado'))

    screen.getByTestId('btn-logout').click()
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Visitante')
      expect(getAccessToken()).toBeNull()
    })
  })
})
