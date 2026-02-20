import { mockCategoryData } from "../../data/mockData";

function DonutChart() {
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
    // offset: start position — we rotate the whole SVG instead for simplicity
    const offset = circumference * (1 - cumulative);
    cumulative += fraction;
    return { ...d, dash, gap, offset, fraction };
  });

  // Format total as ₱XXk
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
          {/* Rotate -90deg so segments start from top */}
          <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)", width: "100%", height: "auto" }}>
            {/* Track */}
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

          {/* Center label overlaid with CSS — avoids SVG text rotation headache */}
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
    </div>
  );
}

export default DonutChart;