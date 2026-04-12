import { useState, useEffect } from "react";
import { BASE_URL, getToken } from "../config";

function useDashboard() {
  const [showCharts, setShowCharts] = useState(true);
  const [dashData, setDashData]     = useState(null);
  const [loading, setLoading]       = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/admin/dashboard/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setDashData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    showCharts, setShowCharts,
    greeting,
    today,
    dashData,
    loading,
    refresh: fetchDashboard,
  };
}

export default useDashboard;