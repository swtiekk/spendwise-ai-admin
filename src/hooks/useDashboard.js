import { useState } from "react";

function useDashboard() {
  const [showCharts, setShowCharts] = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    showCharts,
    setShowCharts,
    greeting,
    today,
  };
}

export default useDashboard;
