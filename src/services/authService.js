import apiClient from './apiClient'

const TOKEN_KEY = 'ventaslite_token'

const authService = {
  async login(credentials) {
    const response = await apiClient.post('/login', credentials)
    const { token, user } = response.data?.data ?? {}

    if (!token || !user) {
      throw new Error('La respuesta de autenticación no contiene los datos esperados.')
    }

    localStorage.setItem(TOKEN_KEY, token)

    return user
  },

  async me() {
    const response = await apiClient.get('/me')
    return response.data?.data ?? null
  },

  async logout() {
    try {
      await apiClient.post('/logout')
    } finally {
      this.clearSession()
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
  },

  hasToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  },
}

export default authService
