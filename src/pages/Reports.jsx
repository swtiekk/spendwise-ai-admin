import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { mockMonthlySummary, mockSpendingData } from "../data/mockData";
import "../styles/reports.css";

function Reports() {
  const [dateFrom, setDateFrom] = useState("2025-09");
  const [dateTo,   setDateTo]   = useState("2026-02");
  const [exported, setExported] = useState(false);

  // Filter summary by date range
  const monthOrder = mockMonthlySummary.map((r) => r.month);
  const filtered = mockMonthlySummary.filter((r) => {
    const idx = monthOrder.indexOf(r.month);
    const fromIdx = monthOrder.findIndex((m) => m.includes(dateFrom.split("-")[0]) && m.includes(
      new Date(dateFrom + "-01").toLocaleString("en-US", { month: "short" })
    ));
    return true; // show all for demo
  });

  // Summary totals
  const totalSpend   = "₱44,649,200";
  const totalUsers   = 1284;
  const totalAlerts  = 1574;
  const totalSavings = "₱6,880,000";

  const handleExport = (type) => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const maxSpend = Math.max(...mockSpendingData.map((d) => d.amount));

  return (
    <AdminLayout>
      <section className="rp-header">
        <div>
          <p className="rp-header-sub">Analytics & Export</p>
          <h2 className="rp-header-title">Reports</h2>
        </div>
        <div className="rp-export-group">
          {exported && <span className="rp-export-toast">✓ Exported successfully!</span>}
          <button className="rp-export-btn rp-export-btn--csv" onClick={() => handleExport("csv")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
          <button className="rp-export-btn rp-export-btn--pdf" onClick={() => handleExport("pdf")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            Export PDF
          </button>
        </div>
      </section>

      {/* Summary KPI row */}
      <div className="rp-kpi-row">
        {[
          { label: "Total Spending",  value: totalSpend,              color: "#2DD4BF", icon: "₱" },
          { label: "Total Users",     value: totalUsers.toLocaleString(), color: "#6366F1", icon: "👥" },
          { label: "Total Alerts",    value: totalAlerts.toLocaleString(),color: "#F59E0B", icon: "🔔" },
          { label: "Total Savings",   value: totalSavings,            color: "#1A2B47", icon: "💰" },
        ].map((k, i) => (
          <div className="rp-kpi-card" key={k.label} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="rp-kpi-icon" style={{ color: k.color }}>{k.icon}</div>
            <p className="rp-kpi-value" style={{ color: k.color }}>{k.value}</p>
            <p className="rp-kpi-label">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div className="rp-filter-bar">
        <div className="rp-filter-group">
          <label>From</label>
          <input type="month" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="rp-filter-divider">→</div>
        <div className="rp-filter-group">
          <label>To</label>
          <input type="month" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className="rp-filter-apply">Apply Filter</button>
      </div>

      {/* Chart + Table row */}
      <div className="rp-content-grid">

        {/* Trend Chart */}
        <div className="rp-chart-box">
          <div className="rp-chart-header">
            <h3 className="rp-chart-title">Monthly Spending Trend</h3>
            <p className="rp-chart-sub">Total platform spend per month</p>
          </div>
          <div className="rp-trend-chart">
            {mockSpendingData.map((d, i) => (
              <div key={d.month} className="rp-trend-col" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="rp-trend-val">₱{(d.amount / 1000).toFixed(0)}k</span>
                <div className="rp-trend-track">
                  <div
                    className="rp-trend-fill"
                    style={{ height: `${(d.amount / maxSpend) * 100}%` }}
                  />
                </div>
                <span className="rp-trend-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top categories summary */}
        <div className="rp-chart-box">
          <div className="rp-chart-header">
            <h3 className="rp-chart-title">Top Spending Categories</h3>
            <p className="rp-chart-sub">Platform-wide category distribution</p>
          </div>
          <ul className="rp-cat-list">
            {[
              { label: "Food & Dining",     pct: 35, color: "#2DD4BF" },
              { label: "Transportation",    pct: 20, color: "#6366F1" },
              { label: "Entertainment",     pct: 18, color: "#F59E0B" },
              { label: "Shopping",          pct: 15, color: "#1A2B47" },
              { label: "Bills & Utilities", pct: 12, color: "#94a3b8" },
            ].map((c) => (
              <li key={c.label} className="rp-cat-item">
                <div className="rp-cat-label-row">
                  <span className="rp-cat-dot" style={{ background: c.color }} />
                  <span className="rp-cat-name">{c.label}</span>
                  <span className="rp-cat-pct">{c.pct}%</span>
                </div>
                <div className="rp-cat-bar">
                  <div style={{ width: `${c.pct}%`, background: c.color }} className="rp-cat-bar-fill" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="rp-table-wrap">
        <div className="rp-table-header">
          <div>
            <h3 className="rp-chart-title">Monthly Summary</h3>
            <p className="rp-chart-sub">Detailed breakdown per month</p>
          </div>
        </div>
        <table className="rp-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Active Users</th>
              <th>Total Spend</th>
              <th>Avg / User</th>
              <th>AI Alerts</th>
              <th>Total Savings</th>
              <th>Top Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.month} className="rp-table-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <td className="rp-month-cell">{row.month}</td>
                <td>{row.users.toLocaleString()}</td>
                <td className="rp-num">{row.totalSpend}</td>
                <td className="rp-num">{row.avgSpend}</td>
                <td>
                  <span className={`rp-alert-badge ${row.alerts > 290 ? "rp-alert-badge--high" : row.alerts > 220 ? "rp-alert-badge--mid" : "rp-alert-badge--low"}`}>
                    {row.alerts}
                  </span>
                </td>
                <td className="rp-savings">{row.savings}</td>
                <td><span className="rp-category-pill">{row.topCategory}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Reports;