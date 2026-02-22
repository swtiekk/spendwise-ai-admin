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
      <div className="db-banner">
        <div className="db-banner-left">
          <p className="db-banner-greeting">{greeting}, Admin 👋</p>
          <h2 className="db-banner-title">Admin Dashboard</h2>
          <p className="db-banner-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric",
              month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="db-banner-right">
          <div className="db-banner-ai-badge">
            <span className="db-banner-ai-dot" />
            AI Model Active
          </div>
          <button
            className={`db-toggle-btn ${!showCharts ? "db-toggle-btn--off" : ""}`}
            onClick={() => setShowCharts(!showCharts)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
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

      {/* ── Section Label ── */}
      <p className="db-section-label">Overview Metrics</p>
      <MetricsGrid />

      {/* ── Charts ── */}
      {showCharts && (
        <>
          <p className="db-section-label">Spending Analytics</p>
          <section className="db-charts-grid">
            <SpendingChart />
            <DonutChart />
          </section>
        </>
      )}

      {/* ── Alerts ── */}
      <p className="db-section-label">Recent AI Alerts</p>
      <AlertsPanel />

    </AdminLayout>
  );
}

export default Dashboard;