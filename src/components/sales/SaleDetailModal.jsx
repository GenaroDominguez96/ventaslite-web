import { useEffect, useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import salesService from '../../services/salesService'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

function getErrorMessage(error) {
  return error.response?.data?.message || 'No fue posible consultar la venta.'
}

function SaleDetailModal({ saleId, canCancel, onClose, onChanged }) {
  const [sale, setSale] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    let active = true

    salesService.getSale(saleId)
      .then((response) => {
        if (active) setSale(response.data)
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [saleId])

  const handleCancel = async () => {
    setCancelling(true)
    setError('')

    try {
      const response = await salesService.cancelSale(saleId)
      setSale(response.data)
      setConfirmCancel(false)
      onChanged()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-detail-title"
        className="my-3 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-0"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-blue-600">Detalle de operación</p>
            <h2 id="sale-detail-title" className="mt-1 text-lg font-bold text-slate-900">Venta</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-110px)] overflow-y-auto px-5 py-5 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" /> Cargando detalle...
            </div>
          ) : error && !sale ? (
            <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
          ) : sale ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Folio</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{sale.folio}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(sale.sold_at)}</p>
                </div>
                <span className={sale.status === 'pagada'
                  ? 'rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700'
                  : 'rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700'}>
                  {sale.status === 'pagada' ? 'Pagada' : 'Cancelada'}
                </span>
              </div>

              <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Cliente</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{sale.customer_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Sucursal</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{sale.branch?.name}</p>
                  <p className="text-xs text-slate-500">{sale.branch?.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Vendedor</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{sale.user?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Forma de pago</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-800">{sale.payment_method}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-slate-800">Productos vendidos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[440px] text-left text-xs">
                    <thead className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="pb-2 font-semibold">Producto</th>
                        <th className="pb-2 text-right font-semibold">Cantidad</th>
                        <th className="pb-2 text-right font-semibold">Precio unitario</th>
                        <th className="pb-2 text-right font-semibold">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(sale.items || []).map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 pr-3">
                            <span className="block font-semibold text-slate-700">{item.product?.name}</span>
                            <span className="text-[10px] text-slate-400">{item.product?.sku}</span>
                          </td>
                          <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                          <td className="py-3 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                          <td className="py-3 text-right font-semibold text-slate-700">{formatCurrency(item.line_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="ml-auto mt-5 max-w-xs space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>IVA (16 %)</span><span>{formatCurrency(sale.tax)}</span>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold text-slate-900">
                  <span>Total</span><span>{formatCurrency(sale.total)}</span>
                </div>
              </div>
            </>
          ) : null}

          {error && sale && (
            <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</p>
          )}

          {confirmCancel && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">¿Cancelar esta venta?</p>
              <p className="mt-1 text-xs text-amber-800">
                La operación cambiará a cancelada y las existencias de sus productos serán devueltas.
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setConfirmCancel(false)} disabled={cancelling} className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-900">
                  No, regresar
                </button>
                <button type="button" onClick={handleCancel} disabled={cancelling} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                  {cancelling && <LoaderCircle size={14} className="animate-spin" />}
                  Sí, cancelar
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
            <div>
              {canCancel && sale?.status === 'pagada' && !confirmCancel && (
                <button type="button" onClick={() => setConfirmCancel(true)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                  Cancelar venta
                </button>
              )}
            </div>
            <button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">
              Cerrar
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SaleDetailModal
