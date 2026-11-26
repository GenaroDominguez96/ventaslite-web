import {
  Activity,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Package,
  ShoppingBag,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageTitle from '../components/common/PageTitle'
import StatCard from '../components/common/StatCard'
import { branchSales, dashboardStats, recentSales, salesData } from '../data/dashboardData'
import { formatCurrency } from '../utils/formatters'

const statIcons = {
  sales: CreditCard,
  orders: ShoppingBag,
  average: Activity,
  products: Package,
}

function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle
        eyebrow="PANEL GENERAL"
        title="¡Bienvenido de nuevo!"
        description="Aquí tienes el resumen de lo que sucede en tu negocio."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <CalendarDays size={15} />
            Últimos 30 días
            <ChevronDown size={14} />
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.iconName]

          return (
            <StatCard
              key={stat.iconName}
              {...stat}
              icon={Icon}
              iconBg={
                stat.iconName === 'sales'
                  ? 'bg-blue-50'
                  : stat.iconName === 'orders'
                    ? 'bg-violet-50'
                    : stat.iconName === 'average'
                      ? 'bg-emerald-50'
                      : 'bg-amber-50'
              }
              iconColor={
                stat.iconName === 'sales'
                  ? 'text-blue-600'
                  : stat.iconName === 'orders'
                    ? 'text-violet-600'
                    : stat.iconName === 'average'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
              }
            />
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Resumen de ventas</h2>
              <p className="mt-1 text-xs text-slate-400">
                Comportamiento de ventas durante el año
              </p>
            </div>
            <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">
              Datos de demostración
            </span>
          </div>

          <div className="mb-2">
            <p className="text-2xl font-bold text-slate-900">$1,284,520.00</p>
            <p className="mt-1 text-[11px] text-green-600">Indicadores ilustrativos</p>
          </div>

          <div className="h-[245px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 15, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  width={42}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Ventas por sucursal</h2>
              <p className="mt-1 text-xs text-slate-400">Distribución ilustrativa</p>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">DEMO</span>
          </div>

          <div className="space-y-5 pt-2">
            {branchSales.map((branch) => (
              <div key={branch.name}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{branch.name}</span>
                  <span className="font-semibold text-slate-600">
                    {formatCurrency(branch.total)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${branch.percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  {branch.percentage}% de las ventas
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Ventas recientes</h2>
            <p className="mt-1 text-xs text-slate-400">
              Registros ficticios para validar el diseño
            </p>
          </div>
          <NavLink
            to="/ventas"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver todas las ventas →
          </NavLink>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                {['Folio', 'Cliente', 'Fecha', 'Sucursal', 'Importe', 'Estatus'].map((heading) => (
                  <th key={heading} className="px-6 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map((sale) => (
                <tr key={sale.folio} className="text-xs hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-blue-700">{sale.folio}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{sale.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{sale.date}</td>
                  <td className="px-6 py-4 text-slate-500">{sale.branch}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        sale.status === 'Pagada'
                          ? 'bg-green-50 text-green-700'
                          : sale.status === 'Pendiente'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-5 text-center text-[10px] text-slate-400">
        Datos demostrativos: no provienen de la API ni representan operaciones reales.
      </p>
    </div>
  )
}

export default DashboardPage
