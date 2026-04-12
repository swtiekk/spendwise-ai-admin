import AdminLayout from "../components/layout/AdminLayout";
import { useUsers } from "../hooks/useUsers";
import "../styles/users.css";

const riskConfig = {
  low:    { label: "Low",    color: "#0d9488", bg: "rgba(45,212,191,0.12)"  },
  medium: { label: "Medium", color: "#b45309", bg: "rgba(245,158,11,0.12)" },
  high:   { label: "High",   color: "#b91c1c", bg: "rgba(239,68,68,0.12)"  },
};

function getRiskConfig(riskLevel) {
  return riskConfig[riskLevel?.toLowerCase()] ?? riskConfig.low;
}

function Users() {
  const {
    search,
    filter,
    selected,
    setSelected,
    statusMessage,
    filtered,
    counts,
    setSearch,
    setFilter,
    exportCSV,
    refreshDataset,
    loading,
  } = useUsers();

  return (
    <AdminLayout>
      <section className="u-header">
        <div>
          <p className="u-header-sub">Manage & monitor</p>
          <h2 className="u-header-title">Users</h2>
        </div>

        <div className="u-header-stats">
          <div className="u-stat-pill u-stat-pill--teal">
            <span>{counts.all}</span> Total
          </div>
          <div className="u-stat-pill u-stat-pill--teal">
            <span>{counts.low}</span> Low Risk
          </div>
          <div className="u-stat-pill u-stat-pill--amber">
            <span>{counts.medium}</span> Medium
          </div>
          <div className="u-stat-pill u-stat-pill--red">
            <span>{counts.high}</span> High Risk
          </div>

          <button type="button" className="u-view-btn" onClick={exportCSV}>
            Export CSV
          </button>
          <button type="button" className="u-view-btn" onClick={refreshDataset}>
            Refresh
          </button>
        </div>
      </section>

      {statusMessage && (
        <p role="alert" className="u-status-message">{statusMessage}</p>
      )}

      <div className="u-controls">
        <div className="u-search-wrap">
          <label htmlFor="user-search" className="u-visually-hidden">Search users</label>
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="user-search"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="u-search-clear"
              onClick={() => setSearch("")} aria-label="Clear search">
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>

        <div className="u-filter-tabs">
          {["all", "low", "medium", "high"].map((f) => (
            <button
              type="button"
              key={f}
              className={`u-filter-tab ${filter === f ? "u-filter-tab--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="u-filter-count">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="u-table-wrap">
        {loading ? (
          <p style={{ padding: '2rem', color: '#94a3b8', textAlign: 'center' }}>Loading users...</p>
        ) : (
          <table className="u-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Income Type</th>
                <th>Income Cycle</th>
                <th>Cluster</th>
                <th>Risk Level</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="u-empty">No users found.</td>
                </tr>
              ) : (
                filtered.map((u, i) => {
                  const cfg = getRiskConfig(u.risk_level);
                  return (
                    <tr key={u.id} style={{ animationDelay: `${i * 0.05}s` }} className="u-table-row">
                      <td className="u-num">{u.id}</td>
                      <td>
                        <div className="u-user-cell">
                          <div className="u-avatar">👤</div>
                          <p className="u-name">{u.name || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="u-email">{u.email || '—'}</td>
                      <td><span className="u-income-type">{u.income_type || '—'}</span></td>
                      <td>{u.income_cycle || '—'}</td>
                      <td>{u.cluster || '—'}</td>
                      <td>
                        <span className="u-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="u-date">
                        {u.date_joined ? new Date(u.date_joined).toLocaleDateString('en-PH') : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="u-table-footer">
        Showing {filtered.length} of {counts.all} users
      </p>
    </AdminLayout>
  );
}

export default Users;