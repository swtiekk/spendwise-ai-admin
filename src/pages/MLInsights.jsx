import AdminLayout from "../components/layout/AdminLayout";
import "../styles/mlinsights.css";
import OverviewTab from "../components/mlinsights/OverviewTab";
import ClustersTab from "../components/mlinsights/ClustersTab";
import PatternsTab from "../components/mlinsights/PatternsTab";
import MatrixTab from "../components/mlinsights/MatrixTab";
import BudgetTab from "../components/mlinsights/BudgetTab";
import { useMLInsights, CONFUSION_MATRIX } from "../hooks/usemlinsight";

function MLInsights() {
  const {
    activeTab,
    setActiveTab,
    cmAccuracy,
    tabs,
    mockMLMetrics,
    mockPredictionData,
    mockTopFlagged,
    mockCategoryData,
    mockBehaviorPatterns,
    loading,
    error,
  } = useMLInsights();

  // Transform API object into card array for OverviewTab
  const mlMetricCards = mockMLMetrics ? [
    {
      label: "Total Users",
      value: mockMLMetrics.totalUsers?.toLocaleString() ?? "0",
      trend: "active",
      sub: "Registered users",
      color: "#2DD4BF",
    },
    {
      label: "Total Expenses",
      value: `₱${(mockMLMetrics.totalExpenses ?? 0).toLocaleString()}`,
      trend: "tracked",
      sub: "All-time spending",
      color: "#6366F1",
    },
    {
      label: "Avg Income",
      value: `₱${(mockMLMetrics.avgIncome ?? 0).toLocaleString()}`,
      trend: "monthly",
      sub: "Per user average",
      color: "#F59E0B",
    },
    {
      label: "Flagged Users",
      value: mockMLMetrics.flaggedUsers?.toLocaleString() ?? "0",
      trend: "at-risk",
      sub: "Spent over 50% income",
      color: "#ef4444",
    },
  ] : [];

  return (
    <AdminLayout>
      <header className="ml-header">
        <hgroup>
          <p className="ml-header-sub">AI-Powered Analytics</p>
          <h1 className="ml-header-title">ML Insights</h1>
        </hgroup>
        <div className="ml-header-right">
          <div className="ml-model-tag" role="status">
            <span className="ml-model-dot" aria-hidden="true" />
            Model Active · Random Forest v2.1
          </div>
          <data value={cmAccuracy} className="ml-accuracy-badge">
            🎯 {cmAccuracy}% Accuracy
          </data>
        </div>
      </header>

      <nav className="ml-tabs" aria-label="Insights categories">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`ml-tab ${activeTab === tab.key ? "ml-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {loading && (
        <div className="ml-content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading ML data...</p>
        </div>
      )}

      {error && (
        <div className="ml-content-area" style={{ padding: '2rem', color: '#ef4444', fontSize: '0.85rem' }}>
          Failed to load data: {error}
        </div>
      )}

      {!loading && !error && (
        <section className="ml-content-area" aria-live="polite">
          {activeTab === "overview" && (
            <OverviewTab
              mockMLMetrics={mlMetricCards}
              mockPredictionData={mockPredictionData}
              mockTopFlagged={mockTopFlagged}
            />
          )}

          {activeTab === "clusters" && (
            <ClustersTab
              mockCategoryData={mockCategoryData}
            />
          )}

          {activeTab === "patterns" && (
            <PatternsTab
              mockBehaviorPatterns={mockBehaviorPatterns}
            />
          )}

          {activeTab === "matrix" && (
            <MatrixTab
              confusionMatrix={CONFUSION_MATRIX}
            />
          )}

          {activeTab === "planner" && (
            <BudgetTab />
          )}
        </section>
      )}
    </AdminLayout>
  );
}

export default MLInsights;