import { useState } from "react";

// ── Cluster Distribution Chart ──
const clusterData = [
  { label: "Savers",       value: 312, color: "#2DD4BF", desc: "Consistently under budget, high savings rate" },
  { label: "Balanced",     value: 487, color: "#6366F1", desc: "Moderate spending, occasional alerts" },
  { label: "Impulsive",    value: 284, color: "#F59E0B", desc: "Frequent unplanned purchases detected" },
  { label: "At-Risk",      value: 201, color: "#ef4444", desc: "Exceeding budget, multiple alerts flagged" },
];

function ClustersTab({ mockCategoryData }) {
  const [selectedCluster, setSelectedCluster] = useState(null);

  const maxCluster = Math.max(...clusterData.map((d) => d.value));
  const totalClusters = clusterData.reduce((s, d) => s + d.value, 0);

  return (
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
  );
}

export default ClustersTab;