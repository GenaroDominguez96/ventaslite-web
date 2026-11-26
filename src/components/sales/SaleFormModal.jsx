import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle, Plus, Trash2, X } from 'lucide-react'
import salesService from '../../services/salesService'
import { formatCurrency } from '../../utils/formatters'

function toCents(amount) {
  const [whole, fraction = ''] = String(amount).split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2))
}

function getErrorMessage(error) {
  const response = error.response?.data
  const validationMessages = response?.errors
    ? Object.values(response.errors).flat().join(' ')
    : ''

  return validationMessages || response?.message || 'No fue posible registrar la venta. Intenta nuevamente.'
}

function SaleFormModal({ branches, onClose, onCreated }) {
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [branchId, setBranchId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    salesService.getProducts()
      .then((response) => {
        if (active) {
          setProducts(response.data || [])
        }
      })
      .catch((requestError) => {
        if (active) {
          setProductsError(getErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (active) {
          setProductsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + toCents(item.product.price) * item.quantity, 0),
    [items],
  )
  const taxCents = Math.round(subtotalCents * 0.16)
  const totalCents = subtotalCents + taxCents

  const addProduct = () => {
    const product = products.find((item) => String(item.id) === selectedProductId)

    if (!product) {
      return
    }

    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)

      if (existing) {
        return current.map((item) => item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + Number(selectedQuantity), product.stock) }
          : item)
      }

      if (current.length >= 6) {
        setError('La venta admite un máximo de seis productos distintos.')
        return current
      }

      return [...current, { product, quantity: Number(selectedQuantity) }]
    })

    setError('')
    setSelectedProductId('')
    setSelectedQuantity(1)
  }

  const updateQuantity = (productId, quantity) => {
    const product = products.find((item) => item.id === productId)
    const nextQuantity = Math.max(1, Math.min(Number(quantity) || 1, product?.stock || 1))

    setItems((current) => current.map((item) => item.product.id === productId
      ? { ...item, quantity: nextQuantity }
      : item))
  }

  const removeProduct = (productId) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!items.length) {
      setError('Agrega al menos un producto a la venta.')
      return
    }

    setSaving(true)

    try {
      await salesService.createSale({
        branch_id: Number(branchId),
        customer_name: customerName.trim(),
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      })

      onCreated()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-form-title"
        className="my-3 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-0"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-blue-600">Ventas</p>
            <h2 id="sale-form-title" className="mt-1 text-lg font-bold text-slate-900">Registrar venta</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-110px)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-1">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Sucursal</span>
              <select
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecciona...</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name} · {branch.city}</option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Cliente</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                maxLength={150}
                required
                placeholder="Nombre del cliente"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Forma de pago</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Productos</h3>

            {productsLoading ? (
              <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                <LoaderCircle size={17} className="animate-spin" /> Cargando productos disponibles...
              </div>
            ) : productsError ? (
              <p className="py-2 text-sm text-rose-600">{productsError}</p>
            ) : products.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">No hay productos activos con existencias disponibles.</p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Selecciona un producto...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} · {product.name} · {formatCurrency(product.price)} · Stock: {product.stock}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={products.find((product) => String(product.id) === selectedProductId)?.stock || 1}
                    value={selectedQuantity}
                    onChange={(event) => setSelectedQuantity(event.target.value)}
                    aria-label="Cantidad"
                    className="w-20 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addProduct}
                    disabled={!selectedProductId || Number(selectedQuantity) < 1}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={15} /> Agregar
                  </button>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="pb-2 font-semibold">Producto</th>
                      <th className="pb-2 font-semibold">Precio</th>
                      <th className="pb-2 font-semibold">Cantidad</th>
                      <th className="pb-2 text-right font-semibold">Importe</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.product.id}>
                        <td className="py-3 pr-3">
                          <span className="block font-semibold text-slate-700">{item.product.name}</span>
                          <span className="text-[10px] text-slate-400">{item.product.sku} · Stock {item.product.stock}</span>
                        </td>
                        <td className="py-3 text-slate-600">{formatCurrency(item.product.price)}</td>
                        <td className="py-3">
                          <input
                            type="number"
                            min="1"
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(event) => updateQuantity(item.product.id, event.target.value)}
                            aria-label={`Cantidad de ${item.product.name}`}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-700">
                          {formatCurrency((toCents(item.product.price) * item.quantity) / 100)}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button type="button" onClick={() => removeProduct(item.product.id)} aria-label={`Quitar ${item.product.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1 text-xs text-slate-500">
              <p>Subtotal: <strong className="text-slate-700">{formatCurrency(subtotalCents / 100)}</strong></p>
              <p>IVA (16 %): <strong className="text-slate-700">{formatCurrency(taxCents / 100)}</strong></p>
              <p className="pt-1 text-base font-bold text-slate-900">Total: {formatCurrency(totalCents / 100)}</p>
            </div>
            <div className="flex gap-2 sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                Cerrar
              </button>
              <button
                type="submit"
                disabled={saving || productsLoading || productsError || !items.length || !branchId || !customerName.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <LoaderCircle size={15} className="animate-spin" />}
                {saving ? 'Guardando...' : 'Registrar venta'}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
              {error}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}

export default SaleFormModal
