import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Plus,
  RotateCcw,
} from 'lucide-react'
import PageTitle from '../components/common/PageTitle'
import SaleDetailModal from '../components/sales/SaleDetailModal'
import SaleFormModal from '../components/sales/SaleFormModal'
import { useAuth } from '../context/AuthContext'
import salesService from '../services/salesService'
import { formatCurrency, formatDateTime } from '../utils/formatters'

const emptyFilters = {
  date_from: '',
  date_to: '',
  branch_id: '',
  seller_id: '',
  status: '',
}

const emptyPagination = {
  current_page: 1,
  per_page: 20,
  total: 0,
  last_page: 1,
  from: null,
  to: null,
}

function getErrorMessage(error) {
  const response = error.response?.data
  const validationMessages = response?.errors
    ? Object.values(response.errors).flat().join(' ')
    : ''

  return validationMessages || response?.message || 'No fue posible consultar las ventas.'
}

function StatusLabel({ status }) {
  const paid = status === 'pagada'

  return (
    <span className={paid
      ? 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700'
      : 'inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700'}>
      {paid ? 'Pagada' : 'Cancelada'}
    </span>
  )
}

function SalesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [sales, setSales] = useState([])
  const [branches, setBranches] = useState([])
  const [sellers, setSellers] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const [pagination, setPagination] = useState(emptyPagination)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [error, setError] = useState('')
  const [catalogError, setCatalogError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState(null)

  const loadSales = useCallback(async (pageNumber = 1, filtersToUse = appliedFilters) => {
    setLoading(true)
    setError('')

    const params = Object.fromEntries(
      Object.entries({ ...filtersToUse, page: pageNumber }).filter(([, value]) => value !== ''),
    )

    try {
      const response = await salesService.getSales(params)
      setSales(response.data || [])
      setPagination(response.meta?.pagination || emptyPagination)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setSales([])
      setPagination(emptyPagination)
    } finally {
      setLoading(false)
    }
  }, [appliedFilters])

  useEffect(() => {
    loadSales(page, appliedFilters)
  }, [page, appliedFilters, loadSales])

  useEffect(() => {
    let active = true

    const loadCatalogs = async () => {
      setCatalogLoading(true)
      setCatalogError('')

      try {
        const requests = [salesService.getBranches()]
        if (isAdmin) requests.push(salesService.getSellers())

        const [branchResponse, sellerResponse] = await Promise.all(requests)

        if (active) {
          setBranches(branchResponse.data || [])
          setSellers(sellerResponse?.data || [])
        }
      } catch (requestError) {
        if (active) {
          setCatalogError(getErrorMessage(requestError))
        }
      } finally {
        if (active) setCatalogLoading(false)
      }
    }

    loadCatalogs()

    return () => {
      active = false
    }
  }, [isAdmin])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const applyFilters = (event) => {
    event.preventDefault()
    setPage(1)
    setAppliedFilters({ ...filters })
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setPage(1)
  }

  const handleCreated = async () => {
    setShowCreate(false)
    setPage(1)
    await loadSales(1, appliedFilters)
  }

  const handleChanged = async () => {
    await loadSales(page, appliedFilters)
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageTitle
        eyebrow="ADMINISTRACIÓN"
        title="Ventas"
        description="Consulta, registra y revisa las operaciones de venta."
        action={(
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            disabled={catalogLoading || branches.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} /> Nueva venta
          </button>
        )}
      />

      <form onSubmit={applyFilters} className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={16} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Filtros de búsqueda</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Fecha inicial</span>
            <div className="relative">
              <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={filters.date_from}
                onChange={(event) => updateFilter('date_from', event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Fecha final</span>
            <div className="relative">
              <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                min={filters.date_from || undefined}
                value={filters.date_to}
                onChange={(event) => updateFilter('date_to', event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Sucursal</span>
            <select
              value={filters.branch_id}
              onChange={(event) => updateFilter('branch_id', event.target.value)}
              disabled={catalogLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas las sucursales</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </label>

          {isAdmin && (
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Vendedor</span>
              <select
                value={filters.seller_id}
                onChange={(event) => updateFilter('seller_id', event.target.value)}
                disabled={catalogLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Todos los vendedores</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>{seller.name}</option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Estatus</span>
            <select
              value={filters.status}
              onChange={(event) => updateFilter('status', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos</option>
              <option value="pagada">Pagada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={14} /> Limpiar
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Filter size={14} /> Aplicar filtros
          </button>
        </div>
      </form>

      {catalogError && (
        <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          No fue posible cargar los catálogos: {catalogError}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 md:px-5">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Listado de ventas</h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {pagination.total.toLocaleString('es-MX')} registros encontrados
            </p>
          </div>
          <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
            20 registros por página
          </span>
        </div>

        {error && (
          <div role="alert" className="m-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Folio / Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                {isAdmin && <th className="px-4 py-3">Vendedor</th>}
                <th className="px-4 py-3">Sucursal</th>
                <th className="px-4 py-3 text-center">Partidas</th>
                <th className="px-4 py-3">Estatus</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <tr key={index}>
                    {Array.from({ length: isAdmin ? 8 : 7 }, (_, cell) => (
                      <td key={cell} className="px-4 py-4">
                        <div className="h-3 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-5 py-14 text-center">
                    <div className="mx-auto max-w-sm">
                      <p className="text-sm font-semibold text-slate-700">No hay ventas en este periodo</p>
                      <p className="mt-1 text-xs text-slate-400">Cambia los filtros o registra una nueva venta.</p>
                    </div>
                  </td>
                </tr>
              ) : sales.map((sale) => (
                <tr key={sale.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-bold text-slate-800">{sale.folio}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{formatDateTime(sale.sold_at)}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{sale.customer_name}</td>
                  {isAdmin && <td className="px-4 py-3.5 text-xs text-slate-600">{sale.user?.name || '—'}</td>}
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-medium text-slate-700">{sale.branch?.name || '—'}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{sale.branch?.city}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-slate-600">{sale.items_count ?? '—'}</td>
                  <td className="px-4 py-3.5"><StatusLabel status={sale.status} /></td>
                  <td className="px-4 py-3.5 text-right text-xs font-bold tabular-nums text-slate-800">{formatCurrency(sale.total)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSaleId(sale.id)}
                      aria-label={`Ver detalle de ${sale.folio}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye size={13} /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 md:px-5">
          <p className="text-[11px] text-slate-400">
            {pagination.total > 0
              ? `Mostrando ${pagination.from}–${pagination.to} de ${pagination.total.toLocaleString('es-MX')}`
              : 'Sin registros'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || pagination.current_page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="min-w-[70px] text-center text-[11px] font-semibold text-slate-600">
              {pagination.current_page} / {pagination.last_page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pagination.last_page, current + 1))}
              disabled={loading || pagination.current_page >= pagination.last_page}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {showCreate && (
        <SaleFormModal
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {selectedSaleId && (
        <SaleDetailModal
          saleId={selectedSaleId}
          canCancel={isAdmin}
          onClose={() => setSelectedSaleId(null)}
          onChanged={handleChanged}
        />
      )}
    </div>
  )
}

export default SalesPage
