import AdminLayout from "../components/layout/AdminLayout";
import "../styles/reports.css";
import useReports from "../hooks/useReports";

function Reports() {

  const {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    exported,
    exportMsg,
    filteredData,
    filteredChart,
    hasGenerated,
    generateReport,
    handleExportCSV,
    handleExportPDF,
    totalSpendNum,
    totalUsers,
    totalAlerts,
    totalSavingsNum
  } = useReports();

  const maxSpend = Math.max(...filteredChart.map((d) => d.amount));

  const categories = [
    {label:"Food & Dining", pct:35, color:"#2DD4BF"},
    {label:"Transportation", pct:20, color:"#6366F1"},
    {label:"Entertainment", pct:18, color:"#F59E0B"},
    {label:"Shopping", pct:15, color:"#1A2B47"},
    {label:"Bills & Utilities", pct:12, color:"#94a3b8"},
  ];

  return (
    <AdminLayout>

      <main className="rp-main">

        <header className="rp-header">
          <div>
            <p className="rp-header-sub">Analytics & Export</p>
            <h1 className="rp-header-title">Reports</h1>
          </div>

          <div className="rp-export-group">
            {exported && (
              <span className="rp-export-toast" role="status">{exportMsg}</span>
            )}

            <button type="button"
              className="rp-export-btn rp-export-btn--csv"
              onClick={handleExportCSV}>
              <DownloadIcon /> Export CSV
            </button>

            <button type="button"
              className="rp-export-btn rp-export-btn--pdf"
              onClick={handleExportPDF}>
              <FileIcon /> Export PDF
            </button>
          </div>
        </header>


        <section aria-label="Date Range Filter">
          <div className="rp-filter-bar">

            <p className="rp-filter-label">Select Date Range</p>

            <div className="rp-filter-group">
              <label htmlFor="dateFrom">From</label>
              <input
                id="dateFrom"
                type="month"
                value={dateFrom}
                onChange={(e)=>setDateFrom(e.target.value)}
              />
            </div>

            <span className="rp-filter-divider">→</span>

            <div className="rp-filter-group">
              <label htmlFor="dateTo">To</label>
              <input
                id="dateTo"
                type="month"
                value={dateTo}
                onChange={(e)=>setDateTo(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="rp-filter-apply"
              onClick={generateReport}
            >
              Generate Report
            </button>

            {hasGenerated && (
              <p className="rp-filter-hint">
                ✓ Showing data from <strong>{dateFrom}</strong> to <strong>{dateTo}</strong>
              </p>
            )}

          </div>
        </section>


        <section aria-label="Summary Statistics">
          <div className="rp-kpi-row">

            {[
              {label:"Total Spending", value:"₱"+totalSpendNum.toLocaleString(), icon:"₱", color:"#2DD4BF", bg:"#f0fdfb"},
              {label:"Total Users", value:totalUsers.toLocaleString(), icon:"👥", color:"#6366F1", bg:"#f5f3ff"},
              {label:"Total Alerts", value:totalAlerts.toLocaleString(), icon:"🔔", color:"#F59E0B", bg:"#fffbeb"},
              {label:"Total Savings", value:"₱"+totalSavingsNum.toLocaleString(), icon:"💰", color:"#2DD4BF", bg:"#ecfdf5"},
            ].map((k)=>(
              <div
                key={k.label}
                className="rp-kpi-card"
                style={{background:k.bg, borderColor:k.color+"33"}}
              >
                <div className="rp-kpi-icon" style={{color:k.color}}>
                  {k.icon}
                </div>

                <p className="rp-kpi-value" style={{color:k.color}}>
                  {k.value}
                </p>

                <p className="rp-kpi-label">{k.label}</p>

              </div>
            ))}

          </div>
        </section>


        <section aria-label="Spending Charts">

          <div className="rp-content-grid">

            <div className="rp-chart-box">

              <div className="rp-chart-header">
                <h2 className="rp-chart-title">Monthly Spending Trend</h2>
                <p className="rp-chart-sub">Total platform spend per month</p>
              </div>

              <div className="rp-trend-chart">

                {filteredChart.map((d,i)=>(
                  <div
                    key={d.month}
                    className="rp-trend-col"
                    style={{animationDelay:`${i*0.08}s`}}
                  >

                    <span className="rp-trend-val">
                      ₱{(d.amount/1000).toFixed(0)}k
                    </span>

                    <div className="rp-trend-track">
                      <div
                        className="rp-trend-fill"
                        style={{height:`${(d.amount/maxSpend)*100}%`}}
                      />
                    </div>

                    <span className="rp-trend-label">{d.month}</span>

                  </div>
                ))}

              </div>

            </div>


            <div className="rp-chart-box">

              <div className="rp-chart-header">
                <h2 className="rp-chart-title">Top Spending Categories</h2>
                <p className="rp-chart-sub">Platform-wide distribution</p>
              </div>

              <ul className="rp-cat-list">

                {categories.map((c)=>(
                  <li key={c.label} className="rp-cat-item">

                    <div className="rp-cat-label-row">

                      <span
                        className="rp-cat-dot"
                        style={{background:c.color}}
                      />

                      <span className="rp-cat-name">{c.label}</span>

                      <span className="rp-cat-pct">{c.pct}%</span>

                    </div>

                    <div className="rp-cat-bar">

                      <div
                        className="rp-cat-bar-fill"
                        style={{
                          width:`${c.pct}%`,
                          background:c.color
                        }}
                      />

                    </div>

                  </li>
                ))}

              </ul>

            </div>

          </div>

        </section>


        <section aria-label="Monthly Summary Table">

          <div className="rp-table-wrap">

            <div className="rp-table-header">

              <div>
                <h2 className="rp-chart-title">Monthly Summary</h2>
                <p className="rp-chart-sub">
                  Detailed breakdown per month — {filteredData.length} records shown
                </p>
              </div>

            </div>


            <div style={{overflowX:"auto"}}>

              <table className="rp-table">

                <thead>
                  <tr>
                    {[
                      "Month",
                      "Active Users",
                      "Total Spend",
                      "Avg / User",
                      "AI Alerts",
                      "Total Savings",
                      "Top Category"
                    ].map((h)=>(
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  {filteredData.map((row)=>(
                    <tr key={row.month} className="rp-table-row">

                      <td className="rp-month-cell">{row.month}</td>

                      <td className="rp-num">
                        {row.users.toLocaleString()}
                      </td>

                      <td className="rp-savings">
                        {row.totalSpend}
                      </td>

                      <td>{row.avgSpend}</td>

                      <td>
                        <span className="rp-alert-badge">
                          {row.alerts}
                        </span>
                      </td>

                      <td className="rp-savings">
                        {row.savings}
                      </td>

                      <td>
                        <span className="rp-category-pill">
                          {row.topCategory}
                        </span>
                      </td>

                    </tr>
                  ))}

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
  <svg width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default Reports;