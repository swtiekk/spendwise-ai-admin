export const adminAccount = {
  email: "admin@amdin.com",
  password: "admin123",
  role: "System Administrator"
};

export const dashboardMetrics = [
  { id: 1, label: "Total Users", value: 120 },
  { id: 2, label: "High Risk Users", value: 35 },
  { id: 3, label: "Low Risk Users", value: 60 },
  { id: 4, label: "Model Accuracy", value: "89%" }
];

export const alerts = [
  { id: 1, message: "High spending trend detected." },
  { id: 2, message: "Model retraining recommended." }
];

export const users = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@email.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    email: "pedro@email.com",
    status: "Active",
  },
];



// ── Dashboard Metrics ──
export const mockMetrics = [
  { id: 1, label: "Total Users",       value: "1,284", change: "12%", trend: "up",   icon: "users",    fill: "72%", color: "#2DD4BF" },
  { id: 2, label: "Active This Month", value: "847",   change: "8%",  trend: "up",   icon: "activity", fill: "66%", color: "#6366F1" },
  { id: 3, label: "Avg. Spend / User", value: "₱3,420",change: "3%",  trend: "down", icon: "spend",    fill: "45%", color: "#F59E0B" },
  { id: 4, label: "AI Alerts Sent",    value: "326",   change: "21%", trend: "up",   icon: "brain",    fill: "88%", color: "#1A2B47" },
];

// ── Spending Chart ──
export const mockSpendingData = [
  { month: "Sep", amount: 42000 },
  { month: "Oct", amount: 58000 },
  { month: "Nov", amount: 51000 },
  { month: "Dec", amount: 76000 },
  { month: "Jan", amount: 63000 },
  { month: "Feb", amount: 71000 },
];

// ── Donut Chart ──
export const mockCategoryData = [
  { label: "Food & Dining",     value: 24500, color: "#2DD4BF" },
  { label: "Transportation",    value: 14000, color: "#6366F1" },
  { label: "Entertainment",     value: 12600, color: "#F59E0B" },
  { label: "Shopping",          value: 10500, color: "#1A2B47" },
  { label: "Bills & Utilities", value:  8400, color: "#94a3b8" },
];

// ── Alerts ──
export const mockAlerts = [
  { id: 1, user: "Maria Santos",   message: "Budget limit reached — Food & Dining exceeded by ₱420",             type: "warning",  icon: "⚠️", time: "2m ago"  },
  { id: 2, user: "Juan dela Cruz", message: "Unusual spending pattern detected — 3 large transactions today",    type: "critical", icon: "🚨", time: "15m ago" },
  { id: 3, user: "Andrea Reyes",   message: "Spending on track — projected to save ₱1,200 this cycle",          type: "success",  icon: "✅", time: "1h ago"  },
  { id: 4, user: "Carlo Mendoza",  message: "80% of monthly allowance used with 12 days remaining",             type: "warning",  icon: "⚠️", time: "2h ago"  },
  { id: 5, user: "Sofia Lim",      message: "New income recorded — ₱15,000 freelance payment logged",           type: "info",     icon: "💡", time: "3h ago"  },
];

// ── Users ──
export const mockUsers = [
  {
    id: 1, name: "Maria Santos",   email: "maria@email.com",   status: "active",
    income: "₱18,000", joined: "Jan 2025", spent: "₱12,400", transactions: 20,  savings: "₱5,600",
    age: 24, incomeType: "Salary", alerts: 1, avatar: "MS",
    spendingScore: 72, bio: "Consistent saver. Mostly spends on food and transportation.",
  },
  {
    id: 2, name: "Juan dela Cruz", email: "juan@email.com",    status: "flagged",
    income: "₱12,500", joined: "Feb 2025", spent: "₱14,200", transactions: 25, savings: "-₱1,700",
    age: 21, incomeType: "Allowance", alerts: 4, avatar: "JD",
    spendingScore: 31, bio: "Overspending detected. Multiple large transactions flagged.",
  },
  {
    id: 3, name: "Andrea Reyes",   email: "andrea@email.com",  status: "active",
    income: "₱22,000", joined: "Nov 2024", spent: "₱15,800", transactions: 18, savings: "₱6,200",
    age: 28, incomeType: "Freelance", alerts: 0, avatar: "AR",
    spendingScore: 88, bio: "Excellent financial behavior. Top saver this month.",
  },
  {
    id: 4, name: "Carlo Mendoza",  email: "carlo@email.com",   status: "warning",
    income: "₱9,800",  joined: "Dec 2024", spent: "₱8,100", transactions: 20,  savings: "₱1,700",
    age: 19, incomeType: "Allowance", alerts: 2, avatar: "CM",
    spendingScore: 55, bio: "Approaching budget limit. AI advisory sent.",
  },
  {
    id: 5, name: "Sofia Lim",      email: "sofia@email.com",   status: "active",
    income: "₱31,000", joined: "Oct 2024", spent: "₱18,500", transactions: 22, savings: "₱12,500",
    age: 32, incomeType: "Salary", alerts: 0, avatar: "SL",
    spendingScore: 94, bio: "Highest income user. Consistently under budget.",
  },
  {
    id: 6, name: "Ryan Aquino",    email: "ryan@email.com",    status: "flagged",
    income: "₱10,000", joined: "Mar 2025", spent: "₱11,800", transactions: 15, savings: "-₱1,800",
    age: 20, incomeType: "Allowance", alerts: 5, avatar: "RA",
    spendingScore: 22, bio: "Critical overspending. Budget exceeded for 2nd month.",
  },
  {
    id: 7, name: "Pia Villanueva", email: "pia@email.com",     status: "active",
    income: "₱25,000", joined: "Sep 2024", spent: "₱19,200", transactions: 20, savings: "₱5,800",
    age: 26, incomeType: "Salary", alerts: 1, avatar: "PV",
    spendingScore: 79, bio: "Good financial habits. Minor entertainment overspend.",
  },
];

// ── ML Insights ──
export const mockMLMetrics = [
  { label: "Model Accuracy",       value: "94.2%", sub: "Random Forest Classifier",  color: "#2DD4BF", trend: "+1.3%" },
  { label: "Predictions Today",    value: "1,847", sub: "Spending decisions analyzed",color: "#6366F1", trend: "+214"  },
  { label: "Avg. Confidence",      value: "87.6%", sub: "Per recommendation",         color: "#F59E0B", trend: "+0.8%" },
  { label: "Users Benefited",      value: "934",   sub: "Acted on AI advice",         color: "#1A2B47", trend: "+67"   },
];

export const mockBehaviorPatterns = [
  { pattern: "Impulse Buying",       affected: 38, risk: "high",   description: "Frequent small transactions late at night" },
  { pattern: "Income Spike Spending",affected: 24, risk: "medium", description: "Spending surge within 3 days of income" },
  { pattern: "Subscription Creep",   affected: 19, risk: "low",    description: "Recurring charges growing month over month" },
  { pattern: "End-of-Cycle Crunch",  affected: 41, risk: "high",   description: "80%+ budget used with 10+ days remaining" },
  { pattern: "Category Overfocus",   affected: 16, risk: "medium", description: "Single category exceeds 50% of total spend" },
];

export const mockPredictionData = [
  { month: "Sep", actual: 42000, predicted: 44000 },
  { month: "Oct", actual: 58000, predicted: 55000 },
  { month: "Nov", actual: 51000, predicted: 52000 },
  { month: "Dec", actual: 76000, predicted: 71000 },
  { month: "Jan", actual: 63000, predicted: 65000 },
  { month: "Feb", actual: 71000, predicted: 69000 },
  { month: "Mar", actual: null,  predicted: 74000 },
];

export const mockTopFlagged = [
  { name: "Ryan Aquino",    risk: 94, reason: "Exceeded budget 2 months in a row",     avatar: "RA" },
  { name: "Juan dela Cruz", risk: 81, reason: "3 large unplanned transactions detected", avatar: "JD" },
  { name: "Carlo Mendoza",  risk: 62, reason: "80% budget used, 12 days remaining",     avatar: "CM" },
];

// ── Reports ──
export const mockMonthlySummary = [
  { month: "Sep 2025", users: 1180, totalSpend: "₱4,956,000", avgSpend: "₱4,200", alerts: 198, savings: "₱1,240,000", topCategory: "Food & Dining" },
  { month: "Oct 2025", users: 1205, totalSpend: "₱6,993,000", avgSpend: "₱5,804", alerts: 241, savings: "₱980,000",  topCategory: "Shopping"      },
  { month: "Nov 2025", users: 1218, totalSpend: "₱6,211,800", avgSpend: "₱5,100", alerts: 219, savings: "₱1,100,000",topCategory: "Food & Dining" },
  { month: "Dec 2025", users: 1240, totalSpend: "₱9,424,000", avgSpend: "₱7,600", alerts: 312, savings: "₱620,000",  topCategory: "Shopping"      },
  { month: "Jan 2026", users: 1261, totalSpend: "₱7,948,000", avgSpend: "₱6,303", alerts: 278, savings: "₱1,380,000",topCategory: "Bills"         },
  { month: "Feb 2026", users: 1284, totalSpend: "₱9,116,400", avgSpend: "₱7,100", alerts: 326, savings: "₱1,560,000",topCategory: "Food & Dining" },
];