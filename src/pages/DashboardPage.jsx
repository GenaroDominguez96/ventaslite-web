import {
  Activity,
  CreditCard,
  Percent,
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
import { dashboardStats, salesData } from '../data/dashboardData'
import { formatCurrency } from '../utils/formatters'

const statIcons = {
  sales: CreditCard,
  orders: ShoppingBag,
  average: Activity,
  change: Percent,
}

const statStyles = {
  sales: ['bg-blue-50', 'text-blue-600'],
  orders: ['bg-violet-50', 'text-violet-600'],
  average: ['bg-emerald-50', 'text-emerald-600'],
  change: ['bg-amber-50', 'text-amber-600'],
}

function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle
        eyebrow="PANEL GENERAL"
        title="Dashboard"
        description="Resumen de ventas del periodo seleccionado."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.iconName]
          const [iconBg, iconColor] = statStyles[stat.iconName]

          return (
            <StatCard
              key={stat.iconName}
              title={stat.title}
              value={stat.value}
              icon={Icon}
              iconBg={iconBg}
              iconColor={iconColor}
            />
          )
        })}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Ventas por mes</h2>
            <p className="mt-1 text-xs text-slate-400">
              Importe de ventas de los últimos 12 meses
            </p>
          </div>
          <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700">
            Datos de demostración
          </span>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 15, right: 12, left: 8, bottom: 4 }}
            >
              <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                width={48}
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
                name="Ventas"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-right text-[10px] text-slate-400">
          Montos expresados en MXN. Datos ilustrativos.
        </p>
      </section>
    </div>
  )
}

export default DashboardPage
