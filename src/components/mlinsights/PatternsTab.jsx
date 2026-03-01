import { useState } from "react";

const riskConfig = {
  high:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   label: "High"   },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "Medium" },
  low:    { color: "#2DD4BF", bg: "rgba(45,212,191,0.1)",  label: "Low"    },
};

function PatternsTab({ mockBehaviorPatterns }) {
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedPattern, setSelectedPattern] = useState(null);

  const filteredPatterns = riskFilter === "all"
    ? mockBehaviorPatterns
    : mockBehaviorPatterns.filter((p) => p.risk === riskFilter);

  return (
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
  );
}

export default PatternsTab;