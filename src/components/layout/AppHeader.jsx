import { Bell, ChevronDown, Menu, Search } from 'lucide-react'

function AppHeader({ onOpenMenu }) {
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

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex">
          <Search size={15} className="text-slate-400" />
          <span className="text-xs text-slate-400">Buscar en el sistema...</span>
          <span className="ml-auto rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘ K
          </span>
        </div>

        <button
          type="button"
          aria-label="Notificaciones (demostración)"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 border-l border-slate-200 sm:block" />

        <div className="flex items-center gap-2 rounded-lg p-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
            GA
          </div>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold text-slate-700">Genaro Admin</span>
            <span className="block text-[10px] text-slate-400">Administrador · Demo</span>
          </span>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
