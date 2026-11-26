import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    if (!authService.hasToken()) {
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    authService.me()
      .then((currentUser) => {
        if (mounted) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        authService.clearSession()
        if (mounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await authService.login(credentials)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      authService.clearSession()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}
