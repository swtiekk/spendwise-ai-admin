import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import MLInsights from "../pages/MLInsights";
import Reports from "../pages/Reports";
import { getToken } from "../config";

// ── Auth Guard Component ─────────────────────────────────────
function RequireAuth({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

// ── Routes ───────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<AdminLogin />} />

      <Route 
        path="/dashboard" 
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } 
      />

      <Route 
        path="/users" 
        element={
          <RequireAuth>
            <Users />
          </RequireAuth>
        } 
      />

      <Route 
        path="/ml-insights" 
        element={
          <RequireAuth>
            <MLInsights />
          </RequireAuth>
        } 
      />

      <Route 
        path="/reports" 
        element={
          <RequireAuth>
            <Reports />
          </RequireAuth>
        } 
      />

      {/* Catch-all 404 fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;