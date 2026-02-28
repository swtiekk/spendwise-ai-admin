import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  mockMLMetrics,
  mockBehaviorPatterns,
  mockPredictionData,
  mockTopFlagged,
  mockCategoryData,
} from "../data/mockData";
import "../styles/mlinsights.css";

const riskConfig = {
  high:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   label: "High"   },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "Medium" },
  low:    { color: "#2DD4BF", bg: "rgba(45,212,191,0.1)",  label: "Low"    },
};

// ── Cluster Distribution Chart ──
const clusterData = [
  { label: "Savers",       value: 312, color: "#2DD4BF", desc: "Consistently under budget, high savings rate" },
  { label: "Balanced",     value: 487, color: "#6366F1", desc: "Moderate spending, occasional alerts" },
  { label: "Impulsive",    value: 284, color: "#F59E0B", desc: "Frequent unplanned purchases detected" },
  { label: "At-Risk",      value: 201, color: "#ef4444", desc: "Exceeding budget, multiple alerts flagged" },
];

// ── Confusion Matrix ──
const confusionMatrix = {
  labels: ["Will Overspend", "Won't Overspend"],
  matrix: [
    [142, 18],
    [11, 329],
  ],
};

function MLInsights() {
  const [activeTab, setActiveTab]           = useState("overview");
  const [selectedBar, setSelectedBar]       = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [hoveredBar, setHoveredBar]         = useState(null);
  const [riskFilter, setRiskFilter]         = useState("all");

  const maxPredicted = Math.max(...mockPredictionData.map((d) => Math.max(d.actual || 0, d.predicted)));
  const maxCluster   = Math.max(...clusterData.map((d) => d.value));

  const totalClusters = clusterData.reduce((s, d) => s + d.value, 0);

  const filteredPatterns = riskFilter === "all"
    ? mockBehaviorPatterns
    : mockBehaviorPatterns.filter((p) => p.risk === riskFilter);

  // confusion matrix totals
  const cmTotal = confusionMatrix.matrix.flat().reduce((a, b) => a + b, 0);
  const cmAccuracy = ((confusionMatrix.matrix[0][0] + confusionMatrix.matrix[1][1]) / cmTotal * 100).toFixed(1);

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <section className="ml-header">
        <div>
          <p className="ml-header-sub">AI-Powered Analytics</p>
          <h2 className="ml-header-title">ML Insights</h2>
        </div>
        <div className="ml-header-right">
          <div className="ml-model-tag">
            <span className="ml-model-dot" />
            Model Active · Random Forest v2.1
          </div>
          <div className="ml-accuracy-badge">
            🎯 {cmAccuracy}% Accuracy
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="ml-tabs">
        {[
          { key: "overview",  label: "Overview",            icon: "⊞" },
          { key: "clusters",  label: "Cluster Distribution",icon: "◉" },
          { key: "patterns",  label: "Behavior Patterns",   icon: "📊" },
          { key: "matrix",    label: "Confusion Matrix",    icon: "🔢" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`ml-tab ${activeTab === tab.key ? "ml-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: OVERVIEW ══════════════ */}
      {activeTab === "overview" && (
        <>
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
            {/* Prediction Chart — clickable bars */}
            <div className="ml-chart-box">
              <div className="ml-chart-header">
                <div>
                  <h3 className="ml-chart-title">Spending Predictions vs Actual</h3>
                  <p className="ml-chart-sub">
                    {selectedBar
                      ? `${selectedBar.month}: Actual ₱${(selectedBar.actual || 0).toLocaleString()} · Predicted ₱${selectedBar.predicted.toLocaleString()}`
                      : "Click a bar to see details"}
                  </p>
                </div>
                <div className="ml-legend">
                  <span className="ml-legend-item ml-legend-item--actual">Actual</span>
                  <span className="ml-legend-item ml-legend-item--predicted">Predicted</span>
                </div>
              </div>

              <div className="ml-bar-chart">
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
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="ml-tooltip">
                          <p className="ml-tooltip-month">{d.month}</p>
                          {d.actual && <p className="ml-tooltip-row"><span style={{color:"#2DD4BF"}}>●</span> Actual: ₱{d.actual.toLocaleString()}</p>}
                          <p className="ml-tooltip-row"><span style={{color:"#6366F1"}}>●</span> Predicted: ₱{d.predicted.toLocaleString()}</p>
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

              {/* Selected bar detail */}
              {selectedBar && (
                <div className="ml-bar-detail">
                  <div className="ml-bar-detail-item">
                    <span style={{ color: "#2DD4BF" }}>●</span>
                    <span>Actual</span>
                    <strong>{selectedBar.actual ? `₱${selectedBar.actual.toLocaleString()}` : "—"}</strong>
                  </div>
                  <div className="ml-bar-detail-item">
                    <span style={{ color: "#6366F1" }}>●</span>
                    <span>Predicted</span>
                    <strong>₱{selectedBar.predicted.toLocaleString()}</strong>
                  </div>
                  {selectedBar.actual && (
                    <div className="ml-bar-detail-item">
                      <span style={{ color: "#F59E0B" }}>●</span>
                      <span>Variance</span>
                      <strong style={{ color: selectedBar.actual > selectedBar.predicted ? "#ef4444" : "#0d9488" }}>
                        {selectedBar.actual > selectedBar.predicted ? "+" : "-"}
                        ₱{Math.abs(selectedBar.actual - selectedBar.predicted).toLocaleString()}
                      </strong>
                    </div>
                  )}
                  <button className="ml-bar-detail-close" onClick={() => setSelectedBar(null)}>✕</button>
                </div>
              )}
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
            </div>
          </div>
        </>
      )}

      {/* ══════════════ TAB: CLUSTERS ══════════════ */}
      {activeTab === "clusters" && (
        <div className="ml-clusters-wrap">
          <div className="ml-clusters-grid">

            {/* Horizontal bar chart */}
            <div className="ml-chart-box">
              <div className="ml-chart-header">
                <div>
                  <h3 className="ml-chart-title">Cluster Distribution</h3>
                  <p className="ml-chart-sub">
                    {selectedCluster
                      ? `${selectedCluster.label} — ${selectedCluster.desc}`
                      : `${totalClusters.toLocaleString()} users across 4 clusters · Click to explore`}
                  </p>
                </div>
                {selectedCluster && (
                  <button className="ml-clear-btn" onClick={() => setSelectedCluster(null)}>Clear ✕</button>
                )}
              </div>

              <div className="ml-cluster-bars">
                {clusterData.map((c, i) => {
                  const isActive = !selectedCluster || selectedCluster.label === c.label;
                  return (
                    <div
                      key={c.label}
                      className={`ml-cluster-row ${selectedCluster?.label === c.label ? "ml-cluster-row--selected" : ""}`}
                      onClick={() => setSelectedCluster(selectedCluster?.label === c.label ? null : c)}
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <div className="ml-cluster-label-wrap">
                        <span className="ml-cluster-dot" style={{ background: c.color }} />
                        <span className="ml-cluster-name">{c.label}</span>
                        <span className="ml-cluster-pct" style={{ color: c.color }}>
                          {((c.value / totalClusters) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="ml-cluster-track">
                        <div
                          className="ml-cluster-fill"
                          style={{
                            width: isActive ? `${(c.value / maxCluster) * 100}%` : "0%",
                            background: c.color,
                            opacity: isActive ? 1 : 0.2,
                          }}
                        />
                      </div>
                      <span className="ml-cluster-count">{c.value.toLocaleString()} users</span>
                    </div>
                  );
                })}
              </div>

              {/* Donut visualization */}
              <div className="ml-cluster-donut-wrap">
                <svg viewBox="0 0 180 180" className="ml-cluster-donut">
                  {(() => {
                    let cum = 0;
                    const r = 70; const cx = 90; const cy = 90;
                    const circ = 2 * Math.PI * r;
                    return clusterData.map((c) => {
                      const frac = c.value / totalClusters;
                      const dash = frac * circ;
                      const gap  = circ - dash;
                      const off  = circ * (1 - cum);
                      cum += frac;
                      const isActive = !selectedCluster || selectedCluster.label === c.label;
                      return (
                        <circle key={c.label} cx={cx} cy={cy} r={r}
                          fill="none" stroke={c.color} strokeWidth="22"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset={off} strokeLinecap="butt"
                          style={{
                            transform: "rotate(-90deg)", transformOrigin: "center",
                            opacity: isActive ? 1 : 0.2,
                            transition: "opacity 0.3s",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedCluster(selectedCluster?.label === c.label ? null : c)}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="ml-cluster-donut-center">
                  {selectedCluster ? (
                    <>
                      <span className="ml-cluster-donut-val" style={{ color: selectedCluster.color }}>
                        {selectedCluster.value}
                      </span>
                      <span className="ml-cluster-donut-lbl">{selectedCluster.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="ml-cluster-donut-val">{totalClusters}</span>
                      <span className="ml-cluster-donut-lbl">total users</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cluster detail card */}
            <div className="ml-chart-box ml-cluster-detail-box">
              <h3 className="ml-chart-title" style={{ marginBottom: "1rem" }}>
                {selectedCluster ? `${selectedCluster.label} Cluster` : "Select a Cluster"}
              </h3>

              {!selectedCluster ? (
                <div className="ml-cluster-placeholder">
                  <div className="ml-cluster-placeholder-icon">◉</div>
                  <p>Click any cluster bar or donut segment to see detailed breakdown</p>
                </div>
              ) : (
                <div className="ml-cluster-info" style={{ animationName: "mlFlagIn" }}>
                  <div className="ml-cluster-info-badge" style={{ background: selectedCluster.color + "20", color: selectedCluster.color }}>
                    {selectedCluster.label}
                  </div>
                  <p className="ml-cluster-info-desc">{selectedCluster.desc}</p>

                  <div className="ml-cluster-info-stats">
                    <div className="ml-cluster-stat">
                      <p className="ml-cluster-stat-label">Users</p>
                      <p className="ml-cluster-stat-val" style={{ color: selectedCluster.color }}>{selectedCluster.value.toLocaleString()}</p>
                    </div>
                    <div className="ml-cluster-stat">
                      <p className="ml-cluster-stat-label">Share</p>
                      <p className="ml-cluster-stat-val" style={{ color: selectedCluster.color }}>
                        {((selectedCluster.value / totalClusters) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="ml-cluster-stat">
                      <p className="ml-cluster-stat-label">Risk Level</p>
                      <p className="ml-cluster-stat-val" style={{ color: selectedCluster.color }}>
                        {selectedCluster.label === "Savers" ? "Low" :
                         selectedCluster.label === "Balanced" ? "Low-Med" :
                         selectedCluster.label === "Impulsive" ? "Medium" : "High"}
                      </p>
                    </div>
                  </div>

                  {/* Mini spending category breakdown per cluster */}
                  <p className="ml-cluster-breakdown-title">Typical Spending Pattern</p>
                  <div className="ml-cluster-breakdown">
                    {mockCategoryData.map((cat) => {
                      const multiplier =
                        selectedCluster.label === "Savers"    ? 0.6 :
                        selectedCluster.label === "Balanced"  ? 1.0 :
                        selectedCluster.label === "Impulsive" ? 1.4 : 1.8;
                      const pct = Math.min(100, ((cat.value * multiplier) / (70000 * multiplier)) * 100);
                      return (
                        <div key={cat.label} className="ml-cluster-cat-row">
                          <span className="ml-cluster-cat-dot" style={{ background: cat.color }} />
                          <span className="ml-cluster-cat-name">{cat.label}</span>
                          <div className="ml-cluster-cat-bar">
                            <div style={{ width: `${pct}%`, background: cat.color }} className="ml-cluster-cat-fill" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB: BEHAVIOR PATTERNS ══════════════ */}
      {activeTab === "patterns" && (
        <div className="ml-patterns-wrap">
          {/* Filter bar */}
          <div className="ml-pattern-filter-bar">
            <span className="ml-pattern-filter-label">Filter by risk:</span>
            {["all", "high", "medium", "low"].map((r) => (
              <button
                key={r}
                className={`ml-pattern-filter-btn ${riskFilter === r ? "ml-pattern-filter-btn--active" : ""}`}
                style={riskFilter === r && r !== "all" ? { background: riskConfig[r]?.color, borderColor: riskConfig[r]?.color } : {}}
                onClick={() => setRiskFilter(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
            <span className="ml-pattern-count">{filteredPatterns.length} pattern{filteredPatterns.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="ml-patterns-grid">
            {filteredPatterns.map((p, i) => (
              <div
                key={p.pattern}
                className={`ml-pattern-card ${selectedPattern?.pattern === p.pattern ? "ml-pattern-card--selected" : ""}`}
                style={{ animationDelay: `${i * 0.07}s`, cursor: "pointer" }}
                onClick={() => setSelectedPattern(selectedPattern?.pattern === p.pattern ? null : p)}
              >
                <div className="ml-pattern-top">
                  <span className="ml-risk-badge" style={{ color: riskConfig[p.risk].color, background: riskConfig[p.risk].bg }}>
                    {riskConfig[p.risk].label} Risk
                  </span>
                  <span className="ml-pattern-affected">{p.affected} users</span>
                </div>
                <h4 className="ml-pattern-name">{p.pattern}</h4>
                <p className="ml-pattern-desc">{p.description}</p>
                <div className="ml-pattern-bar">
                  <div className="ml-pattern-bar-fill"
                    style={{ width: `${(p.affected / 50) * 100}%`, background: riskConfig[p.risk].color }}
                  />
                </div>

                {/* Expanded detail on click */}
                {selectedPattern?.pattern === p.pattern && (
                  <div className="ml-pattern-detail">
                    <div className="ml-pattern-detail-row">
                      <span>Affected Users</span><strong style={{ color: riskConfig[p.risk].color }}>{p.affected}</strong>
                    </div>
                    <div className="ml-pattern-detail-row">
                      <span>Risk Level</span><strong>{riskConfig[p.risk].label}</strong>
                    </div>
                    <div className="ml-pattern-detail-row">
                      <span>AI Action</span>
                      <strong style={{ color: "#0d9488" }}>
                        {p.risk === "high" ? "Auto-alert sent" : p.risk === "medium" ? "Advisory queued" : "Monitoring"}
                      </strong>
                    </div>
                    <div className="ml-pattern-detail-row">
                      <span>Detection Rate</span>
                      <strong>{p.risk === "high" ? "97%" : p.risk === "medium" ? "91%" : "85%"}</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ TAB: CONFUSION MATRIX ══════════════ */}
      {activeTab === "matrix" && (
        <div className="ml-matrix-wrap">
          <div className="ml-matrix-grid">

            {/* Matrix */}
            <div className="ml-chart-box">
              <div className="ml-chart-header">
                <div>
                  <h3 className="ml-chart-title">Confusion Matrix</h3>
                  <p className="ml-chart-sub">Model prediction results — hover cells for details</p>
                </div>
                <span className="ml-accuracy-pill">Accuracy: {cmAccuracy}%</span>
              </div>

              <div className="ml-matrix-layout">
                <div className="ml-matrix-axis-label ml-matrix-axis-label--top">Predicted</div>
                <div className="ml-matrix-axis-label ml-matrix-axis-label--left">Actual</div>

                <div className="ml-matrix-table-wrap">
                  {/* Column headers */}
                  <div className="ml-matrix-col-headers">
                    <div className="ml-matrix-corner" />
                    {confusionMatrix.labels.map((l) => (
                      <div key={l} className="ml-matrix-col-header">{l}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  {confusionMatrix.matrix.map((row, ri) => (
                    <div key={ri} className="ml-matrix-row">
                      <div className="ml-matrix-row-header">{confusionMatrix.labels[ri]}</div>
                      {row.map((val, ci) => {
                        const isDiag  = ri === ci;
                        const pct     = ((val / cmTotal) * 100).toFixed(1);
                        const rowTotal = row.reduce((a, b) => a + b, 0);
                        const recall  = ((val / rowTotal) * 100).toFixed(1);
                        return (
                          <div
                            key={ci}
                            className={`ml-matrix-cell ${isDiag ? "ml-matrix-cell--correct" : "ml-matrix-cell--wrong"}`}
                            title={`${val} cases (${pct}% of total)`}
                          >
                            <span className="ml-matrix-cell-val">{val}</span>
                            <span className="ml-matrix-cell-pct">{pct}%</span>
                            {isDiag && <span className="ml-matrix-cell-tag">✓ correct</span>}
                            {!isDiag && <span className="ml-matrix-cell-tag">✗ error</span>}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model performance stats */}
            <div className="ml-chart-box">
              <div className="ml-chart-header">
                <div>
                  <h3 className="ml-chart-title">Model Performance</h3>
                  <p className="ml-chart-sub">Derived from confusion matrix</p>
                </div>
              </div>

              <div className="ml-perf-stats">
                {[
                  { label: "Accuracy",  value: `${cmAccuracy}%`, color: "#2DD4BF", desc: "Overall correct predictions",       formula: "(TP+TN) / Total" },
                  { label: "Precision", value: "92.8%",           color: "#6366F1", desc: "Of predicted overspend, how many were right", formula: "TP / (TP+FP)" },
                  { label: "Recall",    value: "88.7%",           color: "#F59E0B", desc: "Of actual overspend, how many were caught",   formula: "TP / (TP+FN)" },
                  { label: "F1 Score",  value: "90.7%",           color: "#1A2B47", desc: "Balance between precision and recall",  formula: "2×(P×R)/(P+R)" },
                ].map((s, i) => (
                  <div key={s.label} className="ml-perf-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="ml-perf-stat-top">
                      <p className="ml-perf-stat-label">{s.label}</p>
                      <code className="ml-perf-formula">{s.formula}</code>
                    </div>
                    <p className="ml-perf-stat-value" style={{ color: s.color }}>{s.value}</p>
                    <p className="ml-perf-stat-desc">{s.desc}</p>
                    <div className="ml-perf-stat-bar">
                      <div style={{ width: s.value, background: s.color }} className="ml-perf-stat-fill" />
                    </div>
                  </div>
                ))}
              </div>

              {/* TP TN FP FN legend */}
              <div className="ml-matrix-legend">
                <div className="ml-matrix-legend-item ml-matrix-legend-item--tp">
                  <strong>TP = {confusionMatrix.matrix[0][0]}</strong> True Positive
                </div>
                <div className="ml-matrix-legend-item ml-matrix-legend-item--fp">
                  <strong>FP = {confusionMatrix.matrix[1][0]}</strong> False Positive
                </div>
                <div className="ml-matrix-legend-item ml-matrix-legend-item--fn">
                  <strong>FN = {confusionMatrix.matrix[0][1]}</strong> False Negative
                </div>
                <div className="ml-matrix-legend-item ml-matrix-legend-item--tn">
                  <strong>TN = {confusionMatrix.matrix[1][1]}</strong> True Negative
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

export default MLInsights;