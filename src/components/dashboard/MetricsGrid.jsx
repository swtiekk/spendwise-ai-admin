import { useNavigate } from "react-router-dom";
import { mockMetrics } from "../../data/mockData";

const icons = {
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  activity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  spend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  brain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.14Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.14Z"/>
    </svg>
  ),
};

// Where each metric card navigates
const metricLinks = {
  users:    "/users",
  activity: "/users",
  spend:    "/reports",
  brain:    "/ml-insights",
};

function MetricsGrid() {
  const navigate = useNavigate();

  return (
    <section className="db-metrics-grid">
      {mockMetrics.map((metric, i) => (
        <div
          key={metric.id}
          className="db-metric-card"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="db-metric-top">
            <span className="db-metric-icon" style={{ color: metric.color }}>
              {icons[metric.icon]}
            </span>
            <span className={`db-metric-badge db-metric-badge--${metric.trend}`}>
              {metric.trend === "up" ? "▲" : "▼"} {metric.change}
            </span>
          </div>
          <p className="db-metric-value">{metric.value}</p>
          <p className="db-metric-label">{metric.label}</p>
          <div className="db-metric-bar">
            <div
              className="db-metric-bar-fill"
              style={{ width: metric.fill, background: metric.color }}
            />
          </div>
          <button
            className="db-viewmore-btn"
            onClick={() => navigate(metricLinks[metric.icon])}
          >
            View More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      ))}
    </section>
  );
}

export default MetricsGrid;