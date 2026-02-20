import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import MLInsights from "../pages/MLInsights";
import Users from "../pages/Users";
import Reports from "../pages/Reports";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ml-insights" element={<MLInsights />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;