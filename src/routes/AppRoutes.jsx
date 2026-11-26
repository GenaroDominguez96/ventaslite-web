import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ModulePlaceholder from '../components/common/ModulePlaceholder'
import DashboardPage from '../pages/DashboardPage'

const modules = [
  {
    path: 'ventas',
    title: 'Ventas',
    section: 'Administración',
    description: 'Consulta y administra las operaciones de venta.',
  },
  {
    path: 'productos',
    title: 'Productos',
    section: 'Administración',
    description: 'Consulta el catálogo y disponibilidad de productos.',
  },
  {
    path: 'sucursales',
    title: 'Sucursales',
    section: 'Administración',
    description: 'Administra las sucursales de tu negocio.',
  },
  {
    path: 'vendedores',
    title: 'Vendedores',
    section: 'Administración',
    description: 'Consulta los usuarios y vendedores del sistema.',
  },
  {
    path: 'reportes',
    title: 'Reportes',
    section: 'Análisis',
    description: 'Analiza el comportamiento comercial del negocio.',
  },
  {
    path: 'asistente',
    title: 'Asistente IA',
    section: 'Análisis',
    description: 'Consulta información comercial en lenguaje natural.',
  },
]

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {modules.map((module) => (
          <Route
            key={module.path}
            path={`/${module.path}`}
            element={
              <ModulePlaceholder
                title={module.title}
                section={module.section}
                description={module.description}
              />
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes
