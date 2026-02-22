import { useNavigate } from "react-router-dom";
import { mockAlerts } from "../../data/mockData";

function AlertsPanel() {
  const navigate = useNavigate();

  return (
    <section className="db-alerts-panel">
      <div className="db-alerts-header">
        <div>
          <h3 className="db-alerts-title">Recent AI Alerts</h3>
          <p className="db-alerts-sub">AI-generated spending warnings</p>
        </div>
        <span className="db-alerts-count">{mockAlerts.length} active</span>
      </div>

      <ul className="db-alerts-list">
        {mockAlerts.slice(0, 4).map((alert, i) => (
          <li
            key={alert.id}
            className={`db-alert-item db-alert-item--${alert.type}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="db-alert-icon">{alert.icon}</span>
            <div className="db-alert-body">
              <p className="db-alert-name">{alert.user}</p>
              <p className="db-alert-msg">{alert.message}</p>
            </div>
            <div className="db-alert-right">
              <span className={`db-alert-badge db-alert-badge--${alert.type}`}>
                {alert.type}
              </span>
              <span className="db-alert-time">{alert.time}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="db-chart-footer">
        <button className="db-viewmore-btn" onClick={() => navigate("/users")}>
          View All Users
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

export default AlertsPanel;