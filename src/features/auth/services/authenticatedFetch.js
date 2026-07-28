import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore.js'
import { refreshSession } from './authService.js'

let refreshPromise = null

export function setRefreshPromise(promise) {
  refreshPromise = promise
}

export function clearRefreshPromise() {
  refreshPromise = null
}

export async function authenticatedFetch(url, options = {}) {
  const token = getAccessToken()
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshSession().then((data) => {
        refreshPromise = null
        return data
      })
    }

    const refreshData = await refreshPromise

    if (refreshData?.accessToken) {
      setAccessToken(refreshData.accessToken)
      const newHeaders = { ...options.headers, Authorization: `Bearer ${refreshData.accessToken}` }
      response = await fetch(url, { ...options, headers: newHeaders })
    } else {
      clearAccessToken()
      window.dispatchEvent(new CustomEvent('auth:session-expired'))
      throw new Error('Sesión expirada. Inicia sesión nuevamente.')
    }
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.')
  }

  return response
}
