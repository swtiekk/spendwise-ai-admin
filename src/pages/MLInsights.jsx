import AdminLayout from "../components/layout/AdminLayout";
import {
  mockMLMetrics,
  mockBehaviorPatterns,
  mockPredictionData,
  mockTopFlagged,
} from "../data/mockData";
import "../styles/mlinsights.css";

const riskConfig = {
  high:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   label: "High"   },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "Medium" },
  low:    { color: "#2DD4BF", bg: "rgba(45,212,191,0.1)",  label: "Low"    },
};

function MLInsights() {
  const maxPredicted = Math.max(...mockPredictionData.map((d) => Math.max(d.actual || 0, d.predicted)));

  return (
    <AdminLayout>
      <section className="ml-header">
        <div>
          <p className="ml-header-sub">AI-Powered Analytics</p>
          <h2 className="ml-header-title">ML Insights</h2>
        </div>
        <div className="ml-model-tag">
          <span className="ml-model-dot" />
          Model Active · Random Forest v2.1
        </div>
      </section>

      {/* ML Metric Cards */}
      <div className="ml-metrics-grid">
        {mockMLMetrics.map((m, i) => (
          <div className="ml-metric-card" key={m.label} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="ml-metric-top">
              <p className="ml-metric-label">{m.label}</p>
              <span className="ml-metric-trend" style={{ color: m.color }}>↑ {m.trend}</span>
            </div>
            <p className="ml-metric-value" style={{ color: m.color }}>{m.value}</p>
            <p className="ml-metric-sub">{m.sub}</p>
            <div className="ml-metric-glow" style={{ background: m.color }} />
          </div>
        ))}
      </div>

      <div className="ml-main-grid">

        {/* Prediction Chart */}
        <div className="ml-chart-box">
          <div className="ml-chart-header">
            <div>
              <h3 className="ml-chart-title">Spending Predictions vs Actual</h3>
              <p className="ml-chart-sub">AI forecast accuracy over 6 months + next month projection</p>
            </div>
            <div className="ml-legend">
              <span className="ml-legend-item ml-legend-item--actual">Actual</span>
              <span className="ml-legend-item ml-legend-item--predicted">Predicted</span>
            </div>
          </div>

          <div className="ml-bar-chart">
            {mockPredictionData.map((d, i) => (
              <div key={d.month} className="ml-bar-group" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="ml-bar-pair">
                  {/* Actual */}
                  <div className="ml-bar-col">
                    {d.actual && (
                      <div
                        className="ml-bar ml-bar--actual"
                        style={{ height: `${(d.actual / maxPredicted) * 130}px` }}
                        title={`Actual: ₱${d.actual.toLocaleString()}`}
                      />
                    )}
                  </div>
                  {/* Predicted */}
                  <div className="ml-bar-col">
                    <div
                      className={`ml-bar ml-bar--predicted ${!d.actual ? "ml-bar--forecast" : ""}`}
                      style={{ height: `${(d.predicted / maxPredicted) * 130}px` }}
                      title={`Predicted: ₱${d.predicted.toLocaleString()}`}
                    />
                  </div>
                </div>
                <span className="ml-bar-label">{d.month}</span>
                {!d.actual && <span className="ml-bar-forecast-tag">forecast</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Top Flagged */}
        <div className="ml-flagged-box">
          <div className="ml-chart-header">
            <div>
              <h3 className="ml-chart-title">Top Risk Users</h3>
              <p className="ml-chart-sub">Highest AI-calculated risk scores</p>
            </div>
          </div>

          <ul className="ml-flagged-list">
            {mockTopFlagged.map((u, i) => (
              <li key={u.name} className="ml-flagged-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ml-flagged-rank">#{i + 1}</div>
                <div className="ml-flagged-avatar">{u.avatar}</div>
                <div className="ml-flagged-info">
                  <p className="ml-flagged-name">{u.name}</p>
                  <p className="ml-flagged-reason">{u.reason}</p>
                </div>
                <div className="ml-risk-score-wrap">
                  <svg viewBox="0 0 36 36" className="ml-risk-ring">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={u.risk >= 80 ? "#ef4444" : "#F59E0B"}
                      strokeWidth="3"
                      strokeDasharray={`${(u.risk / 100) * 94.2} 94.2`}
                      strokeDashoffset="23.55"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="ml-risk-num" style={{ color: u.risk >= 80 ? "#ef4444" : "#F59E0B" }}>
                    {u.risk}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Behavioral Patterns */}
      <div className="ml-patterns-box">
        <div className="ml-chart-header" style={{ marginBottom: "1.25rem" }}>
          <div>
            <h3 className="ml-chart-title">Detected Behavioral Patterns</h3>
            <p className="ml-chart-sub">AI-identified spending behaviors across user base</p>
          </div>
          <span className="ml-pattern-total">{mockBehaviorPatterns.length} patterns detected</span>
        </div>

        <div className="ml-patterns-grid">
          {mockBehaviorPatterns.map((p, i) => (
            <div key={p.pattern} className="ml-pattern-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="ml-pattern-top">
                <span className="ml-risk-badge" style={{ color: riskConfig[p.risk].color, background: riskConfig[p.risk].bg }}>
                  {riskConfig[p.risk].label} Risk
                </span>
                <span className="ml-pattern-affected">{p.affected} users</span>
              </div>
              <h4 className="ml-pattern-name">{p.pattern}</h4>
              <p className="ml-pattern-desc">{p.description}</p>
              <div className="ml-pattern-bar">
                <div
                  className="ml-pattern-bar-fill"
                  style={{
                    width: `${(p.affected / 50) * 100}%`,
                    background: riskConfig[p.risk].color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default MLInsights;