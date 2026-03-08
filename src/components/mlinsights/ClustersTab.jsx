import { useMLInsights, CLUSTER_DATA } from "../../hooks/usemlinsight";

function ClustersTab({ mockCategoryData }) {
  const {
    selectedCluster,
    setSelectedCluster,
    maxCluster,
    totalClusters,
    handleClusterToggle
  } = useMLInsights();

  return (
    <div className="ml-clusters-wrap">
      <div className="ml-clusters-grid">
        <section className="ml-chart-box" aria-labelledby="cluster-dist-title">
          <header className="ml-chart-header">
            <div>
              <h3 id="cluster-dist-title" className="ml-chart-title">Cluster Distribution</h3>
              <p className="ml-chart-sub">
                {selectedCluster
                  ? `${selectedCluster.label} — ${selectedCluster.desc}`
                  : `${totalClusters.toLocaleString()} users across 4 clusters · Click to explore`}
              </p>
            </div>
            {selectedCluster && (
              <button 
                type="button"
                className="ml-clear-btn" 
                onClick={() => setSelectedCluster(null)}
                aria-label="Clear cluster selection"
              >
                Clear ✕
              </button>
            )}
          </header>

          <div className="ml-cluster-bars" role="list" aria-label="Cluster list">
            {CLUSTER_DATA.map((c, i) => {
              const isActive = !selectedCluster || selectedCluster.label === c.label;
              const percentage = ((c.value / totalClusters) * 100).toFixed(1);
              
              return (
                <div
                  key={c.label}
                  role="button"
                  tabIndex={0}
                  className={`ml-cluster-row ${selectedCluster?.label === c.label ? "ml-cluster-row--selected" : ""}`}
                  onClick={() => handleClusterToggle(c)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClusterToggle(c); }}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  aria-pressed={selectedCluster?.label === c.label}
                >
                  <div className="ml-cluster-label-wrap">
                    <span className="ml-cluster-dot" style={{ background: c.color }} aria-hidden="true" />
                    <span className="ml-cluster-name">{c.label}</span>
                    <data value={percentage} className="ml-cluster-pct" style={{ color: c.color }}>
                      {percentage}%
                    </data>
                  </div>
                  <div className="ml-cluster-track" aria-hidden="true">
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

          <figure className="ml-cluster-donut-wrap">
            <svg viewBox="0 0 180 180" className="ml-cluster-donut" role="img" aria-label="Donut chart showing cluster proportions">
              {(() => {
                let cum = 0;
                const r = 70; const cx = 90; const cy = 90;
                const circ = 2 * Math.PI * r;
                return CLUSTER_DATA.map((c) => {
                  const frac = c.value / totalClusters;
                  const dash = frac * circ;
                  const gap  = circ - dash;
                  const off  = circ * (1 - cum);
                  cum += frac;
                  const isActive = !selectedCluster || selectedCluster.label === c.label;
                  return (
                    <circle 
                      key={c.label} 
                      cx={cx} cy={cy} r={r}
                      fill="none" stroke={c.color} strokeWidth="22"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={off} 
                      style={{
                        transform: "rotate(-90deg)", transformOrigin: "center",
                        opacity: isActive ? 1 : 0.2,
                        transition: "opacity 0.3s",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClusterToggle(c)}
                    >
                      <title>{c.label}: {((c.value / totalClusters) * 100).toFixed(1)}%</title>
                    </circle>
                  );
                });
              })()}
            </svg>
            <figcaption className="ml-cluster-donut-center">
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
            </figcaption>
          </figure>
        </section>

        <section className="ml-chart-box ml-cluster-detail-box" aria-labelledby="cluster-detail-title">
          <h3 id="cluster-detail-title" className="ml-chart-title" style={{ marginBottom: "1rem" }}>
            {selectedCluster ? `${selectedCluster.label} Cluster` : "Select a Cluster"}
          </h3>

          {!selectedCluster ? (
            <div className="ml-cluster-placeholder">
              <div className="ml-cluster-placeholder-icon" aria-hidden="true">◉</div>
              <p>Click any cluster bar or donut segment to see detailed breakdown</p>
            </div>
          ) : (
            <article className="ml-cluster-info">
              <header>
                <div className="ml-cluster-info-badge" style={{ background: selectedCluster.color + "20", color: selectedCluster.color }}>
                  {selectedCluster.label}
                </div>
                <p className="ml-cluster-info-desc">{selectedCluster.desc}</p>
              </header>

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

              <section aria-labelledby="spending-pattern-title">
                <h4 id="spending-pattern-title" className="ml-cluster-breakdown-title">Typical Spending Pattern</h4>
                <div className="ml-cluster-breakdown">
                  {mockCategoryData.map((cat) => {
                    const multiplier =
                      selectedCluster.label === "Savers"    ? 0.6 :
                      selectedCluster.label === "Balanced"  ? 1.0 :
                      selectedCluster.label === "Impulsive" ? 1.4 : 1.8;
                    const pct = Math.min(100, ((cat.value * multiplier) / (70000 * multiplier)) * 100);
                    
                    return (
                      <div key={cat.label} className="ml-cluster-cat-row">
                        <span className="ml-cluster-cat-dot" style={{ background: cat.color }} aria-hidden="true" />
                        <span className="ml-cluster-cat-name">{cat.label}</span>
                        <div className="ml-cluster-cat-bar" aria-hidden="true">
                          <div style={{ width: `${pct}%`, background: cat.color }} className="ml-cluster-cat-fill" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

export default ClustersTab;