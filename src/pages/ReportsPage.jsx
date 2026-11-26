import { useCallback, useEffect, useState } from 'react'
import { Download, LoaderCircle, Sparkles } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageTitle from '../components/common/PageTitle'
import ReportFilters from '../components/reports/ReportFilters'
import reportsService from '../services/reportsService'
import salesService from '../services/salesService'
import { formatCurrency } from '../utils/formatters'
import { getDefaultReportRange, reportParams } from '../utils/reportFilters'

function ExportButton({ report, onExport, exporting, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onExport(report)}
      disabled={disabled || exporting === report}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={14} />
      {exporting === report ? 'Exportando...' : 'Exportar CSV'}
    </button>
  )
}

function ReportSection({ title, description, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 md:px-5">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {description && <p className="mt-1 text-[11px] text-slate-400">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
      <LoaderCircle size={17} className="animate-spin" />
      Calculando reporte...
    </div>
  )
}

function EmptyState() {
  return <p className="px-4 py-12 text-center text-sm text-slate-400">No hay ventas en este periodo.</p>
}

function ReportsPage() {
  const [filters, setFilters] = useState(getDefaultReportRange)
  const [appliedFilters, setAppliedFilters] = useState(getDefaultReportRange)
  const [branches, setBranches] = useState([])
  const [topBy, setTopBy] = useState('units')
  const [topProducts, setTopProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [branchCategory, setBranchCategory] = useState({ branches: [], categories: [], rows: [] })
  const [margins, setMargins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState('')
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantAnswer, setAssistantAnswer] = useState('')
  const [assistantError, setAssistantError] = useState('')
  const [assistantLoading, setAssistantLoading] = useState('')

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = reportParams(appliedFilters)

    try {
      const [topResponse, sellerResponse, matrixResponse, marginResponse] = await Promise.all([
        reportsService.getTopProducts({ ...params, by: topBy }),
        reportsService.getSellerRanking(params),
        reportsService.getBranchCategory(params),
        reportsService.getMargins(params),
      ])

      setTopProducts(topResponse.data || [])
      setSellers(sellerResponse.data || [])
      setBranchCategory(matrixResponse.data || { branches: [], categories: [], rows: [] })
      setMargins(marginResponse.data || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No fue posible consultar los reportes.')
      setTopProducts([])
      setSellers([])
      setBranchCategory({ branches: [], categories: [], rows: [] })
      setMargins([])
    } finally {
      setLoading(false)
    }
  }, [appliedFilters, topBy])

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

    const params = {
      ...reportParams(appliedFilters),
      ...(report === 'top-products' ? { by: topBy } : {}),
    }

    try {
      await reportsService.exportReport(report, params)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No fue posible exportar el reporte.')
    } finally {
      setExporting('')
    }
  }

  const runAssistant = async (mode) => {
    const question = assistantQuestion.trim()
    if (mode === 'question' && !question) return

    setAssistantLoading(mode)
    setAssistantError('')
    setAssistantAnswer('')

    try {
      const params = reportParams(appliedFilters)
      const response = mode === 'summary'
        ? await reportsService.getExecutiveSummary(params)
        : await reportsService.askAssistant({ ...params, question })

      setAssistantAnswer(response.data?.answer || '')
    } catch (requestError) {
      setAssistantError(
        requestError.response?.data?.message
          || 'No fue posible consultar el asistente de IA.',
      )
    } finally {
      setAssistantLoading('')
    }
  }

  const submitAssistantQuestion = (event) => {
    event.preventDefault()
    runAssistant('question')
  }

  const topChartData = topProducts.map((product) => ({
    ...product,
    chartValue: topBy === 'amount' ? Number(product.amount_sold) : Number(product.units_sold),
    chartLabel: product.name.length > 24 ? product.name.slice(0, 22) + '…' : product.name,
  }))

  const marginChartData = margins.map((item) => ({
    ...item,
    chartValue: Number(item.gross_profit),
  }))

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle
        eyebrow="ANÁLISIS"
        title="Reportes"
        description="Indicadores agregados de ventas, productos, vendedores y margen."
      />

      <ReportFilters value={filters} branches={branches} onChange={updateFilter} onSubmit={applyFilters} />

      <ReportSection
        title="Asistente de IA"
        description="Consulta los resultados del periodo filtrado o genera un resumen ejecutivo."
      >
        <div className="p-4 md:p-5">
          <form onSubmit={submitAssistantQuestion}>
            <label htmlFor="report-assistant-question" className="mb-2 block text-xs font-semibold text-slate-700">
              ¿Qué deseas conocer de tus ventas?
            </label>
            <textarea
              id="report-assistant-question"
              value={assistantQuestion}
              onChange={(event) => setAssistantQuestion(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Ej. ¿Qué sucursal tuvo más ventas en el periodo?"
              className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                type="submit"
                disabled={!assistantQuestion.trim() || Boolean(assistantLoading)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assistantLoading === 'question' ? 'Consultando...' : 'Consultar'}
              </button>
              <button
                type="button"
                onClick={() => runAssistant('summary')}
                disabled={Boolean(assistantLoading)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={14} />
                {assistantLoading === 'summary' ? 'Generando...' : 'Resumen ejecutivo'}
              </button>
            </div>
          </form>

          {assistantLoading && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400" role="status">
              <LoaderCircle size={15} className="animate-spin" />
              Procesando información del periodo...
            </div>
          )}

          {assistantError && (
            <p role="alert" className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              {assistantError}
            </p>
          )}

          {assistantAnswer && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles size={14} />
                Respuesta
              </div>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-700" aria-live="polite">
                {assistantAnswer}
              </p>
            </div>
          )}
        </div>
      </ReportSection>

      {error && (
        <p role="alert" className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="space-y-5">
        <ReportSection
          title="Top 10 productos"
          description="Productos ordenados por unidades vendidas o importe vendido."
          action={(
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTopBy('units')}
                  aria-pressed={topBy === 'units'}
                  className={topBy === 'units'
                    ? 'rounded-md bg-white px-3 py-1.5 text-[10px] font-semibold text-blue-700 shadow-sm'
                    : 'rounded-md px-3 py-1.5 text-[10px] font-semibold text-slate-500'}
                >
                  Unidades
                </button>
                <button
                  type="button"
                  onClick={() => setTopBy('amount')}
                  aria-pressed={topBy === 'amount'}
                  className={topBy === 'amount'
                    ? 'rounded-md bg-white px-3 py-1.5 text-[10px] font-semibold text-blue-700 shadow-sm'
                    : 'rounded-md px-3 py-1.5 text-[10px] font-semibold text-slate-500'}
                >
                  Importe
                </button>
              </div>
              <ExportButton
                report="top-products"
                onExport={exportReport}
                exporting={exporting}
                disabled={loading}
              />
            </div>
          )}
        >
          {loading ? <LoadingState /> : topProducts.length === 0 ? <EmptyState /> : (
            <div className="h-[390px] w-full p-3 sm:p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topChartData} layout="vertical" margin={{ top: 8, right: 18, left: 8, bottom: 12 }}>
                  <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(value) => topBy === 'amount'
                      ? '$' + new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
                      : value}
                    label={{
                      value: topBy === 'amount' ? 'Importe vendido (MXN)' : 'Unidades vendidas',
                      position: 'insideBottom',
                      offset: -4,
                      fill: '#64748b',
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="chartLabel"
                    width={125}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      topBy === 'amount' ? formatCurrency(value) : Number(value).toLocaleString('es-MX'),
                      topBy === 'amount' ? 'Importe vendido' : 'Unidades vendidas',
                    ]}
                    contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="chartValue" name={topBy === 'amount' ? 'Importe' : 'Unidades'} fill="#2563eb" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ReportSection>

        <ReportSection
          title="Ranking de vendedores"
          description="Total vendido, número de ventas y ticket promedio."
          action={(
            <ExportButton
              report="sellers"
              onExport={exportReport}
              exporting={exporting}
              disabled={loading}
            />
          )}
        >
          {loading ? <LoadingState /> : sellers.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-slate-50/80">
                  <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3">Vendedor</th>
                    <th className="px-4 py-3 text-right">Total vendido</th>
                    <th className="px-4 py-3 text-right">Número de ventas</th>
                    <th className="px-5 py-3 text-right">Ticket promedio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellers.map((seller, index) => (
                    <tr key={seller.seller_id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                          {index + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{seller.seller_name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs font-semibold tabular-nums text-slate-800">{formatCurrency(seller.total_sold)}</td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-600">{Number(seller.sales_count).toLocaleString('es-MX')}</td>
                      <td className="px-5 py-3.5 text-right text-xs text-slate-600">{formatCurrency(seller.average_ticket)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportSection>

        <ReportSection
          title="Ventas por sucursal y categoría"
          description="Tabla cruzada con el importe vendido en cada combinación."
          action={(
            <ExportButton
              report="branch-category"
              onExport={exportReport}
              exporting={exporting}
              disabled={loading}
            />
          )}
        >
          {loading ? <LoadingState /> : branchCategory.rows.length === 0 ? <EmptyState /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50/80">
                  <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    <th className="sticky left-0 bg-slate-50 px-5 py-3">Sucursal</th>
                    {branchCategory.categories.map((category) => (
                      <th key={category.id} className="whitespace-nowrap px-4 py-3 text-right">{category.name}</th>
                    ))}
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branchCategory.rows.map((branch) => (
                    <tr key={branch.branch_id} className="hover:bg-slate-50/70">
                      <th className="sticky left-0 bg-white px-5 py-3.5 text-xs font-semibold text-slate-700">{branch.branch_name}</th>
                      {branchCategory.categories.map((category) => (
                        <td key={category.id} className="whitespace-nowrap px-4 py-3.5 text-right text-xs tabular-nums text-slate-600">
                          {formatCurrency(branch.categories[String(category.id)] || '0.00')}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-bold tabular-nums text-slate-800">
                        {formatCurrency(branch.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportSection>

        <ReportSection
          title="Margen por categoría"
          description="Utilidad bruta calculada como (precio unitario − costo) × cantidad."
          action={(
            <ExportButton
              report="margins"
              onExport={exportReport}
              exporting={exporting}
              disabled={loading}
            />
          )}
        >
          {loading ? <LoadingState /> : margins.length === 0 ? <EmptyState /> : (
            <>
              <div className="h-[300px] w-full px-3 pt-4 sm:px-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marginChartData} margin={{ top: 8, right: 18, left: 8, bottom: 12 }}>
                    <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="category_name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      label={{ value: 'Categoría', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickFormatter={(value) => '$' + new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}
                      label={{ value: 'Utilidad bruta (MXN)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                      width={58}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Utilidad bruta']}
                      contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                    />
                    <Bar dataKey="chartValue" name="Utilidad bruta" fill="#0f766e" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto border-t border-slate-100">
                <table className="w-full min-w-[440px] text-left">
                  <thead className="bg-slate-50/80">
                    <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-3">Categoría</th>
                      <th className="px-4 py-3 text-right">Unidades vendidas</th>
                      <th className="px-5 py-3 text-right">Utilidad bruta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {margins.map((margin) => (
                      <tr key={margin.category_id}>
                        <td className="px-5 py-3 text-xs font-semibold text-slate-700">{margin.category_name}</td>
                        <td className="px-4 py-3 text-right text-xs text-slate-600">{Number(margin.units_sold).toLocaleString('es-MX')}</td>
                        <td className="px-5 py-3 text-right text-xs font-bold tabular-nums text-slate-800">{formatCurrency(margin.gross_profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </ReportSection>
      </div>
    </div>
  )
}

export default ReportsPage
