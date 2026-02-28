import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import SpendingChart from "../components/dashboard/SpendingChart";
import DonutChart from "../components/dashboard/DonutChart";
import "../styles/dashboard.css";

function Dashboard() {
  const [showCharts, setShowCharts] = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AdminLayout>

      {/* ── Welcome Banner ── */}
      <div className="db-banner" role="region" aria-label="Dashboard welcome banner">
        <div className="db-banner-left">
          <p className="db-banner-greeting">{greeting}, Admin 👋</p>
          {/* FIX: h1 is the correct top-level heading inside main content */}
          <h1 className="db-banner-title">Admin Dashboard</h1>
          <p className="db-banner-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric",
              month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="db-banner-right">
          <div className="db-banner-ai-badge" aria-label="AI Model status">
            <span className="db-banner-ai-dot" aria-hidden="true" />
            AI Model Active
          </div>
          {/* FIX: type="button" added */}
          <button
            type="button"
            className={`db-toggle-btn ${!showCharts ? "db-toggle-btn--off" : ""}`}
            onClick={() => setShowCharts(!showCharts)}
            aria-pressed={showCharts}
            aria-label={showCharts ? "Hide charts" : "Show charts"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {showCharts ? (
                <>
                  <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/>
                  <path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/>
                </>
              ) : (
                <>
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6"  y1="20" x2="6"  y2="14"/>
                </>
              )}
            </svg>
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>
        </div>
      </div>

      {/* ── Overview Metrics ── */}
      {/* FIX: h2 under h1, correct heading hierarchy */}
      <h2 className="db-section-label">Overview Metrics</h2>
      <MetricsGrid />

      {/* ── Charts ── */}
      {showCharts && (
        <section aria-label="Spending analytics charts">
          <h2 className="db-section-label">Spending Analytics</h2>
          <div className="db-charts-grid">
            <SpendingChart />
            <DonutChart />
          </div>
        </section>
      )}

      {/* ── Alerts ── */}
      <h2 className="db-section-label">Recent AI Alerts</h2>
      <AlertsPanel />

    </AdminLayout>
  );
}

export default Dashboard;