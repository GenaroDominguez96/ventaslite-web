const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatCurrency(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return currencyFormatter.format(0)
  }

  return currencyFormatter.format(amount)
}
