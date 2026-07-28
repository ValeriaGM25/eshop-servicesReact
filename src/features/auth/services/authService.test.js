import { describe, expect, it, vi } from 'vitest'
import { registerUser, loginUser, refreshSession } from './authService.js'

const BASE = 'http://localhost:6003'

describe('authService', () => {
  describe('registerUser', () => {
    it('no envía role, roles, isAdmin ni permissions en el body', async () => {
      let capturedBody = null
      vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url, opts) => {
        capturedBody = opts.body
        return { ok: true, status: 201, text: async () => '{}' }
      }))

      await registerUser({
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      })

      const parsed = JSON.parse(capturedBody)
      expect(parsed).not.toHaveProperty('role')
      expect(parsed).not.toHaveProperty('roles')
      expect(parsed).not.toHaveProperty('isAdmin')
      expect(parsed).not.toHaveProperty('permissions')
      expect(parsed).toHaveProperty('fullName')
      expect(parsed).toHaveProperty('email')
      expect(parsed).toHaveProperty('password')
      expect(parsed).toHaveProperty('confirmPassword')
    })
  })

  describe('loginUser', () => {
    it('login 401 lanza "Credenciales inválidas."', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => '{}',
      }))

      await expect(loginUser({ email: 'a@b.com', password: 'wrong' }))
        .rejects.toThrow('Credenciales inválidas.')
    })

    it('login 429 lanza mensaje de límite de intentos', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => '{}',
      }))

      await expect(loginUser({ email: 'a@b.com', password: 'test' }))
        .rejects.toThrow('Demasiados intentos. Intenta nuevamente más tarde.')
    })
  })

  describe('refreshSession', () => {
    it('usa POST con credentials: "include"', async () => {
      let capturedOptions = null
      vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url, opts) => {
        capturedOptions = opts
        return { ok: true, status: 200, text: async () => '{"accessToken":"new"}' }
      }))

      await refreshSession()

      expect(capturedOptions.method).toBe('POST')
      expect(capturedOptions.credentials).toBe('include')
    })

    it('responde 401 retorna null sin lanzar error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => '{}',
      }))

      const result = await refreshSession()
      expect(result).toBeNull()
    })
  })
})
