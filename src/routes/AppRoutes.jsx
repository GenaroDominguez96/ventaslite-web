import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ModulePlaceholder from '../components/common/ModulePlaceholder'
import DashboardPage from '../pages/DashboardPage'

function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reportes"
      section="Análisis"
      description="Consulta los reportes de ventas y el asistente de IA del periodo seleccionado."
    />
  )
}

function SalesPage() {
  return (
    <ModulePlaceholder
      title="Ventas"
      section="Administración"
      description="Consulta las ventas, registra nuevas operaciones y revisa su detalle."
    />
  )
}

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default AppRoutes
