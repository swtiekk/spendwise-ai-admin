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
  } = useMLInsights();

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

      <section className="ml-content-area" aria-live="polite">
        {activeTab === "overview" && (
          <OverviewTab 
            mockMLMetrics={mockMLMetrics} 
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
    </AdminLayout>
  );
}

export default MLInsights;