import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import DashboardPage from './pages/dashboard/DashboardPage'
import TaskListPage from './pages/tasks/TaskListPage'
import DeviationListPage from './pages/deviations/DeviationListPage'
import DocumentArchivePage from './pages/documents/DocumentArchivePage'
import ConditionListPage from './pages/condition/ConditionListPage'
import VedlikeholdshistorikkPage from './pages/condition/VedlikeholdshistorikkPage'
import MaintenancePlanPage from './pages/maintenance/MaintenancePlanPage'
import SubscriptionPage from './pages/subscription/SubscriptionPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import SettingsPage from './pages/admin/SettingsPage'
import KontrollRunPage from './pages/kontroll/KontrollRunPage'
import BygningsdelListPage from './pages/bygningsdeler/BygningsdelListPage'
import BygningsdelDetailPage from './pages/bygningsdeler/BygningsdelDetailPage'
import DownloadReportPage from './pages/public/DownloadReportPage'
import WaitlistPage from './pages/public/WaitlistPage'
import { MaintenanceProvider } from './context/MaintenanceContext'
import { ConditionProvider } from './context/ConditionContext'
import { DeviationProvider } from './context/DeviationContext'
import PasswordGate from './components/auth/PasswordGate'

function App() {
  return (
    <PasswordGate>
    <BrowserRouter>
    <MaintenanceProvider>
    <ConditionProvider>
    <DeviationProvider>
      <Routes>
        {/* Public rapport-nedlastningsside — uten sidebar */}
        <Route path="/rapport/:token" element={<DownloadReportPage />} />
        <Route path="/rapport" element={<DownloadReportPage />} />
        <Route path="/ventelisten" element={<WaitlistPage />} />

        <Route element={<AppShell />}>
          {/* Oversikt */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Eiendom */}
          <Route path="/eiendom/bygg" element={<DashboardPage />} />
          <Route path="/eiendom/bygningsdeler" element={<BygningsdelListPage />} />
          <Route path="/eiendom/bygningsdeler/:code" element={<BygningsdelDetailPage />} />
          <Route path="/dokumenter" element={<DocumentArchivePage />} />

          {/* Oppgaver — samlet (inkl. kontrollrunder) */}
          <Route path="/oppgaver" element={<TaskListPage />} />
          <Route path="/oppgaver/arshjul" element={<TaskListPage />} />
          <Route path="/oppgaver/:oppgaveId" element={<KontrollRunPage />} />

          {/* Legacy kontroll-rute → redirect til oppgaver */}
          <Route path="/kontroll" element={<Navigate to="/oppgaver" replace />} />
          <Route path="/kontroll/:oppgaveId" element={<KontrollRunPage />} />

          {/* Avvik */}
          <Route path="/avvik" element={<DeviationListPage />} />
          <Route path="/avvik/historikk" element={<DeviationListPage />} />

          {/* Tilstand */}
          <Route path="/tilstand" element={<ConditionListPage />} />
          <Route path="/tilstand/historikk" element={<VedlikeholdshistorikkPage />} />
          <Route path="/vedlikehold" element={<MaintenancePlanPage />} />

          {/* Admin / Innstillinger */}
          <Route path="/abonnement" element={<SubscriptionPage />} />
          <Route path="/admin/brukere" element={<UserManagementPage />} />
          <Route path="/admin/innstillinger" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DeviationProvider>
    </ConditionProvider>
    </MaintenanceProvider>
    </BrowserRouter>
    </PasswordGate>
  )
}

export default App
