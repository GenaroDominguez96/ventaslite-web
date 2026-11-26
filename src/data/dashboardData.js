export const salesData = [
  { month: 'Ene', total: 68000 },
  { month: 'Feb', total: 74000 },
  { month: 'Mar', total: 71000 },
  { month: 'Abr', total: 89000 },
  { month: 'May', total: 84000 },
  { month: 'Jun', total: 96000 },
  { month: 'Jul', total: 91000 },
  { month: 'Ago', total: 108000 },
  { month: 'Sep', total: 101000 },
  { month: 'Oct', total: 119000 },
  { month: 'Nov', total: 113000 },
  { month: 'Dic', total: 138000 },
]

export const branchSales = [
  { name: 'Toluca', percentage: 42, total: 539498 },
  { name: 'Metepec', percentage: 28, total: 359666 },
  { name: 'Lerma', percentage: 19, total: 244059 },
  { name: 'Zinacantepec', percentage: 11, total: 141297 },
]

export const recentSales = [
  {
    folio: 'VNT-002541',
    customer: 'Comercializadora del Centro',
    date: '25 nov, 2026',
    branch: 'Toluca',
    amount: 8450,
    status: 'Pagada',
  },
  {
    folio: 'VNT-002540',
    customer: 'María Fernanda López',
    date: '25 nov, 2026',
    branch: 'Metepec',
    amount: 3240,
    status: 'Pagada',
  },
  {
    folio: 'VNT-002539',
    customer: 'Distribuidora San José',
    date: '24 nov, 2026',
    branch: 'Lerma',
    amount: 12680,
    status: 'Pendiente',
  },
  {
    folio: 'VNT-002538',
    customer: 'Roberto Hernández',
    date: '24 nov, 2026',
    branch: 'Toluca',
    amount: 1890,
    status: 'Pagada',
  },
  {
    folio: 'VNT-002537',
    customer: 'Abarrotes La Esperanza',
    date: '23 nov, 2026',
    branch: 'Zinacantepec',
    amount: 5670,
    status: 'Cancelada',
  },
]

export const dashboardStats = [
  {
    title: 'Ventas totales',
    value: '$1,284,520',
    change: '12.8%',
    positive: true,
    iconName: 'sales',
  },
  {
    title: 'Número de ventas',
    value: '2,458',
    change: '8.2%',
    positive: true,
    iconName: 'orders',
  },
  {
    title: 'Ticket promedio',
    value: '$522.58',
    change: '3.4%',
    positive: true,
    iconName: 'average',
  },
  {
    title: 'Productos activos',
    value: '142',
    change: '2.1%',
    positive: false,
    iconName: 'products',
  },
]
