import { useMLInsights, RISK_CONFIG } from "../../hooks/usemlinsight";

function PatternsTab({ mockBehaviorPatterns }) {
  const {
    riskFilter,
    setRiskFilter,
    selectedPattern,
    filteredPatterns,
    handlePatternToggle
  } = useMLInsights();

  return (
    <div className="ml-patterns-wrap">
      <nav className="ml-pattern-filter-bar" aria-label="Risk level filters">
        <span className="ml-pattern-filter-label" id="filter-label">Filter by risk:</span>
        <div role="group" aria-labelledby="filter-label" style={{ display: 'flex', gap: '0.5rem' }}>
          {["all", "high", "medium", "low"].map((r) => (
            <button
              key={r}
              type="button"
              className={`ml-pattern-filter-btn ${riskFilter === r ? "ml-pattern-filter-btn--active" : ""}`}
              style={riskFilter === r && r !== "all" ? { background: RISK_CONFIG[r]?.color, borderColor: RISK_CONFIG[r]?.color } : {}}
              onClick={() => setRiskFilter(r)}
              aria-pressed={riskFilter === r}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <span className="ml-pattern-count" aria-live="polite">
          {filteredPatterns.length} pattern{filteredPatterns.length !== 1 ? "s" : ""}
        </span>
      </nav>

      <section className="ml-patterns-grid" aria-label="Behavior patterns list">
        {filteredPatterns.map((p, i) => {
          const isSelected = selectedPattern?.pattern === p.pattern;
          const config = RISK_CONFIG[p.risk];
          
          return (
            <article
              key={p.pattern}
              role="button"
              tabIndex={0}
              className={`ml-pattern-card ${isSelected ? "ml-pattern-card--selected" : ""}`}
              style={{ animationDelay: `${i * 0.07}s`, cursor: "pointer" }}
              onClick={() => handlePatternToggle(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePatternToggle(p); }}
              aria-expanded={isSelected}
            >
              <header className="ml-pattern-top">
                <span className="ml-risk-badge" style={{ color: config.color, background: config.bg }}>
                  {config.label} Risk
                </span>
                <span className="ml-pattern-affected">{p.affected} users</span>
              </header>
              <h4 className="ml-pattern-name">{p.pattern}</h4>
              <p className="ml-pattern-desc">{p.description}</p>
              <div className="ml-pattern-bar" aria-hidden="true">
                <div 
                  className="ml-pattern-bar-fill"
                  style={{ width: `${(p.affected / 50) * 100}%`, background: config.color }}
                />
              </div>

              {isSelected && (
                <section className="ml-pattern-detail" aria-label={`Details for ${p.pattern}`}>
                  <div className="ml-pattern-detail-row">
                    <span>Affected Users</span>
                    <strong style={{ color: config.color }}>{p.affected}</strong>
                  </div>
                  <div className="ml-pattern-detail-row">
                    <span>Risk Level</span>
                    <strong>{config.label}</strong>
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
                </section>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default PatternsTab;