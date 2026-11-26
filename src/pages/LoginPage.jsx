import { useState } from 'react'
import { LockKeyhole, Mail, ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('contraseña')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login({ email, password })
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (requestError) {
      const response = requestError.response
      const validationMessage = response?.data?.errors
        ? Object.values(response.data.errors).flat()[0]
        : null
      const message = validationMessage || response?.data?.message

      if (message) {
        setError(message)
      } else if (response?.status === 422) {
        setError('Verifica los datos ingresados.')
      } else {
        setError('No fue posible conectar con el servidor. Intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1f5f9] px-4 py-10">
      <section className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ShoppingBag size={23} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">VentasLite</h1>
          <p className="mt-2 text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Correo electrónico 
              <small className="block text-xs text-slate-300">admin: admin@ventaslite.com</small>
              <small className="block text-xs text-slate-300">vendedores (1-8): vendedor1@ventaslite.com, vendedor2@ventaslite.com, etc.</small>
            </label>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@correo.com"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
              Contraseña
              <small className="block text-xs text-slate-300">default: contraseña</small>
            </label>
            <div className="relative">
              <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-7 text-center text-[11px] text-slate-400">
          Sistema interno de gestión de ventas
        </p>
      </section>
    </main>
  )
}

export default LoginPage
