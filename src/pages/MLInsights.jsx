import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  mockMLMetrics,
  mockBehaviorPatterns,
  mockPredictionData,
  mockTopFlagged,
  mockCategoryData,
} from "../data/mockData";
import "../styles/mlinsights.css";

// Tab Components
import OverviewTab from "../components/mlinsights/OverviewTab";
import ClustersTab from "../components/mlinsights/ClustersTab";
import PatternsTab from "../components/mlinsights/PatternsTab";
import MatrixTab from "../components/mlinsights/MatrixTab";

// ── Confusion Matrix Data (kept here for header badge) ──
const confusionMatrix = {
  labels: ["Will Overspend", "Won't Overspend"],
  matrix: [
    [142, 18],
    [11, 329],
  ],
};

function MLInsights() {
  const [activeTab, setActiveTab] = useState("overview");

  // confusion matrix totals for header
  const cmTotal = confusionMatrix.matrix.flat().reduce((a, b) => a + b, 0);
  const cmAccuracy = ((confusionMatrix.matrix[0][0] + confusionMatrix.matrix[1][1]) / cmTotal * 100).toFixed(1);

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <section className="ml-header">
        <div>
          <p className="ml-header-sub">AI-Powered Analytics</p>
          <h2 className="ml-header-title">ML Insights</h2>
        </div>
        <div className="ml-header-right">
          <div className="ml-model-tag">
            <span className="ml-model-dot" />
            Model Active · Random Forest v2.1
          </div>
          <div className="ml-accuracy-badge">
            🎯 {cmAccuracy}% Accuracy
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="ml-tabs">
        {[
          { key: "overview",  label: "Overview",            icon: "⊞" },
          { key: "clusters",  label: "Cluster Distribution",icon: "◉" },
          { key: "patterns",  label: "Behavior Patterns",   icon: "📊" },
          { key: "matrix",    label: "Confusion Matrix",    icon: "🔢" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`ml-tab ${activeTab === tab.key ? "ml-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB CONTENT ══════════════ */}
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
          confusionMatrix={confusionMatrix} 
        />
      )}

    </AdminLayout>
  );
}

export default MLInsights;