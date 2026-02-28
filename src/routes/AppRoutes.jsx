import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard  from "../pages/Dashboard";
import Users      from "../pages/Users";
import MLInsights from "../pages/MLInsights";
import Reports    from "../pages/Reports";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<Navigate to="/login" replace />} />
      <Route path="/login"       element={<AdminLogin />} />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/users"       element={<Users />} />
      <Route path="/ml-insights" element={<MLInsights />} />
      <Route path="/reports"     element={<Reports />} />
      {/* FIX: catch-all 404 fallback redirects to login */}
      <Route path="*"            element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;