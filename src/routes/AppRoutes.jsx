import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ModulePlaceholder from '../components/common/ModulePlaceholder'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import SalesPage from '../pages/SalesPage'
import { GuestOnly, RequireAuth } from './RouteGuards'

function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reportes"
      section="Análisis"
      description="Consulta los reportes de ventas y el asistente de IA del periodo seleccionado."
    />
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ventas" element={<SalesPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
