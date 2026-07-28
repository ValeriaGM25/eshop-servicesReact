import { IDENTITY_API_URL } from '../../../shared/config/appConfig.js'

function getUrl(path = '') {
  return `${IDENTITY_API_URL}${path}`
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

function getErrorMessage(response, data, fallback) {
  if (response.status === 401) return 'Credenciales inválidas.'
  if (response.status === 429) return 'Demasiados intentos. Intenta nuevamente más tarde.'
  const detail = data?.detail ?? data?.title
  if (detail) return detail
  return fallback
}

async function identityFetch(url, options = {}) {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error('No fue posible conectar con el servicio de autenticación.')
  }
}

export async function registerUser({ fullName, email, password, confirmPassword }) {
  const response = await identityFetch(getUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, confirmPassword }),
  })
  const data = await readJson(response)
  if (!response.ok) {
    let message = getErrorMessage(response, data, 'No fue posible registrarse.')
    if (response.status === 409) message = 'Ya existe una cuenta con ese correo electrónico.'
    if (response.status === 429) message = 'Se alcanzó el límite de registros. Intenta más tarde.'
    throw new Error(message)
  }
  return data
}

export async function loginUser({ email, password }) {
  const response = await identityFetch(getUrl('/auth/login'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await readJson(response)
  if (!response.ok) {
    throw new Error(getErrorMessage(response, data, 'Credenciales inválidas.'))
  }
  return data
}

export async function refreshSession() {
  try {
    const response = await fetch(getUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (response.status === 401) return null
    const data = await readJson(response)
    if (!response.ok) return null
    return data
  } catch {
    return null
  }
}

export async function logoutUser() {
  try {
    await fetch(getUrl('/auth/logout'), {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
  }
}

export async function getCurrentUser(accessToken) {
  const response = await identityFetch(getUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await readJson(response)
  if (!response.ok) {
    throw new Error('Sesión expirada o token inválido.')
  }
  return data
}
