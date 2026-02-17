import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import PlantsPage from "./pages/PlantsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import CostCentersPage from "./pages/CostCentersPage";
import WorkCentersPage from "./pages/WorkCentersPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          isAuthenticated() ? 
          <Navigate to="/" replace /> : 
          <AuthPage />
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout title="Plant Management">
              <PlantsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/departments" 
        element={
          <ProtectedRoute>
            <Layout title="Department Management">
              <DepartmentsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cost-centers" 
        element={
          <ProtectedRoute>
            <Layout title="Cost Center Management">
              <CostCentersPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/work-centers" 
        element={
          <ProtectedRoute>
            <Layout title="Work Center Management">
              <WorkCentersPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
