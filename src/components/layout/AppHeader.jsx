import { LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AppHeader({ onOpenMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const roleLabel = user?.role === 'admin' ? 'Administrador' : 'Vendedor'
  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span>VentasLite</span>
          <span>/</span>
          <span className="font-semibold text-slate-700">Panel de control</span>
        </div>

        <div className="text-sm font-semibold text-slate-800 sm:hidden">
          Panel de control
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
          {initials}
        </div>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold text-slate-700">{user?.name}</span>
          <span className="block text-[10px] text-slate-400">{roleLabel}</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
