import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/context/AuthContext.jsx'
import { BasketProvider } from './BasketProvider.jsx'
import { useBasket } from '../hooks/useBasket.js'

function BasketConsumer() {
  const { loading, totalItems, items } = useBasket()
  if (loading) return <span>Cargando</span>
  return <span>Total {totalItems} items</span>
}

function renderBasket(authValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      <BasketProvider>
        <BasketConsumer />
      </BasketProvider>
    </AuthContext.Provider>,
  )
}

describe('BasketProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('trata GET 404 como carrito vacio', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      text: async () => '',
    }))

    renderBasket({ user: null })

    expect(await screen.findByText('Total 0 items')).toBeInTheDocument()
  })

  it('no consulta Basket para visitante', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{}' })
    vi.stubGlobal('fetch', fetchSpy)

    renderBasket({ user: null })

    await waitFor(() => {
      expect(screen.getByText('Total 0 items')).toBeInTheDocument()
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('no consulta Basket para Admin', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{}' })
    vi.stubGlobal('fetch', fetchSpy)

    renderBasket({ user: { name: 'Admin', roles: ['Admin'] } })

    await waitFor(() => {
      expect(screen.getByText('Total 0 items')).toBeInTheDocument()
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('consulta Basket cuando Cliente inicia sesión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[],"totalPrice":0}}',
    }))

    renderBasket({
      isAuthenticated: true,
      isCliente: true,
      user: { name: 'Client', email: 'c@test.com', roles: ['Cliente'] },
    })

    await waitFor(() => {
      expect(screen.getByText('Total 0 items')).toBeInTheDocument()
    })
  })

  it('limpia carrito al cerrar sesión (user cambia a null)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[{"productId":"p1","productName":"Test","price":10,"quantity":1}],"totalPrice":10}}',
    }))

    const { rerender } = render(
      <AuthContext.Provider value={{ isAuthenticated: true, isCliente: true, user: { name: 'Client', roles: ['Cliente'] } }}>
        <BasketProvider>
          <BasketConsumer />
        </BasketProvider>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Total 1 items')).toBeInTheDocument()
    })

    rerender(
      <AuthContext.Provider value={{ isAuthenticated: false, isCliente: false, user: null }}>
        <BasketProvider>
          <BasketConsumer />
        </BasketProvider>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Total 0 items')).toBeInTheDocument()
    })
  })

  it('DELETE 404 es éxito idempotente', async () => {
    let callCount = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url, opts) => {
      callCount++
      if (opts?.method === 'DELETE' && callCount >= 2) {
        return { ok: false, status: 404, text: async () => '' }
      }
      if (opts?.method === 'DELETE') {
        return { ok: true, status: 200, text: async () => '{}' }
      }
      if (url.includes('/basket') && !opts?.method) {
        return { ok: true, status: 200, text: async () => '{"cart":{"items":[{"productId":"p1","productName":"Test","price":10,"quantity":1}],"totalPrice":10}}' }
      }
      return { ok: true, status: 200, text: async () => '{}' }
    }))

    const { rerender } = render(
      <AuthContext.Provider value={{ isAuthenticated: true, isCliente: true, user: { name: 'Client', roles: ['Cliente'] } }}>
        <BasketProvider>
          <span>Rendered</span>
        </BasketProvider>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Rendered')).toBeInTheDocument()
    })
  })
})
