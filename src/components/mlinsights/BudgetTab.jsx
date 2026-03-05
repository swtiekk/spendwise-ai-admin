import React, { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';

/**
 * DayCard Component (Local)
 * Handles individual card expansion and item visibility.
 */
const DayCard = ({ log, formatCurrency }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? log.transactions : log.transactions.slice(0, 2);
  const hasMore = log.transactions.length > 2;

  return (
    <div className={`pt-daily-card ${!log.hasActivity ? 'pt-daily-card--inactive' : ''}`} 
         style={{ opacity: log.hasActivity ? 1 : 0.7, display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="pt-day-badge" style={{ position: 'static' }}>DAY {log.day}</span>
        {log.hasActivity && (
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--sw-indigo)', textTransform: 'uppercase' }}>
            {log.transactions.length} Items
          </span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        {!log.hasActivity ? (
          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e2e8f0', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic' }}>Zero Activity</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {visibleItems.map((tx) => (
                <div key={tx.id} style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minWidth: 0 }}>
                      <span style={{ fontSize: '1rem' }}>{tx.icon}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--sw-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--sw-indigo)', flexShrink: 0 }}>
                      {formatCurrency(tx.price)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={`pt-verdict-tag pt-verdict-tag--${tx.verdict.toLowerCase()}`} style={{ fontSize: '0.5rem', padding: '1px 4px' }}>
                      AI: {tx.verdict}
                    </div>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: tx.followed ? '#0d9488' : '#ef4444' }}>
                      {tx.followed ? 'FOLLOWED' : 'IGNORED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: '1px dashed #cbd5e1', 
                  borderRadius: '6px', 
                  fontSize: '0.6rem', 
                  padding: '4px', 
                  color: '#64748b', 
                  cursor: 'pointer',
                  marginBottom: '16px',
                  fontWeight: 700,
                  transition: 'all 0.2s'
                }}
              >
                {isExpanded ? 'SHOW LESS' : `SHOW MORE (+${log.transactions.length - 2})`}
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>DAILY TOTAL</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sw-navy)' }}>{formatCurrency(log.dayTotal)}</span>
        </div>
        <div className="pt-daily-balance" style={{ 
          background: log.remainingBudget < 0 ? '#ef4444' : 'var(--sw-navy)',
          padding: '6px 10px',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '0.6rem' }}>BALANCE</span>
          <strong style={{ fontSize: '0.75rem' }}>{formatCurrency(log.remainingBudget)}</strong>
        </div>
      </div>
    </div>
  );
};

/**
 * BudgetTab Component (Admin View)
 */
const BudgetTab = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Precision Currency Parser
  const parseCurrency = (str) => {
    if (!str) return 0;
    return Number(str.replace(/[^0-9.-]+/g, ""));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(val);

  /**
   * Generates a 30-day log with multiple items per day.
   */
  const dailyLog = useMemo(() => {
    if (!selectedUser) return [];
    
    const monthlyBudget = parseCurrency(selectedUser.income);
    const totalActualSpent = parseCurrency(selectedUser.spent);
    const dailyEssentialBuffer = (monthlyBudget * 0.4) / 30;
    
    const transactionDaysCount = Math.min(selectedUser.transactions || 20, 30);
    const dailySpendAmounts = new Array(30).fill(0);
    const dayIndices = Array.from({ length: 30 }, (_, i) => i);
    
    // Shuffle indices for distribution
    for (let i = dayIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dayIndices[i], dayIndices[j]] = [dayIndices[j], dayIndices[i]];
    }
    
    let remainingToDistribute = totalActualSpent;
    const activeDayIndices = dayIndices.slice(0, transactionDaysCount);
    const avgDailySpend = totalActualSpent / transactionDaysCount;

    activeDayIndices.forEach((idx, i) => {
      if (i === activeDayIndices.length - 1) {
        dailySpendAmounts[idx] = remainingToDistribute;
      } else {
        const amount = Math.round(avgDailySpend * (0.6 + Math.random() * 0.8));
        const finalAmount = Math.min(amount, remainingToDistribute);
        dailySpendAmounts[idx] = finalAmount;
        remainingToDistribute -= finalAmount;
      }
    });

    const itemPool = [
      { name: "Starbucks Latte", category: "Dining", icon: "☕" },
      { name: "Netflix Subscription", category: "Sub", icon: "🎬" },
      { name: "Shell Gasoline", category: "Transport", icon: "⛽" },
      { name: "Jollibee Meal", category: "Dining", icon: "🍗" },
      { name: "Shopee Item", category: "Shopping", icon: "📦" },
      { name: "Internet Bill", category: "Bills", icon: "🌐" },
      { name: "Uniqlo Wear", category: "Shopping", icon: "👕" },
      { name: "GrabFood", category: "Dining", icon: "🛵" },
      { name: "7-Eleven Snack", category: "Dining", icon: "🏪" },
      { name: "Lazada Delivery", category: "Shopping", icon: "🚚" }
    ];

    let runningSpent = 0;

    return dailySpendAmounts.map((dayTotalSpend, i) => {
      const day = i + 1;
      const daysRemaining = 30 - day + 1;
      const hasActivity = dayTotalSpend > 0;
      const transactions = [];
      
      if (hasActivity) {
        const itemCount = Math.floor(Math.random() * 3) + 2; 
        let dayRemainingToDistribute = dayTotalSpend;
        
        for (let j = 0; j < itemCount; j++) {
          const itemTemplate = itemPool[Math.floor(Math.random() * itemPool.length)];
          let itemPrice = 0;
          
          if (j === itemCount - 1) {
            itemPrice = dayRemainingToDistribute;
          } else {
            itemPrice = Math.round((dayTotalSpend / itemCount) * (0.5 + Math.random()));
            itemPrice = Math.min(itemPrice, dayRemainingToDistribute);
          }
          
          dayRemainingToDistribute -= itemPrice;
          
          if (itemPrice > 0) {
            const reservedEssentials = daysRemaining * dailyEssentialBuffer;
            const discretionaryBalance = (monthlyBudget - (runningSpent + (dayTotalSpend - dayRemainingToDistribute))) - reservedEssentials;
            const verdict = itemPrice < (discretionaryBalance * 0.2) ? "YES" : "NO";
            
            let followed = verdict === "YES";
            if (verdict === "NO" && selectedUser.spendingScore > 70) {
              followed = Math.random() > 0.4;
            } else if (verdict === "NO") {
              followed = Math.random() > 0.7;
            }

            transactions.push({
              id: `day${day}-item${j}`,
              name: itemTemplate.name,
              category: itemTemplate.category,
              icon: itemTemplate.icon,
              price: itemPrice,
              verdict,
              followed
            });
          }
        }
        runningSpent += dayTotalSpend;
      }

      return {
        day,
        hasActivity,
        transactions,
        dayTotal: dayTotalSpend,
        remainingBudget: monthlyBudget - runningSpent
      };
    });
  }, [selectedUser]);

  if (selectedUser) {
    const income = parseCurrency(selectedUser.income);
    const recordedSpent = parseCurrency(selectedUser.spent);

    return (
      <div className="pt-detail-view">
        <div className="pt-detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button className="pt-back-btn" onClick={() => setSelectedUser(null)}>
              ← Back to Monitor
            </button>
            <div>
              <h3 className="ml-chart-title" style={{ margin: 0 }}>Reviewing ID: {selectedUser.id}</h3>
              <p className="ml-chart-sub" style={{ margin: 0 }}>
                Budget: {formatCurrency(income)} | Total Outcome: {formatCurrency(income - recordedSpent)}
              </p>
            </div>
          </div>
          <div className="pt-user-avatar" style={{ background: 'var(--sw-navy)', borderRadius: '8px', width: '40px', height: '40px' }}>
            {selectedUser.id}
          </div>
        </div>

        <div className="pt-daily-grid">
          {dailyLog.map((log) => (
            <DayCard key={log.day} log={log} formatCurrency={formatCurrency} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="budget-tab-container">
      {/* Summary Section */}
      <div className="pt-summary-cards">
        <div className="pt-summary-card">
          <p className="ml-metric-label">Actual Total Budget</p>
          <p className="ml-metric-value" style={{ color: '#2dd4bf' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + parseCurrency(u.income), 0))}
          </p>
        </div>
        <div className="pt-summary-card">
          <p className="ml-metric-label">Actual Total Spent</p>
          <p className="ml-metric-value" style={{ color: '#ef4444' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + parseCurrency(u.spent), 0))}
          </p>
        </div>
        <div className="pt-summary-card">
          <p className="ml-metric-label">Verified Savings</p>
          <p className="ml-metric-value" style={{ color: 'var(--sw-indigo)' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + (parseCurrency(u.income) - parseCurrency(u.spent)), 0))}
          </p>
        </div>
      </div>

      <div className="ml-chart-box">
        <div className="pt-user-list-header">
          <div>USER</div>
          <div>HEALTH</div>
          <div>ACTUAL VS PREDICTION</div>
          <div>RISK STATUS</div>
          <div style={{ textAlign: 'center' }}>ACTIONS</div>
        </div>

        <div className="pt-user-list">
          {mockUsers.map((user) => {
            const actual = parseCurrency(user.spent);
            const income = parseCurrency(user.income);
            const predicted = income * 0.90; 
            
            const actualPercent = (actual / income) * 100;
            const predictedPercent = (predicted / income) * 100;
            const isOverBudget = actual > predicted;

            return (
              <div key={user.id} className="pt-user-row">
                <div className="pt-user-info">
                  <div className="u-avatar">
                    {user.avatar}
                  </div>
                  <div className="u-user-details-ml">
                    <span className="u-name">ID: {user.id}</span>
                    <span className="u-email">Anonymized User</span>
                  </div>
                </div>

                <div>
                  <div className="pt-status-badge" style={{ 
                    background: user.spendingScore > 80 ? 'rgba(45,212,191,0.1)' : user.spendingScore > 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    color: user.spendingScore > 80 ? '#0d9488' : user.spendingScore > 50 ? '#d97706' : '#ef4444'
                  }}>
                    {user.spendingScore}%
                  </div>
                </div>

                <div className="pt-comparison-bar-container">
                  <div className="pt-comparison-track">
                    <div className="pt-comparison-fill pt-comparison-fill--predicted" style={{ width: `${Math.min(predictedPercent, 100)}%` }} />
                    <div className={`pt-comparison-fill pt-comparison-fill--actual ${isOverBudget ? 'pt-comparison-fill--over' : ''}`} style={{ width: `${Math.min(actualPercent, 100)}%` }} />
                  </div>
                  <div className="pt-comparison-label-row">
                    <span>Act: {formatCurrency(actual)}</span>
                    <span>Pred: {formatCurrency(predicted)}</span>
                  </div>
                </div>

                <div>
                  <span className={`pt-status-badge pt-status-badge--${user.status}`}>
                    {user.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="pt-action-btn" onClick={() => setSelectedUser(user)}>
                    Review ID: {user.id}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetTab;
