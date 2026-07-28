import { describe, expect, it, vi } from 'vitest'
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore.js'

describe('tokenStore', () => {
  it('setAccessToken y getAccessToken almacenan y recuperan el token', () => {
    setAccessToken('test-token-123')
    expect(getAccessToken()).toBe('test-token-123')
  })

  it('clearAccessToken nullifica el token almacenado', () => {
    setAccessToken('test-token-123')
    clearAccessToken()
    expect(getAccessToken()).toBeNull()
  })

  it('no escribe el token en localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    setAccessToken('test-token-123')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('no escribe el token en sessionStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    setAccessToken('test-token-123')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('no contiene console.log del accessToken', () => {
    const spy = vi.spyOn(console, 'log')
    setAccessToken('secret-token')
    getAccessToken()
    clearAccessToken()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
