import { useNavigate } from "react-router-dom";

// Shared hook used by MetricsGrid, AlertsPanel,
// SpendingChart, DonutChart, and Sidebar
function useNavigateTo() {
  const navigate = useNavigate();

  const goTo = (path) => navigate(path);

  return { goTo };
}

export default useNavigateTo;