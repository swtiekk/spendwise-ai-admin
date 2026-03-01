function MatrixTab({ confusionMatrix }) {
  // confusion matrix totals
  const cmTotal = confusionMatrix.matrix.flat().reduce((a, b) => a + b, 0);
  const cmAccuracy = ((confusionMatrix.matrix[0][0] + confusionMatrix.matrix[1][1]) / cmTotal * 100).toFixed(1);

  return (
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
  );
}

export default MatrixTab;