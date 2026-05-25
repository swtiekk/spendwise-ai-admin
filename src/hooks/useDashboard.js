import { useState, useEffect } from 'react';
import { BASE_URL, getToken } from '../config';

function useDashboard() {
  const [showCharts, setShowCharts] = useState(true);
  const [dashData,   setDashData]   = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [predictionData, setPredictionData] = useState([]); // ← New state
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const headers = { Authorization: `Bearer ${getToken()}` };

      const [dashRes, mlRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/dashboard`, { headers }),
        fetch(`${BASE_URL}/admin/ml-insights`, { headers }),
      ]);

      if (!dashRes.ok) {
        const err = await dashRes.json().catch(() => ({}));
        throw new Error(err.detail ?? 'Failed to load dashboard.');
      }

      const data = await dashRes.json();
      setDashData(data);

      // Extract data from ML insights
      if (mlRes.ok) {
        const ml = await mlRes.json();
        setCategoryData(ml.category_data ?? []);
        setPredictionData(ml.prediction_data ?? []);   // ← Added
      } else {
        setCategoryData([]);
        setPredictionData([]);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    showCharts,
    setShowCharts,
    greeting,
    today,
    dashData,
    categoryData,
    predictionData,       // ← Added for SpendingChart
    loading,
    error,
    refresh: fetchDashboard,
  };
}

export default useDashboard;