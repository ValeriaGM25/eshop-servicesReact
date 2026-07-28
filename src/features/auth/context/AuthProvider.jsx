import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { setAccessToken, clearAccessToken } from '../services/tokenStore.js'
import * as authService from '../services/authService.js'
import { clearPendingPurchase } from '../utils/pendingPurchase.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const userRef = useRef(null)

  useEffect(() => {
    async function restore() {
      const data = await authService.refreshSession()
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
        if (data.user) {
          setUser(data.user)
          userRef.current = data.user
        }
      }
      setAuthLoading(false)
    }
    restore()
  }, [])

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null)
      clearAccessToken()
    }
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.loginUser({ email, password })
    if (data.accessToken) {
      setAccessToken(data.accessToken)
    }
    if (data.user) {
      setUser(data.user)
      userRef.current = data.user
    }
    return data
  }, [])

  const register = useCallback(async (formData) => {
    const data = await authService.registerUser(formData)
    return data
  }, [])

  const logout = useCallback(async () => {
    setLogoutLoading(true)
    try {
      await authService.logoutUser()
    } finally {
      setUser(null)
      clearAccessToken()
      clearPendingPurchase()
      setLogoutLoading(false)
      window.dispatchEvent(new CustomEvent('auth:session-expired'))
    }
  }, [])

  const restoreSession = useCallback(async () => {
    setAuthLoading(true)
    const data = await authService.refreshSession()
    if (data?.accessToken) {
      setAccessToken(data.accessToken)
      if (data.user) {
        setUser(data.user)
        userRef.current = data.user
      }
    }
    setAuthLoading(false)
  }, [])

  const roles = user?.roles ?? []
  const isAdmin = roles.includes('Admin')
  const isCliente = roles.includes('Cliente')

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin,
    isCliente,
    authLoading,
    logoutLoading,
    login,
    register,
    logout,
    restoreSession,
  }), [user, isAdmin, isCliente, authLoading, logoutLoading, login, register, logout, restoreSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
