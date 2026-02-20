import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import SpendingChart from "../components/dashboard/SpendingChart";
import DonutChart from "../components/dashboard/DonutChart";
import "../styles/dashboard.css";

function Dashboard() {
  const [showCharts, setShowCharts] = useState(true);

  return (
    <AdminLayout>
      {/* Header */}
      <section className="db-header">
        <div className="db-header-left">
          <p className="db-header-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h2 className="db-header-title">Admin Dashboard</h2>
        </div>
        <button
          className={`db-toggle-btn ${!showCharts ? "db-toggle-btn--off" : ""}`}
          onClick={() => setShowCharts(!showCharts)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {showCharts
              ? <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>
              : <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>
            }
          </svg>
          {showCharts ? "Hide Charts" : "Show Charts"}
        </button>
      </section>

      {/* Metrics */}
      <MetricsGrid />

      {/* Charts */}
      {showCharts && (
        <section className="db-charts-grid">
          <SpendingChart />
          <DonutChart />
        </section>
      )}

      {/* Alerts */}
      <AlertsPanel />
    </AdminLayout>
  );
}

export default Dashboard;