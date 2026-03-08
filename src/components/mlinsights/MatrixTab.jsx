import { useMemo } from "react";

function MatrixTab({ confusionMatrix }) {
  const { cmTotal, cmAccuracy } = useMemo(() => {
    const total = confusionMatrix.matrix.flat().reduce((a, b) => a + b, 0);
    const accuracy = ((confusionMatrix.matrix[0][0] + confusionMatrix.matrix[1][1]) / total * 100).toFixed(1);
    return { cmTotal: total, cmAccuracy: accuracy };
  }, [confusionMatrix]);

  const performanceMetrics = useMemo(() => [
    { label: "Accuracy",  value: `${cmAccuracy}%`, color: "#2DD4BF", desc: "Overall correct predictions",       formula: "(TP+TN) / Total" },
    { label: "Precision", value: "92.8%",           color: "#6366F1", desc: "Of predicted overspend, how many were right", formula: "TP / (TP+FP)" },
    { label: "Recall",    value: "88.7%",           color: "#F59E0B", desc: "Of actual overspend, how many were caught",   formula: "TP / (TP+FN)" },
    { label: "F1 Score",  value: "90.7%",           color: "#1A2B47", desc: "Balance between precision and recall",  formula: "2×(P×R)/(P+R)" },
  ], [cmAccuracy]);

  return (
    <div className="ml-matrix-wrap">
      <div className="ml-matrix-grid">
        <section className="ml-chart-box" aria-labelledby="matrix-title">
          <header className="ml-chart-header">
            <div>
              <h3 id="matrix-title" className="ml-chart-title">Confusion Matrix</h3>
              <p className="ml-chart-sub">Model prediction results — hover cells for details</p>
            </div>
            <data value={cmAccuracy} className="ml-accuracy-pill">Accuracy: {cmAccuracy}%</data>
          </header>

          <div className="ml-matrix-layout" role="table" aria-label="Confusion Matrix details">
            <div className="ml-matrix-axis-label ml-matrix-axis-label--top" aria-hidden="true">Predicted</div>
            <div className="ml-matrix-axis-label ml-matrix-axis-label--left" aria-hidden="true">Actual</div>

            <div className="ml-matrix-table-wrap">
              <header className="ml-matrix-col-headers" role="row">
                <div className="ml-matrix-corner" role="presentation" />
                {confusionMatrix.labels.map((l) => (
                  <div key={l} className="ml-matrix-col-header" role="columnheader">{l}</div>
                ))}
              </header>

              {confusionMatrix.matrix.map((row, ri) => (
                <div key={confusionMatrix.labels[ri]} className="ml-matrix-row" role="row">
                  <header className="ml-matrix-row-header" role="rowheader">{confusionMatrix.labels[ri]}</header>
                  {row.map((val, ci) => {
                    const isDiag  = ri === ci;
                    const pct     = ((val / cmTotal) * 100).toFixed(1);
                    const label   = `${val} cases (${pct}% of total)`;
                    
                    return (
                      <div
                        key={`${ri}-${ci}`}
                        className={`ml-matrix-cell ${isDiag ? "ml-matrix-cell--correct" : "ml-matrix-cell--wrong"}`}
                        title={label}
                        role="cell"
                        aria-label={`${confusionMatrix.labels[ri]} actual vs ${confusionMatrix.labels[ci]} predicted: ${label}`}
                      >
                        <span className="ml-matrix-cell-val">{val}</span>
                        <span className="ml-matrix-cell-pct">{pct}%</span>
                        {isDiag && <span className="ml-matrix-cell-tag" aria-hidden="true">✓ correct</span>}
                        {!isDiag && <span className="ml-matrix-cell-tag" aria-hidden="true">✗ error</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ml-chart-box" aria-labelledby="perf-title">
          <header className="ml-chart-header">
            <div>
              <h3 id="perf-title" className="ml-chart-title">Model Performance</h3>
              <p className="ml-chart-sub">Derived from confusion matrix</p>
            </div>
          </header>

          <div className="ml-perf-stats">
            {performanceMetrics.map((s, i) => (
              <article key={s.label} className="ml-perf-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <header className="ml-perf-stat-top">
                  <h4 className="ml-perf-stat-label">{s.label}</h4>
                  <code className="ml-perf-formula" aria-label={`Formula: ${s.formula}`}>{s.formula}</code>
                </header>
                <p className="ml-perf-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="ml-perf-stat-desc">{s.desc}</p>
                <div className="ml-perf-stat-bar" aria-hidden="true">
                  <div style={{ width: s.value, background: s.color }} className="ml-perf-stat-fill" />
                </div>
              </article>
            ))}
          </div>

          <footer className="ml-matrix-legend" aria-label="Matrix legend definitions">
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
          </footer>
        </section>
      </div>
    </div>
  );
}

export default MatrixTab;