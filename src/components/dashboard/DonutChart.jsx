import { useNavigate } from "react-router-dom";
import { mockCategoryData } from "../../data/mockData";

function DonutChart() {
  const navigate = useNavigate();
  const total = mockCategoryData.reduce((s, d) => s + d.value, 0);

  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = mockCategoryData.map((d) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const offset = circumference * (1 - cumulative);
    cumulative += fraction;
    return { ...d, dash, gap, offset, fraction };
  });

  const totalLabel = total >= 1000
    ? `₱${(total / 1000).toFixed(0)}k`
    : `₱${total}`;

  return (
    <div className="db-chart-box">
      <div className="db-chart-header">
        <div>
          <h3 className="db-chart-title">Category Breakdown</h3>
          <p className="db-chart-sub">Spending by category</p>
        </div>
        <span className="db-chart-badge">This month</span>
      </div>

      <div className="db-donut-layout">
        <div className="db-donut-svg-wrap">
          <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)", width: "100%", height: "auto" }}>
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="22" />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="22"
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="db-donut-center">
            <span className="db-donut-center-value">{totalLabel}</span>
            <span className="db-donut-center-label">total spend</span>
          </div>
        </div>

        <ul className="db-donut-legend">
          {mockCategoryData.map((d) => (
            <li key={d.label} className="db-donut-legend-item">
              <span className="db-donut-dot" style={{ background: d.color }} />
              <span className="db-donut-legend-label">{d.label}</span>
              <span className="db-donut-legend-value">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
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

export default DonutChart;