import { useState, useMemo, useCallback, useEffect } from 'react';
import { BASE_URL, getToken } from '../config';

// ── Constants (static ML evaluation data) ─────────────────────────────────────

export const CONFUSION_MATRIX = {
  labels: ['Will Overspend', "Won't Overspend"],
  matrix: [
    [142, 18],
    [11, 329],
  ],
};

export const RISK_CONFIG = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'High'   },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Medium' },
  low:    { color: '#2DD4BF', bg: 'rgba(45,212,191,0.1)',  label: 'Low'    },
};

export const ITEM_POOL = [
  { name: 'Starbucks Latte',      category: 'Dining',        icon: '☕' },
  { name: 'Netflix Subscription', category: 'Sub',           icon: '🎬' },
  { name: 'Shell Gasoline',       category: 'Transport',     icon: '⛽' },
  { name: 'Jollibee Meal',        category: 'Dining',        icon: '🍗' },
  { name: 'Shopee Item',          category: 'Shopping',      icon: '📦' },
  { name: 'Internet Bill',        category: 'Bills',         icon: '🌐' },
  { name: 'Uniqlo Wear',          category: 'Shopping',      icon: '👕' },
  { name: 'GrabFood',             category: 'Dining',        icon: '🛵' },
  { name: '7-Eleven Snack',       category: 'Dining',        icon: '🏪' },
  { name: 'Lazada Delivery',      category: 'Shopping',      icon: '🚚' },
  { name: 'Spotify Premium',      category: 'Sub',           icon: '🎵' },
  { name: 'Cinema Ticket',        category: 'Entertainment', icon: '🎟️' },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useMLInsights = () => {

  // ── API state ──────────────────────────────────────────────────────────────
  const [mlData,      setMlData]      = useState(null);
  const [usersData,   setUsersData]   = useState([]);
  const [dashData,    setDashData]    = useState(null);
  const [clusterData, setClusterData] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };

        const [mlRes, usersRes, dashRes, clustersRes] = await Promise.all([
          fetch(`${BASE_URL}/admin/ml-insights`,  { headers }),
          fetch(`${BASE_URL}/admin/users-detail`, { headers }),
          fetch(`${BASE_URL}/admin/dashboard`,    { headers }),
          fetch(`${BASE_URL}/admin/clusters`,     { headers }),
        ]);

        if (!mlRes.ok)       throw new Error('Failed to load ML insights');
        if (!usersRes.ok)    throw new Error('Failed to load users');
        if (!dashRes.ok)     throw new Error('Failed to load dashboard');
        if (!clustersRes.ok) throw new Error('Failed to load clusters');

        const [ml, users, dash, clusters] = await Promise.all([
          mlRes.json(),
          usersRes.json(),
          dashRes.json(),
          clustersRes.json(),
        ]);

        setMlData(ml);
        setUsersData(users);
        setDashData(dash);
        setClusterData(clusters);
      } catch (err) {
        console.error('[useMLInsights] fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived data from API ──────────────────────────────────────────────────
  const mockMLMetrics = useMemo(() => {
    if (!mlData) return null;
    return {
      totalUsers:    mlData.total_users,
      totalExpenses: mlData.total_expenses,
      avgIncome:     mlData.avg_income,
      flaggedUsers:  mlData.flagged_users,
    };
  }, [mlData]);

  const mockPredictionData = useMemo(() =>
    mlData?.prediction_data ?? [], [mlData]);

  const mockTopFlagged = useMemo(() =>
    mlData?.top_flagged ?? [], [mlData]);

  const mockCategoryData = useMemo(() =>
    mlData?.category_data ?? [], [mlData]);

  const mockUsers = useMemo(() =>
    usersData, [usersData]);

  const mockBehaviorPatterns = useMemo(() => {
    if (!mlData) return [];
    return (mlData.category_data ?? []).slice(0, 6).map((cat) => ({
      pattern:   cat.label,
      users:     cat.count,
      avgAmount: cat.count > 0 ? Math.round(cat.total / cat.count) : 0,
      trend:     cat.total > mlData.avg_income ? 'up' : 'stable',
      risk:      cat.total > mlData.avg_income * mlData.total_users
                   ? 'high'
                   : cat.total > (mlData.avg_income * mlData.total_users * 0.5)
                   ? 'medium'
                   : 'low',
    }));
  }, [mlData]);

  // ── Page state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');

  const cmAccuracy = useMemo(() => {
    const total = CONFUSION_MATRIX.matrix.flat().reduce((a, b) => a + b, 0);
    return ((CONFUSION_MATRIX.matrix[0][0] + CONFUSION_MATRIX.matrix[1][1]) / total * 100).toFixed(1);
  }, []);

  const tabs = useMemo(() => [
    { key: 'overview', label: 'Overview',             icon: '⊞' },
    { key: 'clusters', label: 'Cluster Distribution', icon: '◉' },
    { key: 'patterns', label: 'Behavior Patterns',    icon: '📊' },
    { key: 'matrix',   label: 'Confusion Matrix',     icon: '🔢' },
    { key: 'planner',  label: 'Budget Review',        icon: '🛍️' },
  ], []);

  // ── Overview tab ───────────────────────────────────────────────────────────
  const [selectedBar, setSelectedBar] = useState(null);
  const [hoveredBar,  setHoveredBar]  = useState(null);

  const maxPredicted = useMemo(() =>
    mockPredictionData.length > 0
      ? Math.max(...mockPredictionData.map(d => Math.max(d.actual || 0, d.predicted)))
      : 0,
  [mockPredictionData]);

  // ── Clusters tab ───────────────────────────────────────────────────────────
  const [selectedCluster, setSelectedCluster] = useState(null);

  const { maxCluster, totalClusters } = useMemo(() => ({
    maxCluster:    clusterData.length > 0 ? Math.max(...clusterData.map(d => d.value)) : 1,
    totalClusters: clusterData.reduce((s, d) => s + d.value, 0),
  }), [clusterData]);

  const handleClusterToggle = useCallback((cluster) => {
    setSelectedCluster(prev => prev?.label === cluster.label ? null : cluster);
  }, []);

  // ── Patterns tab ───────────────────────────────────────────────────────────
  const [riskFilter,      setRiskFilter]      = useState('all');
  const [selectedPattern, setSelectedPattern] = useState(null);

  const filteredPatterns = useMemo(() =>
    riskFilter === 'all'
      ? mockBehaviorPatterns
      : mockBehaviorPatterns.filter(p => p.risk === riskFilter),
  [riskFilter, mockBehaviorPatterns]);

  const handlePatternToggle = useCallback((pattern) => {
    setSelectedPattern(prev => prev?.pattern === pattern.pattern ? null : pattern);
  }, []);

  // ── Matrix tab ─────────────────────────────────────────────────────────────
  const { cmTotal } = useMemo(() => {
    const total = CONFUSION_MATRIX.matrix.flat().reduce((a, b) => a + b, 0);
    return { cmTotal: total };
  }, []);

  const performanceMetrics = useMemo(() => [
    { label: 'Accuracy',  value: `${cmAccuracy}%`, color: '#2DD4BF', desc: 'Overall correct predictions',                 formula: '(TP+TN) / Total' },
    { label: 'Precision', value: '92.8%',           color: '#6366F1', desc: 'Of predicted overspend, how many were right', formula: 'TP / (TP+FP)'    },
    { label: 'Recall',    value: '88.7%',           color: '#F59E0B', desc: 'Of actual overspend, how many were caught',   formula: 'TP / (TP+FN)'    },
    { label: 'F1 Score',  value: '90.7%',           color: '#1A2B47', desc: 'Balance between precision and recall',        formula: '2×(P×R)/(P+R)'   },
  ], [cmAccuracy]);

  // ── Budget tab ─────────────────────────────────────────────────────────────
  const [selectedUser,  setSelectedUser]  = useState(null);
  const [expandedDays,  setExpandedDays]  = useState({});

  const toggleDayExpansion = useCallback((day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  }, []);

  const parseCurrency = useCallback((str) => {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    return Number(str.replace(/[^0-9.-]+/g, ''));
  }, []);

  const formatCurrency = useCallback((val) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val),
  []);

  const dailyLog = useMemo(() => {
    if (!selectedUser) return [];

    const monthlyBudget        = parseCurrency(selectedUser.income);
    const totalActualSpent     = parseCurrency(selectedUser.spent);
    const transactionDaysCount = Math.min(selectedUser.transactions || 20, 30);

    const dayIndices              = Array.from({ length: 30 }, (_, i) => i);
    const dailyActualSpentAmounts = new Array(30).fill(0);

    for (let i = dayIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dayIndices[i], dayIndices[j]] = [dayIndices[j], dayIndices[i]];
    }

    let remainingToDistribute = totalActualSpent;
    const activeDayIndices    = dayIndices.slice(0, transactionDaysCount);
    activeDayIndices.sort((a, b) => a - b);
    const avgDailySpend = totalActualSpent / transactionDaysCount;

    activeDayIndices.forEach((idx, i) => {
      if (i === activeDayIndices.length - 1) {
        dailyActualSpentAmounts[idx] = remainingToDistribute;
      } else {
        const amount      = Math.round(avgDailySpend * (0.6 + Math.random() * 0.8));
        const finalAmount = Math.min(amount, remainingToDistribute);
        dailyActualSpentAmounts[idx] = finalAmount;
        remainingToDistribute -= finalAmount;
      }
    });

    let runningSpent = 0;

    return Array.from({ length: 30 }, (_, i) => {
      const day         = i + 1;
      const targetSpend = dailyActualSpentAmounts[i];
      const transactions = [];
      let   dayActualTotal = 0;

      if (targetSpend > 0) {
        const itemCount = Math.floor(Math.random() * 2) + 1;
        let   remainingInDay = targetSpend;

        for (let j = 0; j < itemCount; j++) {
          const itemTemplate   = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
          const price          = (j === itemCount - 1) ? remainingInDay : Math.round((targetSpend / itemCount) * (0.8 + Math.random() * 0.4));
          remainingInDay      -= price;

          const isInsufficient = (runningSpent + price) > monthlyBudget;
          let verdict  = 'YES';
          let followed = true;

          if (isInsufficient) {
            verdict  = 'NO';
            followed = false;
          } else {
            const isNo = Math.random() > (selectedUser.spendingScore / 100) + 0.2;
            verdict  = isNo ? 'NO' : 'YES';
            followed = !isNo;
          }

          transactions.push({ id: `day${day}-spend-${j}`, ...itemTemplate, price, verdict, followed, isSaving: false });
          runningSpent   += price;
          dayActualTotal += price;
        }
      }

      const savingsCount = Math.floor(Math.random() * 2);
      for (let s = 0; s < savingsCount; s++) {
        const itemTemplate   = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
        const price          = Math.round(avgDailySpend * (0.3 + Math.random() * 0.7));
        const isInsufficient = (runningSpent + price) > monthlyBudget;
        const verdict        = isInsufficient ? 'NO' : (Math.random() > 0.5 ? 'NO' : 'YES');
        if (verdict === 'NO') {
          transactions.push({ id: `day${day}-save-${s}`, ...itemTemplate, price, verdict: 'NO', followed: true, isSaving: true });
        }
      }

      transactions.sort(() => Math.random() - 0.5);

      return {
        day,
        hasActivity:     transactions.length > 0,
        transactions,
        dayTotal:        dayActualTotal,
        remainingBudget: monthlyBudget - runningSpent,
      };
    });
  }, [selectedUser, parseCurrency]);

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    loading,
    error,
    dashData,
    mockMLMetrics,
    mockBehaviorPatterns,
    mockPredictionData,
    mockTopFlagged,
    mockCategoryData,
    mockUsers,
    clusterData,
    activeTab, setActiveTab,
    cmAccuracy,
    tabs,
    selectedBar, setSelectedBar,
    hoveredBar,  setHoveredBar,
    maxPredicted,
    selectedCluster, setSelectedCluster,
    maxCluster, totalClusters,
    handleClusterToggle,
    riskFilter,      setRiskFilter,
    selectedPattern, setSelectedPattern,
    filteredPatterns,
    handlePatternToggle,
    cmTotal,
    performanceMetrics,
    selectedUser, setSelectedUser,
    expandedDays,
    toggleDayExpansion,
    parseCurrency,
    formatCurrency,
    dailyLog,
  };
};

export default useMLInsights;