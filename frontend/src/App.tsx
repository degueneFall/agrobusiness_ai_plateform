import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleManagement from './pages/RoleManagement';
import AppLayout from './components/AppLayout';
import { OverviewDashboardContent } from './pages/dashboards';
import CartographiePage from './pages/dashboards/CartographiePage';
import AnalysePage from './pages/dashboards/AnalysePage';
import CatalogueSemencesPage from './pages/dashboards/CatalogueSemencesPage';
import RapportsPage from './pages/dashboards/RapportsPage';
import GenererRapportPage from './pages/dashboards/GenererRapportPage';
import AdminIAPage from './pages/dashboards/AdminIAPage';
import NotificationsPage from './pages/dashboards/NotificationsPage';
import SeedDetailPage from './pages/dashboards/SeedDetailPage';
import ParametresPage from './pages/dashboards/ParametresPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const DashboardShell: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <AppLayout title={title}>{children}</AppLayout>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardShell title="Tableau de Bord Global">
                  <OverviewDashboardContent />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/cartographie"
            element={
              <PrivateRoute>
                <DashboardShell title="Cartographie">
                  <CartographiePage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/analyse"
            element={
              <PrivateRoute>
                <DashboardShell title="Analyse">
                  <AnalysePage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/semences"
            element={
              <PrivateRoute>
                <DashboardShell title="Semences">
                  <CatalogueSemencesPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/semences/:id"
            element={
              <PrivateRoute>
                <DashboardShell title="Détail semence">
                  <SeedDetailPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <PrivateRoute>
                <DashboardShell title="Notifications">
                  <NotificationsPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/parametres"
            element={
              <PrivateRoute>
                <DashboardShell title="Paramètres">
                  <ParametresPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/rapports"
            element={
              <PrivateRoute>
                <DashboardShell title="Rapports">
                  <RapportsPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/rapports/generer"
            element={
              <PrivateRoute>
                <DashboardShell title="Générer un rapport">
                  <GenererRapportPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <PrivateRoute>
                <AppLayout title="Gestion des rôles">
                  <RoleManagement />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ia"
            element={
              <PrivateRoute>
                <DashboardShell title="Admin IA">
                  <AdminIAPage />
                </DashboardShell>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
