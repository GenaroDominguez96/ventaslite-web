import { NavLink } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  X,
} from 'lucide-react'

const navigationGroups = [
  {
    label: 'General',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Administración',
    items: [
      { to: '/ventas', label: 'Ventas', icon: ShoppingBag },
      { to: '/productos', label: 'Productos', icon: Package },
      { to: '/sucursales', label: 'Sucursales', icon: Store },
      { to: '/vendedores', label: 'Vendedores', icon: Users },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { to: '/reportes', label: 'Reportes', icon: Activity },
      { to: '/asistente', label: 'Asistente IA', icon: Sparkles },
    ],
  },
]

function AppSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#172554] text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
              <ShoppingBag size={19} />
            </div>
            <div>
              <div className="text-[17px] font-bold tracking-tight">VentasLite</div>
              <div className="text-[10px] text-blue-200/70">GESTIÓN COMERCIAL</div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-blue-100 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-blue-200/50">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20'
                            : 'text-blue-100/75 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={17} strokeWidth={1.8} />
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-amber-950">
              GA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Genaro Admin</p>
              <p className="text-[10px] text-blue-200/60">Administrador · Demo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar
