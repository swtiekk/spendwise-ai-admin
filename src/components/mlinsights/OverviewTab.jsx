import { useState, useMemo } from "react";

function OverviewTab({ mockMLMetrics, mockPredictionData, mockTopFlagged }) {
  const [selectedBar, setSelectedBar] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxPredicted = useMemo(() => 
    Math.max(...mockPredictionData.map((d) => Math.max(d.actual || 0, d.predicted))),
    [mockPredictionData]
  );

  return (
    <>
      <section className="ml-metrics-grid" aria-label="Machine Learning Performance Metrics">
        {mockMLMetrics.map((m, i) => (
          <article 
            className="ml-metric-card" 
            key={m.label} 
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <header className="ml-metric-top">
              <h3 className="ml-metric-label">{m.label}</h3>
              <span className="ml-metric-trend" style={{ color: m.color }} aria-label={`Trend: up ${m.trend}`}>
                ↑ {m.trend}
              </span>
            </header>
            <p className="ml-metric-value" style={{ color: m.color }}>{m.value}</p>
            <p className="ml-metric-sub">{m.sub}</p>
            <div className="ml-metric-glow" style={{ background: m.color }} aria-hidden="true" />
          </article>
        ))}
      </section>

      <div className="ml-main-grid">
        <section className="ml-chart-box" aria-labelledby="prediction-chart-title">
          <header className="ml-chart-header">
            <div>
              <h3 id="prediction-chart-title" className="ml-chart-title">Spending Predictions vs Actual</h3>
              <p className="ml-chart-sub">
                {selectedBar
                  ? `${selectedBar.month}: Actual ₱${(selectedBar.actual || 0).toLocaleString()} · Predicted ₱${selectedBar.predicted.toLocaleString()}`
                  : "Click a bar to see details"}
              </p>
            </div>
            <div className="ml-legend" aria-hidden="true">
              <span className="ml-legend-item ml-legend-item--actual">Actual</span>
              <span className="ml-legend-item ml-legend-item--predicted">Predicted</span>
            </div>
          </header>

          <div className="ml-bar-chart" role="img" aria-label="Bar chart showing spending predictions vs actual spending">
            {mockPredictionData.map((d, i) => {
              const isSelected = selectedBar?.month === d.month;
              const isHovered  = hoveredBar === d.month;
              return (
                <div
                  key={d.month}
                  className={`ml-bar-group ${isSelected ? "ml-bar-group--selected" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => setSelectedBar(isSelected ? null : d)}
                  onMouseEnter={() => setHoveredBar(d.month)}
                  onMouseLeave={() => setHoveredBar(null)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedBar(isSelected ? null : d); }}
                >
                  {isHovered && (
                    <div className="ml-tooltip" role="tooltip">
                      <p className="ml-tooltip-month">{d.month}</p>
                      {d.actual && <p className="ml-tooltip-row"><span style={{color:"#2DD4BF"}} aria-hidden="true">●</span> Actual: ₱{d.actual.toLocaleString()}</p>}
                      <p className="ml-tooltip-row"><span style={{color:"#6366F1"}} aria-hidden="true">●</span> Predicted: ₱{d.predicted.toLocaleString()}</p>
                      {d.actual && (
                        <p className="ml-tooltip-diff" style={{ color: d.actual > d.predicted ? "#ef4444" : "#0d9488" }}>
                          {d.actual > d.predicted ? "▲" : "▼"} ₱{Math.abs(d.actual - d.predicted).toLocaleString()} diff
                        </p>
                      )}
                    </div>
                  )}

                  <div className="ml-bar-pair">
                    <div className="ml-bar-col">
                      {d.actual && (
                        <div
                          className="ml-bar ml-bar--actual"
                          style={{
                            height: `${(d.actual / maxPredicted) * 130}px`,
                            opacity: isSelected || !selectedBar ? 1 : 0.35,
                          }}
                        />
                      )}
                    </div>
                    <div className="ml-bar-col">
                      <div
                        className={`ml-bar ml-bar--predicted ${!d.actual ? "ml-bar--forecast" : ""}`}
                        style={{
                          height: `${(d.predicted / maxPredicted) * 130}px`,
                          opacity: isSelected || !selectedBar ? 1 : 0.35,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-bar-label">{d.month}</span>
                  {!d.actual && <span className="ml-bar-forecast-tag">forecast</span>}
                </div>
              );
            })}
          </div>

          {selectedBar && (
            <section className="ml-bar-detail" aria-label="Detailed statistics for selected month">
              <div className="ml-bar-detail-item">
                <span style={{ color: "#2DD4BF" }} aria-hidden="true">●</span>
                <span>Actual</span>
                <strong>{selectedBar.actual ? `₱${selectedBar.actual.toLocaleString()}` : "—"}</strong>
              </div>
              <div className="ml-bar-detail-item">
                <span style={{ color: "#6366F1" }} aria-hidden="true">●</span>
                <span>Predicted</span>
                <strong>₱{selectedBar.predicted.toLocaleString()}</strong>
              </div>
              {selectedBar.actual && (
                <div className="ml-bar-detail-item">
                  <span style={{ color: "#F59E0B" }} aria-hidden="true">●</span>
                  <span>Variance</span>
                  <strong style={{ color: selectedBar.actual > selectedBar.predicted ? "#ef4444" : "#0d9488" }}>
                    {selectedBar.actual > selectedBar.predicted ? "+" : "-"}
                    ₱{Math.abs(selectedBar.actual - selectedBar.predicted).toLocaleString()}
                  </strong>
                </div>
              )}
              <button 
                type="button"
                className="ml-bar-detail-close" 
                onClick={() => setSelectedBar(null)}
                aria-label="Close detailed view"
              >
                ✕
              </button>
            </section>
          )}
        </section>

        <section className="ml-flagged-box" aria-labelledby="risk-users-title">
          <header className="ml-chart-header">
            <h3 id="risk-users-title" className="ml-chart-title">Top Risk Users</h3>
            <p className="ml-chart-sub">Highest AI-calculated risk scores</p>
          </header>
          <ul className="ml-flagged-list">
            {mockTopFlagged.map((u, i) => (
              <li key={u.name} className="ml-flagged-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ml-flagged-rank" aria-label={`Rank ${i + 1}`}>#{i + 1}</div>
                <div className="ml-flagged-avatar" aria-hidden="true">{u.avatar}</div>
                <article className="ml-flagged-info">
                  <h4 className="ml-flagged-name">{u.name}</h4>
                  <p className="ml-flagged-reason">{u.reason}</p>
                </article>
                <div className="ml-risk-score-wrap" aria-label={`Risk score: ${u.risk}%`}>
                  <svg viewBox="0 0 36 36" className="ml-risk-ring" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                    <circle cx="18" cy="18" r="15" fill="none"
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
        </section>
      </div>
    </>
  );
}

export default OverviewTab;