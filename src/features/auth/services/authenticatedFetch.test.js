import { describe, expect, it, vi } from 'vitest'
import { authenticatedFetch, clearRefreshPromise } from './authenticatedFetch.js'
import { setAccessToken, clearAccessToken, getAccessToken } from './tokenStore.js'
import * as authService from './authService.js'

describe('authenticatedFetch', () => {
  beforeEach(() => {
    clearAccessToken()
    clearRefreshPromise()
    vi.restoreAllMocks()
  })

  it('agrega Authorization Bearer cuando hay token', async () => {
    setAccessToken('my-token')
    let capturedHeaders = null
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url, opts) => {
      capturedHeaders = opts.headers
      return { ok: true, status: 200 }
    }))

    await authenticatedFetch('http://api.test/resource')

    expect(capturedHeaders['Authorization']).toBe('Bearer my-token')
  })

  it('una respuesta 401 ejecuta refreshSession una vez', async () => {
    setAccessToken('old-token')
    const refreshSpy = vi.spyOn(authService, 'refreshSession')
    let callCount = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => {
      callCount++
      if (callCount === 1) return { ok: false, status: 401 }
      return { ok: true, status: 200 }
    }))
    refreshSpy.mockResolvedValue({ accessToken: 'new-token' })

    try { await authenticatedFetch('http://api.test/resource') } catch {}

    expect(refreshSpy).toHaveBeenCalledTimes(1)
  })

  it('reintenta la petición original una sola vez tras refresh exitoso', async () => {
    setAccessToken('old-token')
    vi.spyOn(authService, 'refreshSession').mockResolvedValue({ accessToken: 'new-token' })
    let callCount = 0
    let urls = []
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url) => {
      callCount++
      urls.push(url)
      if (callCount === 1) return { ok: false, status: 401 }
      return { ok: true, status: 200 }
    }))

    await authenticatedFetch('http://api.test/resource')

    expect(urls.filter(u => u === 'http://api.test/resource').length).toBe(2)
  })

  it('una respuesta 403 no ejecuta refreshSession', async () => {
    setAccessToken('my-token')
    const refreshSpy = vi.spyOn(authService, 'refreshSession')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))

    try { await authenticatedFetch('http://api.test/resource') } catch {}

    expect(refreshSpy).not.toHaveBeenCalled()
  })

  it('peticiones 401 simultáneas comparten una sola promesa de refresh', async () => {
    setAccessToken('old-token')
    let refreshCalls = 0
    vi.spyOn(authService, 'refreshSession').mockImplementation(async () => {
      refreshCalls++
      return { accessToken: 'new-token' }
    })
    let callNum = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => {
      callNum++
      if (callNum <= 2) return { ok: false, status: 401 }
      return { ok: true, status: 200 }
    }))

    await Promise.allSettled([
      authenticatedFetch('http://api.test/a'),
      authenticatedFetch('http://api.test/b'),
    ])

    expect(refreshCalls).toBe(1)
  })

  it('refresh fallido limpia el token y lanza error', async () => {
    setAccessToken('old-token')
    vi.spyOn(authService, 'refreshSession').mockResolvedValue(null)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

    await expect(authenticatedFetch('http://api.test/resource'))
      .rejects.toThrow('Sesión expirada')

    expect(getAccessToken()).toBeNull()
  })

  it('refresh fallido dispara evento auth:session-expired', async () => {
    setAccessToken('old-token')
    vi.spyOn(authService, 'refreshSession').mockResolvedValue(null)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))
    const handler = vi.fn()
    window.addEventListener('auth:session-expired', handler)

    try { await authenticatedFetch('http://api.test/resource') } catch {}

    expect(handler).toHaveBeenCalledTimes(1)
    window.removeEventListener('auth:session-expired', handler)
  })
})
