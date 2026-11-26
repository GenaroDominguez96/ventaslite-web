import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Download,
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
import ReportFilters from '../components/reports/ReportFilters'
import StatCard from '../components/common/StatCard'
import salesService from '../services/salesService'
import reportsService from '../services/reportsService'
import { formatCurrency } from '../utils/formatters'
import { getDefaultReportRange, reportParams } from '../utils/reportFilters'

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
  const [filters, setFilters] = useState(getDefaultReportRange)
  const [appliedFilters, setAppliedFilters] = useState(getDefaultReportRange)
  const [branches, setBranches] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [monthlySales, setMonthlySales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState('')

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = reportParams(appliedFilters)

    try {
      const [dashboardResponse, monthlyResponse] = await Promise.all([
        reportsService.getDashboard(params),
        reportsService.getMonthlySales(params),
      ])

      setDashboard(dashboardResponse.data)
      setMonthlySales(monthlyResponse.data || [])
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'No fue posible consultar los reportes del dashboard.',
      )
      setDashboard(null)
      setMonthlySales([])
    } finally {
      setLoading(false)
    }
  }, [appliedFilters])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  useEffect(() => {
    let active = true

    salesService.getBranches()
      .then((response) => {
        if (active) setBranches(response.data || [])
      })
      .catch(() => {
        if (active) setBranches([])
      })

    return () => {
      active = false
    }
  }, [])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const applyFilters = (event) => {
    event.preventDefault()
    setAppliedFilters({ ...filters })
  }

  const exportReport = async (report) => {
    setExporting(report)
    setError('')

    try {
      await reportsService.exportReport(report, reportParams(appliedFilters))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No fue posible exportar el reporte.')
    } finally {
      setExporting('')
    }
  }

  const change = Number(dashboard?.change_percentage || 0)
  const statValues = {
    sales: dashboard ? formatCurrency(dashboard.sales_total) : '—',
    orders: dashboard ? Number(dashboard.sales_count).toLocaleString('es-MX') : '—',
    average: dashboard ? formatCurrency(dashboard.average_ticket) : '—',
    change: dashboard ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : '—',
  }
  const chartData = monthlySales.map((month) => ({
    ...month,
    total: Number(month.total),
  }))
  const hasMonthlySales = monthlySales.some((month) => Number(month.sales_count) > 0)

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle
        eyebrow="PANEL GENERAL"
        title="Dashboard"
        description="Indicadores y comportamiento de ventas del periodo seleccionado."
        action={(
          <button
            type="button"
            onClick={() => exportReport('dashboard')}
            disabled={loading || !dashboard || exporting === 'dashboard'}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            {exporting === 'dashboard' ? 'Exportando...' : 'Exportar indicadores'}
          </button>
        )}
      />

      <ReportFilters
        value={filters}
        branches={branches}
        onChange={updateFilter}
        onSubmit={applyFilters}
      />

      {error && (
        <p role="alert" className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { key: 'sales', title: 'Ventas totales' },
          { key: 'orders', title: 'Número de ventas' },
          { key: 'average', title: 'Ticket promedio' },
          { key: 'change', title: 'Cambio vs. periodo anterior' },
        ].map((stat) => {
          const Icon = statIcons[stat.key]
          const [iconBg, iconColor] = statStyles[stat.key]
          const changeColor = stat.key === 'change' && change < 0 ? 'text-rose-600' : iconColor

          return (
            <div key={stat.key} className="relative">
              {loading && (
                <div className="absolute inset-0 z-10 animate-pulse rounded-2xl bg-slate-100/70" />
              )}
              <StatCard
                title={stat.title}
                value={statValues[stat.key]}
                icon={Icon}
                iconBg={iconBg}
                iconColor={changeColor}
              />
              {stat.key === 'change' && dashboard && (
                <div className={`pointer-events-none absolute bottom-5 right-5 ${change < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {change < 0 ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Ventas por mes</h2>
            <p className="mt-1 text-xs text-slate-400">
              Importes mensuales dentro del periodo seleccionado
            </p>
          </div>
          <button
            type="button"
            onClick={() => exportReport('monthly-sales')}
            disabled={loading || monthlySales.length === 0 || exporting === 'monthly-sales'}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={14} />
            {exporting === 'monthly-sales' ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>

        <div className="h-[320px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              Consultando ventas...
            </div>
          ) : !hasMonthlySales ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No hay ventas en este periodo.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 12, left: 12, bottom: 16 }}>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  label={{ value: 'Mes', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(value) => '
                  label={{ value: 'Ventas (MXN)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  width={58}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Ventas']}
                  labelFormatter={(label) => `Periodo: ${label}`}
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
          )}
        </div>

        <p className="mt-3 text-right text-[10px] text-slate-400">
          Importes en MXN. Las ventas canceladas no se incluyen.
        </p>
      </section>
    </div>
  )
}

export default DashboardPage
 + new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
                  label={{ value: 'Ventas (MXN)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  width={58}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Ventas']}
                  labelFormatter={(label) => `Periodo: ${label}`}
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
          )}
        </div>

        <p className="mt-3 text-right text-[10px] text-slate-400">
          Importes en MXN. Las ventas canceladas no se incluyen.
        </p>
      </section>
    </div>
  )
}

export default DashboardPage
