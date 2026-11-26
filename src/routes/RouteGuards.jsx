import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SessionLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm font-medium text-slate-500">Verificando sesión...</p>
    </main>
  )
}

export function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <SessionLoading />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function GuestOnly() {
  const { user, loading } = useAuth()

  if (loading) {
    return <SessionLoading />
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
