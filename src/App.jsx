import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChevronDown,
  CircleHelp, CreditCard, LayoutDashboard, LogOut, Menu, Package,
  Search, Settings, ShoppingBag, Sparkles, Store, Users, X,
} from 'lucide-react'
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useState } from 'react'

const navigation = [
  { label: 'General', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Administración', items: [
    { to: '/ventas', label: 'Ventas', icon: ShoppingBag },
    { to: '/productos', label: 'Productos', icon: Package },
    { to: '/sucursales', label: 'Sucursales', icon: Store },
    { to: '/vendedores', label: 'Vendedores', icon: Users },
  ] },
  { label: 'Análisis', items: [
    { to: '/reportes', label: 'Reportes', icon: Activity },
    { to: '/asistente', label: 'Asistente IA', icon: Sparkles },
  ] },
]

const salesData = [
  { month: 'Ene', total: 68000 }, { month: 'Feb', total: 74000 },
  { month: 'Mar', total: 71000 }, { month: 'Abr', total: 89000 },
  { month: 'May', total: 84000 }, { month: 'Jun', total: 96000 },
  { month: 'Jul', total: 91000 }, { month: 'Ago', total: 108000 },
  { month: 'Sep', total: 101000 }, { month: 'Oct', total: 119000 },
  { month: 'Nov', total: 113000 }, { month: 'Dic', total: 138000 },
]

const recentSales = [
  { folio: 'VNT-002541', customer: 'Comercializadora del Centro', date: '25 nov, 2026', branch: 'Toluca', amount: 8450, status: 'Pagada' },
  { folio: 'VNT-002540', customer: 'María Fernanda López', date: '25 nov, 2026', branch: 'Metepec', amount: 3240, status: 'Pagada' },
  { folio: 'VNT-002539', customer: 'Distribuidora San José', date: '24 nov, 2026', branch: 'Lerma', amount: 12680, status: 'Pendiente' },
  { folio: 'VNT-002538', customer: 'Roberto Hernández', date: '24 nov, 2026', branch: 'Toluca', amount: 1890, status: 'Pagada' },
  { folio: 'VNT-002537', customer: 'Abarrotes La Esperanza', date: '23 nov, 2026', branch: 'Zinacantepec', amount: 5670, status: 'Cancelada' },
]

const money = value => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <button aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#172554] text-white transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500"><ShoppingBag size={19} /></div>
            <div><div className="text-[17px] font-bold tracking-tight">VentasLite</div><div className="text-[10px] text-blue-200/70">GESTIÓN COMERCIAL</div></div>
          </div>
          <button className="rounded-lg p-2 text-blue-100 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Cerrar menú"><X size={18}/></button>
        </div>
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {navigation.map(group => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-blue-200/50">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon
                  return <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'text-blue-100/75 hover:bg-white/10 hover:text-white'}`}><Icon size={17} strokeWidth={1.8}/>{item.label}</NavLink>
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-amber-950">GA</div>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Genaro Admin</p><p className="text-[10px] text-blue-200/60">Administrador</p></div>
            <button aria-label="Cerrar sesión" className="text-blue-200/60 hover:text-white"><LogOut size={16}/></button>
          </div>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-blue-100/65 hover:bg-white/5 hover:text-white"><Settings size={16}/> Configuración</button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-blue-100/65 hover:bg-white/5 hover:text-white"><CircleHelp size={16}/> Centro de ayuda</button>
        </div>
      </aside>
    </>
  )
}

function Header({ onMenu }) {
  return <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
    <div className="flex items-center gap-3">
      <button onClick={onMenu} aria-label="Abrir menú" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={20}/></button>
      <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><span>VentasLite</span><span>/</span><span className="font-semibold text-slate-700">Panel de control</span></div>
      <div className="text-sm font-semibold text-slate-800 sm:hidden">Panel de control</div>
    </div>
    <div className="flex items-center gap-2 md:gap-4">
      <div className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex"><Search size={15} className="text-slate-400"/><span className="text-xs text-slate-400">Buscar en el sistema...</span><span className="ml-auto rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</span></div>
      <button aria-label="Notificaciones" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={19}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"/></button>
      <div className="hidden h-8 border-l border-slate-200 sm:block"/>
      <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">GA</div><span className="hidden text-left sm:block"><span className="block text-xs font-semibold text-slate-700">Genaro Admin</span><span className="block text-[10px] text-slate-400">Administrador</span></span><ChevronDown size={14} className="hidden text-slate-400 sm:block"/></button>
    </div>
  </header>
}

function PageTitle({ eyebrow, title, description, action }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p><h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1><p className="mt-1.5 text-sm text-slate-500">{description}</p></div>{action}</div>
}

function StatCard({ title, value, change, positive, icon: Icon, iconBg, iconColor }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
    <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-500">{title}</p><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}><Icon size={17} className={iconColor}/></div></div>
    <p className="mt-4 text-[25px] font-bold tracking-tight text-slate-900">{value}</p>
    <div className="mt-2 flex items-center gap-1.5 text-[11px]"><span className={`flex items-center gap-0.5 font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span><span className="text-slate-400">vs. periodo anterior</span></div>
  </div>
}

function Dashboard() {
  return <div className="mx-auto max-w-[1440px]">
    <PageTitle eyebrow="PANEL GENERAL" title="¡Bienvenido de nuevo!" description="Aquí tienes el resumen de lo que sucede en tu negocio." action={<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><CalendarDays size={15}/> Últimos 30 días <ChevronDown size={14}/></button>}/>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Ventas totales" value="$1,284,520" change="12.8%" positive icon={CreditCard} iconBg="bg-blue-50" iconColor="text-blue-600"/>
      <StatCard title="Número de ventas" value="2,458" change="8.2%" positive icon={ShoppingBag} iconBg="bg-violet-50" iconColor="text-violet-600"/>
      <StatCard title="Ticket promedio" value="$522.58" change="3.4%" positive icon={Activity} iconBg="bg-emerald-50" iconColor="text-emerald-600"/>
      <StatCard title="Productos activos" value="142" change="2.1%" positive={false} icon={Package} iconBg="bg-amber-50" iconColor="text-amber-600"/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-800">Resumen de ventas</h2><p className="mt-1 text-xs text-slate-400">Comportamiento de ventas durante el año</p></div><span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">Datos de demostración</span></div>
        <div className="mb-2"><p className="text-2xl font-bold text-slate-900">$1,284,520.00</p><p className="mt-1 text-[11px] text-green-600">Indicadores ilustrativos</p></div>
        <div className="h-[245px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={salesData} margin={{ top: 15, right: 8, left: 0, bottom: 0 }}><CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `$${v/1000}k`} width={42}/><Tooltip formatter={v => money(v)} contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}/><Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }}/></LineChart></ResponsiveContainer></div>
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-800">Ventas por sucursal</h2><p className="mt-1 text-xs text-slate-400">Distribución ilustrativa</p></div><span className="text-[10px] font-semibold text-slate-400">DEMO</span></div>
        <div className="space-y-5 pt-2">
          {[['Toluca',42,'$539,498'],['Metepec',28,'$359,666'],['Lerma',19,'$244,059'],['Zinacantepec',11,'$141,297']].map(([name,pct,total])=><div key={name}><div className="mb-2 flex justify-between text-xs"><span className="font-medium text-slate-700">{name}</span><span className="font-semibold text-slate-600">{total}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }}/></div><p className="mt-1 text-[10px] text-slate-400">{pct}% de las ventas</p></div>)}
        </div>
      </section>
    </div>
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6"><div><h2 className="text-sm font-bold text-slate-800">Ventas recientes</h2><p className="mt-1 text-xs text-slate-400">Registros ficticios para validar el diseño</p></div><NavLink to="/ventas" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Ver todas las ventas →</NavLink></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400"><tr>{['Folio','Cliente','Fecha','Sucursal','Importe','Estatus'].map(h=><th key={h} className="px-6 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{recentSales.map(s=><tr key={s.folio} className="text-xs hover:bg-slate-50/60"><td className="px-6 py-4 font-semibold text-blue-700">{s.folio}</td><td className="px-6 py-4 font-medium text-slate-700">{s.customer}</td><td className="px-6 py-4 text-slate-500">{s.date}</td><td className="px-6 py-4 text-slate-500">{s.branch}</td><td className="px-6 py-4 font-semibold text-slate-800">{money(s.amount)}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${s.status==='Pagada'?'bg-green-50 text-green-700':s.status==='Pendiente'?'bg-amber-50 text-amber-700':'bg-red-50 text-red-600'}`}>{s.status}</span></td></tr>)}</tbody></table></div>
    </section>
    <p className="mt-5 text-center text-[10px] text-slate-400">Datos demostrativos: no provienen de la API ni representan operaciones reales.</p>
  </div>
}

const placeholders = {
  '/ventas': ['Administración', 'Ventas', 'Consulta y administra las operaciones de venta.'],
  '/productos': ['Administración', 'Productos', 'Consulta el catálogo y disponibilidad de productos.'],
  '/sucursales': ['Administración', 'Sucursales', 'Administra las sucursales de tu negocio.'],
  '/vendedores': ['Administración', 'Vendedores', 'Consulta los usuarios y vendedores del sistema.'],
  '/reportes': ['Análisis', 'Reportes', 'Analiza el comportamiento comercial del negocio.'],
  '/asistente': ['Análisis', 'Asistente IA', 'Consulta información comercial en lenguaje natural.'],
}

function Placeholder({ config }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles size={22}/></div><h1 className="text-lg font-bold text-slate-800">{config[1]}</h1><p className="mt-2 text-sm text-slate-500">{config[2]}</p><p className="mt-4 text-xs text-slate-400">Módulo preparado para una siguiente etapa de desarrollo.</p></div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="min-h-screen bg-[#f1f5f9]">
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)}/>
    <div className="min-h-screen lg:pl-[258px]">
      <Header onMenu={() => setMenuOpen(true)}/>
      <main className="px-4 py-7 md:px-8 md:py-9">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          {Object.entries(placeholders).map(([path, config]) => <Route key={path} path={path} element={<Placeholder config={config}/>}/>)}
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </main>
      <footer className="border-t border-slate-200/80 px-4 py-5 text-center text-[10px] text-slate-400 md:px-8">© 2026 VentasLite · Sistema de gestión comercial</footer>
    </div>
  </div>
}

export default App
