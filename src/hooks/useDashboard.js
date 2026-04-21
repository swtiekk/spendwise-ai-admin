import { useState, useEffect } from 'react';
import { BASE_URL, getToken } from '../config';

function useDashboard() {
  const [showCharts, setShowCharts] = useState(true);
  const [dashData,   setDashData]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? 'Failed to load dashboard.');
      }

      const data = await res.json();
      setDashData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err.message);
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
    error,
    refresh: fetchDashboard,
  };
}

export default useDashboard;