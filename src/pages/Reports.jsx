import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import "../styles/reports.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BASE_URL, getToken } from "../config";

function Reports() {
  const [dateFrom,      setDateFrom]      = useState("");
  const [dateTo,        setDateTo]        = useState("");
  const [exported,      setExported]      = useState(false);
  const [exportMsg,     setExportMsg]     = useState("");
  const [allData,       setAllData]       = useState([]);
  const [filteredData,  setFilteredData]  = useState([]);
  const [hasGenerated,  setHasGenerated]  = useState(false);
  const [loading,       setLoading]       = useState(true);

  // Fetch real reports from backend on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/admin/reports/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setAllData(data);
        setFilteredData(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const generateReport = () => {
    if (!dateFrom && !dateTo) {
      setFilteredData(allData);
      setHasGenerated(true);
      return;
    }
    const result = allData.filter((row) => {
      const d   = new Date(row.month);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return (!dateFrom || key >= dateFrom) && (!dateTo || key <= dateTo);
    });
    setFilteredData(result.length > 0 ? result : allData);
    setHasGenerated(true);
  };

  const totalSpendNum = filteredData.reduce((sum, r) => {
    const num = parseFloat(String(r.totalSpend).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const totalUsers      = filteredData.reduce((sum, r) => sum + (r.users  || 0), 0);
  const totalAlerts     = filteredData.reduce((sum, r) => sum + (r.alerts || 0), 0);
  const totalSavingsNum = filteredData.reduce((sum, r) => {
    const num = parseFloat(String(r.savings).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const handleExportCSV = () => {
    const headers = ["Month","Active Users","Total Spend","Avg / User","AI Alerts","Total Savings","Top Category"];
    const rows    = filteredData.map((r) => [r.month, r.users, r.totalSpend, r.avgSpend, r.alerts, r.savings, r.topCategory]);
    const csv     = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url     = URL.createObjectURL(blob);
    const link    = document.createElement("a");
    link.href = url;
    link.download = `SpendWise_Report_${dateFrom || 'all'}_to_${dateTo || 'all'}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportMsg("✓ CSV downloaded!"); setExported(true); setTimeout(() => setExported(false), 2500);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18); doc.setTextColor(26, 43, 71);
    doc.text("SpendWise AI - Monthly Report", 40, 40);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139);
    doc.text("Analytics & Export", 40, 58);
    doc.text(`Period: ${dateFrom || 'All'} → ${dateTo || 'All'}`, 40, 72);
    const kpis = [
      { label: "TOTAL SPENDING", value: "₱" + totalSpendNum.toLocaleString() },
      { label: "TOTAL USERS",    value: totalUsers.toLocaleString() },
      { label: "TOTAL ALERTS",   value: totalAlerts.toLocaleString() },
      { label: "TOTAL SAVINGS",  value: "₱" + totalSavingsNum.toLocaleString() },
    ];
    const boxW = 170, boxH = 48, startX = 40, startY = 88, gap = 12;
    kpis.forEach((k, i) => {
      const x = startX + i * (boxW + gap);
      doc.setDrawColor(226, 232, 240); doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, startY, boxW, boxH, 4, 4, "FD");
      doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text(k.label, x + 12, startY + 16);
      doc.setFontSize(16); doc.setTextColor(26, 43, 71); doc.text(k.value, x + 12, startY + 36);
    });
    doc.setFontSize(12); doc.setTextColor(26, 43, 71); doc.text("Monthly Summary Breakdown", 40, 158);
    autoTable(doc, {
      startY: 166,
      head: [["Month", "Active Users", "Total Spend", "Avg / User", "AI Alerts", "Total Savings", "Top Category"]],
      body: filteredData.map((r) => [r.month, r.users, r.totalSpend, r.avgSpend, r.alerts, r.savings, r.topCategory]),
      headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontSize: 9, fontStyle: "bold" },
      bodyStyles: { fontSize: 10, textColor: [26, 43, 71] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 8 }, margin: { left: 40, right: 40 },
    });
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(9); doc.setTextColor(148, 163, 184);
    doc.text(`Generated by SpendWise AI Admin Panel  •  ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}`, 40, pageH - 20);
    doc.save(`SpendWise_Report.pdf`);
    setExportMsg("✓ PDF downloaded!"); setExported(true); setTimeout(() => setExported(false), 2500);
  };

  // Build chart data from real data
  const chartData  = filteredData.map(r => ({
    month:  r.month,
    amount: parseFloat(String(r.totalSpend).replace(/[^0-9.]/g, "")) || 0,
  }));
  const maxSpend = Math.max(...chartData.map(d => d.amount), 1);

  const categories = [
    { label: "Food & Dining",     pct: 35, color: "#2DD4BF" },
    { label: "Transportation",    pct: 20, color: "#6366F1" },
    { label: "Entertainment",     pct: 18, color: "#F59E0B" },
    { label: "Shopping",          pct: 15, color: "#1A2B47" },
    { label: "Bills & Utilities", pct: 12, color: "#94a3b8" },
  ];

  return (
    <AdminLayout>
      <main className="rp-main">

        {/* ── Page Header ── */}
        <header className="rp-header">
          <div>
            <p className="rp-header-sub">Analytics & Export</p>
            <h1 className="rp-header-title">Reports</h1>
          </div>
          <div className="rp-export-group">
            {exported && <span className="rp-export-toast" role="status">{exportMsg}</span>}
            <button type="button" className="rp-export-btn rp-export-btn--csv" onClick={handleExportCSV}>
              <DownloadIcon /> Export CSV
            </button>
            <button type="button" className="rp-export-btn rp-export-btn--pdf" onClick={handleExportPDF}>
              <FileIcon /> Export PDF
            </button>
          </div>
        </header>

        {/* ── Filter Bar ── */}
        <section aria-label="Date Range Filter">
          <div className="rp-filter-bar">
            <p className="rp-filter-label">Select Date Range</p>
            <div className="rp-filter-group">
              <label htmlFor="dateFrom">From</label>
              <input id="dateFrom" type="month" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <span className="rp-filter-divider" aria-hidden="true">→</span>
            <div className="rp-filter-group">
              <label htmlFor="dateTo">To</label>
              <input id="dateTo" type="month" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <button type="button" className="rp-filter-apply" onClick={generateReport}>
              Generate Report
            </button>
            {hasGenerated && (
              <p className="rp-filter-hint">
                ✓ Showing {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </section>

        {/* ── KPI Cards ── */}
        <section aria-label="Summary Statistics">
          <div className="rp-kpi-row">
            {[
              { label: "Total Spending", value: "₱" + totalSpendNum.toLocaleString(), icon: "₱",  color: "#2DD4BF", bg: "#f0fdfb" },
              { label: "Total Users",    value: totalUsers.toLocaleString(),           icon: "👥", color: "#6366F1", bg: "#f5f3ff" },
              { label: "Total Alerts",   value: totalAlerts.toLocaleString(),          icon: "🔔", color: "#F59E0B", bg: "#fffbeb" },
              { label: "Total Savings",  value: "₱" + totalSavingsNum.toLocaleString(),icon: "💰", color: "#2DD4BF", bg: "#ecfdf5" },
            ].map((k) => (
              <div key={k.label} className="rp-kpi-card" style={{ background: k.bg, borderColor: k.color + "33" }}>
                <div className="rp-kpi-icon" style={{ color: k.color }} aria-hidden="true">{k.icon}</div>
                <p className="rp-kpi-value" style={{ color: k.color }}>{k.value}</p>
                <p className="rp-kpi-label">{k.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Charts Row ── */}
        <section aria-label="Spending Charts">
          <div className="rp-content-grid">
            <div className="rp-chart-box">
              <div className="rp-chart-header">
                <h2 className="rp-chart-title">Monthly Spending Trend</h2>
                <p className="rp-chart-sub">Total platform spend per month</p>
              </div>
              {loading ? (
                <p style={{ color: '#94a3b8', padding: '2rem' }}>Loading...</p>
              ) : chartData.length === 0 ? (
                <p style={{ color: '#94a3b8', padding: '2rem' }}>No data available.</p>
              ) : (
                <div className="rp-trend-chart" role="img" aria-label="Bar chart showing monthly spending trend">
                  {chartData.map((d, i) => (
                    <div key={d.month} className="rp-trend-col" style={{ animationDelay: `${i * 0.08}s` }}>
                      <span className="rp-trend-val">₱{(d.amount / 1000).toFixed(0)}k</span>
                      <div className="rp-trend-track">
                        <div className="rp-trend-fill" style={{ height: `${(d.amount / maxSpend) * 100}%` }} />
                      </div>
                      <span className="rp-trend-label">{d.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rp-chart-box">
              <div className="rp-chart-header">
                <h2 className="rp-chart-title">Top Spending Categories</h2>
                <p className="rp-chart-sub">Platform-wide distribution</p>
              </div>
              <ul className="rp-cat-list">
                {categories.map((c) => (
                  <li key={c.label} className="rp-cat-item">
                    <div className="rp-cat-label-row">
                      <span className="rp-cat-dot" style={{ background: c.color }} aria-hidden="true" />
                      <span className="rp-cat-name">{c.label}</span>
                      <span className="rp-cat-pct">{c.pct}%</span>
                    </div>
                    <div className="rp-cat-bar" role="progressbar"
                      aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100}
                      aria-label={`${c.label}: ${c.pct}%`}>
                      <div className="rp-cat-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Monthly Summary Table ── */}
        <section aria-label="Monthly Summary Table">
          <div className="rp-table-wrap">
            <div className="rp-table-header">
              <div>
                <h2 className="rp-chart-title">Monthly Summary</h2>
                <p className="rp-chart-sub">
                  {loading ? "Loading..." : `${filteredData.length} record${filteredData.length !== 1 ? "s" : ""} shown`}
                </p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="rp-table" aria-label="Monthly spending summary">
                <thead>
                  <tr>
                    {["Month", "Active Users", "Total Spend", "Avg / User", "AI Alerts", "Total Savings", "Top Category"].map((h) => (
                      <th key={h} scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading data...</td></tr>
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No data available. Add some expenses first.</td></tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.month} className="rp-table-row">
                        <td className="rp-month-cell">{row.month}</td>
                        <td className="rp-num">{row.users}</td>
                        <td className="rp-savings">{row.totalSpend}</td>
                        <td>{row.avgSpend}</td>
                        <td>
                          <span className={`rp-alert-badge ${row.alerts > 10 ? "rp-alert-badge--high" : row.alerts > 5 ? "rp-alert-badge--mid" : "rp-alert-badge--low"}`}>
                            {row.alerts}
                          </span>
                        </td>
                        <td className="rp-savings">{row.savings}</td>
                        <td><span className="rp-category-pill">{row.topCategory}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </AdminLayout>
  );
}

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default Reports;