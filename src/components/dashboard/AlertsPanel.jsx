import { useNavigate } from "react-router-dom";
import { mockAlerts } from "../../data/mockData";

function AlertsPanel() {
  const navigate = useNavigate();

  return (
    <section className="db-alerts-panel" aria-label="Recent AI alerts">
      <div className="db-alerts-header">
        <div>
          <h3 className="db-alerts-title">Recent AI Alerts</h3>
          <p className="db-alerts-sub">AI-generated spending warnings</p>
        </div>
        <span className="db-alerts-count" aria-label={`${mockAlerts.length} active alerts`}>
          {mockAlerts.length} active
        </span>
      </div>

      {/* FIX: key={alert.id} uses unique ID — not array index */}
      <ul className="db-alerts-list" aria-label="Alert list">
        {mockAlerts.slice(0, 4).map((alert) => (
          <li
            key={alert.id}
            className={`db-alert-item db-alert-item--${alert.type}`}
            aria-label={`${alert.type} alert for ${alert.user}`}
          >
            <span className="db-alert-icon" aria-hidden="true">{alert.icon}</span>
            <div className="db-alert-body">
              <p className="db-alert-name">{alert.user}</p>
              <p className="db-alert-msg">{alert.message}</p>
            </div>
            <div className="db-alert-right">
              <span className={`db-alert-badge db-alert-badge--${alert.type}`}>
                {alert.type}
              </span>
              <span className="db-alert-time">
                <time>{alert.time}</time>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="db-chart-footer">
        {/* FIX: type="button" added */}
        <button
          type="button"
          className="db-viewmore-btn"
          onClick={() => navigate("/users")}
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