import { useNavigate } from "react-router-dom";
import { mockPredictionData } from "../../data/mockData";

function SpendingChart() {
  const navigate = useNavigate();

  const width  = 500;
  const height = 160;
  const padL   = 10;
  const padR   = 10;
  const padT   = 16;
  const padB   = 24;

  const actualData    = mockPredictionData.filter((d) => d.actual);
  const predictedData = mockPredictionData;

  const allValues = mockPredictionData.flatMap((d) => [d.actual || 0, d.predicted]);
  const minVal = Math.min(...allValues.filter(Boolean)) * 0.88;
  const maxVal = Math.max(...allValues) * 1.06;

  const xStep = (width - padL - padR) / (mockPredictionData.length - 1);

  const toX = (i) => padL + i * xStep;
  const toY = (v) => padT + (1 - (v - minVal) / (maxVal - minVal)) * (height - padT - padB);

  // Build smooth cubic bezier path from points
  const buildPath = (points) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX  = (prev.x + curr.x) / 2;
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  // Build closed fill path (path + baseline)
  const buildFill = (points) => {
    if (points.length < 2) return "";
    const linePath = buildPath(points);
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const baseline = height - padB;
    return `${linePath} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
  };

  const actualPoints = actualData.map((d, i) => ({
    x: toX(mockPredictionData.indexOf(d)),
    y: toY(d.actual),
    data: d,
  }));

  const predictedPoints = mockPredictionData.map((d, i) => ({
    x: toX(i),
    y: toY(d.predicted),
    data: d,
  }));

  return (
    <div className="db-chart-box">
      <div className="db-chart-header">
        <div>
          <h3 className="db-chart-title">Spending Overview</h3>
          <p className="db-chart-sub">Actual vs AI-Predicted monthly spend</p>
        </div>
        <div className="db-spending-legend">
          <span className="db-legend-pill db-legend-pill--actual">
            <span className="db-legend-dot" style={{ background: "#2DD4BF" }} />
            Actual
          </span>
          <span className="db-legend-pill db-legend-pill--predicted">
            <span className="db-legend-dot" style={{ background: "#6366F1" }} />
            Predicted
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="db-line-chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="db-line-svg"
        >
          <defs>
            {/* Actual fill gradient */}
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2DD4BF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
            {/* Predicted fill gradient */}
            <linearGradient id="predictedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6366F1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
            {/* Actual line gradient */}
            <linearGradient id="actualLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            {/* Predicted line gradient */}
            <linearGradient id="predictedLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={padL} y1={padT + t * (height - padT - padB)}
              x2={width - padR} y2={padT + t * (height - padT - padB)}
              stroke="#f1f5f9" strokeWidth="1"
            />
          ))}

          {/* Predicted fill */}
          <path
            d={buildFill(predictedPoints)}
            fill="url(#predictedFill)"
          />

          {/* Actual fill */}
          <path
            d={buildFill(actualPoints)}
            fill="url(#actualFill)"
          />

          {/* Predicted line */}
          <path
            d={buildPath(predictedPoints)}
            fill="none"
            stroke="url(#predictedLine)"
            strokeWidth="2"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />

          {/* Actual line */}
          <path
            d={buildPath(actualPoints)}
            fill="none"
            stroke="url(#actualLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Actual dots */}
          {actualPoints.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#fff" stroke="#2DD4BF" strokeWidth="2" />
              <circle cx={pt.x} cy={pt.y} r="2.5" fill="#2DD4BF" />
            </g>
          ))}

          {/* Predicted dots */}
          {predictedPoints.map((pt, i) => (
            <g key={i}>
              {/* Forecast month gets a special marker */}
              {!pt.data.actual ? (
                <>
                  <circle cx={pt.x} cy={pt.y} r="6" fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx={pt.x} cy={pt.y} r="2.5" fill="#6366F1" />
                </>
              ) : (
                <>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#fff" stroke="#6366F1" strokeWidth="1.5" />
                  <circle cx={pt.x} cy={pt.y} r="2" fill="#6366F1" />
                </>
              )}
            </g>
          ))}

          {/* Month labels */}
          {mockPredictionData.map((d, i) => (
            <text
              key={d.month}
              x={toX(i)}
              y={height - 4}
              textAnchor="middle"
              fontSize="9"
              fontFamily="Sora, sans-serif"
              fontWeight="600"
              fill={!d.actual ? "#6366F1" : "#94a3b8"}
            >
              {d.month}
            </text>
          ))}

          {/* Forecast label */}
          {(() => {
            const forecastPt = predictedPoints[predictedPoints.length - 1];
            return (
              <text
                x={forecastPt.x}
                y={forecastPt.y - 12}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="Sora, sans-serif"
                fontWeight="700"
                fill="#6366F1"
              >
                forecast
              </text>
            );
          })()}
        </svg>
      </div>

      {/* Summary row */}
      <div className="db-chart-summary">
        <div className="db-chart-summary-item">
          <span className="db-chart-summary-dot" style={{ background: "#2DD4BF" }} />
          <span className="db-chart-summary-label">Avg Actual</span>
          <span className="db-chart-summary-val">₱60,167</span>
        </div>
        <div className="db-chart-summary-divider" />
        <div className="db-chart-summary-item">
          <span className="db-chart-summary-dot" style={{ background: "#6366F1" }} />
          <span className="db-chart-summary-label">Avg Predicted</span>
          <span className="db-chart-summary-val">₱59,333</span>
        </div>
        <div className="db-chart-summary-divider" />
        <div className="db-chart-summary-item">
          <span className="db-chart-summary-dot" style={{ background: "#F59E0B" }} />
          <span className="db-chart-summary-label">Model Accuracy</span>
          <span className="db-chart-summary-val" style={{ color: "#0d9488" }}>94.2%</span>
        </div>
      </div>

      <div className="db-chart-footer">
        <button className="db-viewmore-btn" onClick={() => navigate("/reports")}>
          View Full Report
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SpendingChart;