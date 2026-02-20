import { mockSpendingData } from "../../data/mockData";

function SpendingChart() {
  const max = Math.max(...mockSpendingData.map((d) => d.amount));

  return (
    <div className="db-chart-box">
      <div className="db-chart-header">
        <div>
          <h3 className="db-chart-title">Spending Overview</h3>
          <p className="db-chart-sub">Monthly transaction volume</p>
        </div>
        <span className="db-chart-badge">Last 6 months</span>
      </div>

      <div className="db-bar-chart">
        {mockSpendingData.map((d, i) => (
          <div key={d.month} className="db-bar-col" style={{ animationDelay: `${i * 0.07}s` }}>
            <span className="db-bar-value">₱{d.amount.toLocaleString()}</span>
            <div className="db-bar-track">
              <div
                className="db-bar-fill"
                style={{ height: `${(d.amount / max) * 100}%` }}
              />
            </div>
            <span className="db-bar-label">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpendingChart;