import useNavigateTo from "../../hooks/useNavigateTo";

function AlertsPanel({ dashData }) {
  const { goTo } = useNavigateTo();

  // Build cluster distribution as alerts since backend has no alerts endpoint on admin dashboard
  const clusterEntries = dashData?.cluster_distribution
    ? Object.entries(dashData.cluster_distribution)
    : [];

  const clusterColors = {
    "Balanced":          { type: "info",    icon: "⚖️" },
    "Impulsive":         { type: "warning", icon: "⚡" },
    "Conservative Saver":{ type: "success", icon: "✅" },
    "High-Risk Spender": { type: "danger",  icon: "🚨" },
  };

  return (
    <section className="db-alerts-panel" aria-label="Cluster distribution">
      <div className="db-alerts-header">
        <div>
          <h3 className="db-alerts-title">User Cluster Distribution</h3>
          <p className="db-alerts-sub">AI-generated spending behavior groups</p>
        </div>
        <span className="db-alerts-count" aria-label={`${clusterEntries.length} clusters`}>
          {clusterEntries.length} clusters
        </span>
      </div>

      <ul className="db-alerts-list" aria-label="Cluster list">
        {clusterEntries.length === 0 ? (
          <li className="db-alert-item">
            <p style={{ color: '#94a3b8', padding: '1rem' }}>No cluster data available.</p>
          </li>
        ) : (
          clusterEntries.map(([cluster, count]) => {
            const cfg = clusterColors[cluster] ?? { type: "info", icon: "👤" };
            return (
              <li
                key={cluster}
                className={`db-alert-item db-alert-item--${cfg.type}`}
                aria-label={`${cluster}: ${count} users`}
              >
                <span className="db-alert-icon" aria-hidden="true">{cfg.icon}</span>
                <div className="db-alert-body">
                  <p className="db-alert-name">{cluster}</p>
                  <p className="db-alert-msg">{count} users in this group</p>
                </div>
                <div className="db-alert-right">
                  <span className={`db-alert-badge db-alert-badge--${cfg.type}`}>
                    {count}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="db-chart-footer">
        <button
          type="button"
          className="db-viewmore-btn"
          onClick={() => goTo("/users")}
          aria-label="View all users"
        >
          View All Users
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

export default AlertsPanel;