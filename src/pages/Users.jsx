import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { mockUsers } from "../data/mockData";
import "../styles/users.css";

const statusConfig = {
  active:  { label: "Active",  color: "#0d9488", bg: "rgba(45,212,191,0.12)"  },
  warning: { label: "Warning", color: "#b45309", bg: "rgba(245,158,11,0.12)" },
  flagged: { label: "Flagged", color: "#b91c1c", bg: "rgba(239,68,68,0.12)"  },
};

const scoreColor = (s) => s >= 80 ? "#2DD4BF" : s >= 50 ? "#F59E0B" : "#ef4444";

function UserDetailModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="u-modal-overlay" onClick={onClose}>
      <div className="u-modal" onClick={(e) => e.stopPropagation()}>
        <button className="u-modal-close" onClick={onClose}>✕</button>

        <div className="u-modal-header">
          <div className="u-modal-avatar">{user.avatar}</div>
          <div>
            <h2 className="u-modal-name">{user.name}</h2>
            <p className="u-modal-email">{user.email}</p>
            <span className="u-status-badge" style={{ color: statusConfig[user.status].color, background: statusConfig[user.status].bg }}>
              {statusConfig[user.status].label}
            </span>
          </div>
        </div>

        <div className="u-modal-score-row">
          <div className="u-modal-score-wrap">
            <p className="u-modal-score-label">AI Spending Score</p>
            <p className="u-modal-score-value" style={{ color: scoreColor(user.spendingScore) }}>
              {user.spendingScore}<span>/100</span>
            </p>
            <div className="u-modal-score-bar">
              <div style={{ width: `${user.spendingScore}%`, background: scoreColor(user.spendingScore) }} />
            </div>
          </div>
          <div className="u-modal-alerts-wrap">
            <p className="u-modal-score-label">Active Alerts</p>
            <p className="u-modal-alert-count" style={{ color: user.alerts > 2 ? "#ef4444" : user.alerts > 0 ? "#F59E0B" : "#2DD4BF" }}>
              {user.alerts}
            </p>
          </div>
        </div>

        <div className="u-modal-stats">
          {[
            { label: "Monthly Income", value: user.income },
            { label: "Total Spent",    value: user.spent   },
            { label: "Savings",        value: user.savings },
            { label: "Income Type",    value: user.incomeType },
            { label: "Age",            value: `${user.age} yrs` },
            { label: "Member Since",   value: user.joined  },
          ].map((s) => (
            <div key={s.label} className="u-modal-stat">
              <p className="u-modal-stat-label">{s.label}</p>
              <p className="u-modal-stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="u-modal-bio">
          <p className="u-modal-bio-label">AI Assessment</p>
          <p className="u-modal-bio-text">🧠 {user.bio}</p>
        </div>
      </div>
    </div>
  );
}

function Users() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [selected, setSelected]   = useState(null);

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:     mockUsers.length,
    active:  mockUsers.filter((u) => u.status === "active").length,
    warning: mockUsers.filter((u) => u.status === "warning").length,
    flagged: mockUsers.filter((u) => u.status === "flagged").length,
  };

  return (
    <AdminLayout>
      <section className="u-header">
        <div>
          <p className="u-header-sub">Manage & monitor</p>
          <h2 className="u-header-title">Users</h2>
        </div>
        <div className="u-header-stats">
          <div className="u-stat-pill u-stat-pill--teal">
            <span>{counts.active}</span> Active
          </div>
          <div className="u-stat-pill u-stat-pill--amber">
            <span>{counts.warning}</span> Warning
          </div>
          <div className="u-stat-pill u-stat-pill--red">
            <span>{counts.flagged}</span> Flagged
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="u-controls">
        <div className="u-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="u-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <div className="u-filter-tabs">
          {["all", "active", "warning", "flagged"].map((f) => (
            <button
              key={f}
              className={`u-filter-tab ${filter === f ? "u-filter-tab--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="u-filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="u-table-wrap">
        <table className="u-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Income Type</th>
              <th>Monthly Income</th>
              <th>Total Spent</th>
              <th>AI Score</th>
              <th>Alerts</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="9" className="u-empty">No users found.</td></tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id} style={{ animationDelay: `${i * 0.05}s` }} className="u-table-row">
                  <td>
                    <div className="u-user-cell">
                      <div className="u-avatar">{u.avatar}</div>
                      <div>
                        <p className="u-name">{u.name}</p>
                        <p className="u-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="u-status-badge" style={{ color: statusConfig[u.status].color, background: statusConfig[u.status].bg }}>
                      {statusConfig[u.status].label}
                    </span>
                  </td>
                  <td><span className="u-income-type">{u.incomeType}</span></td>
                  <td className="u-num">{u.income}</td>
                  <td className="u-num">{u.spent}</td>
                  <td>
                    <div className="u-score-cell">
                      <span className="u-score-num" style={{ color: scoreColor(u.spendingScore) }}>{u.spendingScore}</span>
                      <div className="u-score-bar">
                        <div style={{ width: `${u.spendingScore}%`, background: scoreColor(u.spendingScore) }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`u-alert-count ${u.alerts > 2 ? "u-alert-count--high" : u.alerts > 0 ? "u-alert-count--mid" : "u-alert-count--none"}`}>
                      {u.alerts}
                    </span>
                  </td>
                  <td className="u-date">{u.joined}</td>
                  <td>
                    <button className="u-view-btn" onClick={() => setSelected(u)}>
                      View →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="u-table-footer">Showing {filtered.length} of {mockUsers.length} users</p>

      <UserDetailModal user={selected} onClose={() => setSelected(null)} />
    </AdminLayout>
  );
}

export default Users;