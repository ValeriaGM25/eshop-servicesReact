import { describe, expect, it, vi } from 'vitest'
import { getBasket, deleteBasket } from './basketService.js'
import * as authFetch from '../../auth/services/authenticatedFetch.js'

vi.mock('../../auth/services/authenticatedFetch.js', () => ({
  authenticatedFetch: vi.fn(),
}))

describe('basketService URLs', () => {
  it('getBasket usa /basket (sin userName)', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"cart":{"items":[]}}',
    })

    await getBasket()

    const url = authFetch.authenticatedFetch.mock.calls[0][0]
    expect(url).toBe('http://localhost:6001/basket')
    expect(url).not.toContain('userName')
    expect(url).not.toMatch(/\/basket\/\w+/)
  })

  it('deleteBasket usa /basket (sin userName)', async () => {
    authFetch.authenticatedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{}',
    })

    await deleteBasket()

    const url = authFetch.authenticatedFetch.mock.calls[0][0]
    expect(url).toBe('http://localhost:6001/basket')
    expect(url).not.toContain('userName')
    expect(url).not.toMatch(/\/basket\/\w+/)
  })
})
