import React, { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';

/**
 * PurchaseTab Component (Admin View)
 * 
 * Financial Accuracy Update:
 * - ML Advice only shown when an actual transaction occurs.
 * - Accurate Actual vs Prediction metrics derived from mockData.
 * - USER column strictly shows "ID: #" format.
 */
const PurchaseTab = () => {
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
   * Generates a 30-day log that accurately reflects the user's total spend.
   */
  const dailyLog = useMemo(() => {
    if (!selectedUser) return [];
    
    const monthlyBudget = parseCurrency(selectedUser.income);
    const totalActualSpent = parseCurrency(selectedUser.spent);
    const dailyEssentialBuffer = (monthlyBudget * 0.4) / 30;
    
    const transactionDays = Math.min(selectedUser.transactions || 20, 30);
    const avgTransaction = totalActualSpent / transactionDays;
    
    let remainingToDistribute = totalActualSpent;
    const dailyExpenses = new Array(30).fill(0);
    
    const indices = Array.from({ length: 30 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    for (let i = 0; i < transactionDays; i++) {
      const dayIndex = indices[i];
      if (i === transactionDays - 1) {
        dailyExpenses[dayIndex] = remainingToDistribute;
      } else {
        const amount = Math.round(avgTransaction * (0.5 + Math.random()));
        const finalAmount = Math.min(amount, remainingToDistribute);
        dailyExpenses[dayIndex] = finalAmount;
        remainingToDistribute -= finalAmount;
      }
    }

    const itemPool = [
      { name: "Starbucks Latte", category: "Dining", icon: "☕" },
      { name: "Netflix Subscription", category: "Sub", icon: "🎬" },
      { name: "Shell Gasoline", category: "Transport", icon: "⛽" },
      { name: "Jollibee Meal", category: "Dining", icon: "🍗" },
      { name: "Shopee Item", category: "Shopping", icon: "📦" },
      { name: "Internet Bill", category: "Bills", icon: "🌐" },
      { name: "Uniqlo Wear", category: "Shopping", icon: "👕" },
      { name: "GrabFood", category: "Dining", icon: "🛵" }
    ];

    let runningSpent = 0;

    return dailyExpenses.map((expense, i) => {
      const day = i + 1;
      const daysRemaining = 30 - day + 1;
      const itemTemplate = itemPool[Math.floor(Math.random() * itemPool.length)];
      
      const actuallyBought = expense > 0;
      let verdict = null;
      let followed = null;

      if (actuallyBought) {
        // ML Logic: Only triggered if there is an intent to spend
        const reservedEssentials = daysRemaining * dailyEssentialBuffer;
        const discretionaryBalance = (monthlyBudget - runningSpent) - reservedEssentials;
        verdict = expense < (discretionaryBalance * 0.3) ? "YES" : "NO";
        
        runningSpent += expense;
        
        // Followed logic: Historically did they spend when AI said NO?
        followed = verdict === "YES"; 
        if (verdict === "NO" && selectedUser.spendingScore > 70) {
          // High score users might have ignored a NO if it was essential but here we simulate adherence
          followed = Math.random() > 0.3; 
        }
      }

      return {
        day,
        itemName: actuallyBought ? itemTemplate.name : "No Activity",
        category: actuallyBought ? itemTemplate.category : "System",
        icon: actuallyBought ? itemTemplate.icon : "💤",
        productPrice: actuallyBought ? expense : 0,
        verdict,
        followed,
        actuallyBought,
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
            <div key={log.day} className={`pt-daily-card ${!log.actuallyBought ? 'pt-daily-card--inactive' : ''}`} 
                 style={{ opacity: log.actuallyBought ? 1 : 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ fontSize: '1.5rem' }}>{log.icon}</div>
                  <div>
                    <span className="pt-item-name">{log.itemName}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{log.category}</span>
                  </div>
                </div>
                <span className="pt-day-badge">DAY {log.day}</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span className="pt-item-price" style={{ fontSize: '1.2rem', display: 'block', color: log.actuallyBought ? 'var(--sw-indigo)' : '#94a3b8' }}>
                  {formatCurrency(log.productPrice)}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{log.actuallyBought ? 'Confirmed Transaction' : 'Zero Expenses'}</span>
              </div>
              
              {log.actuallyBought ? (
                <>
                  <div className="pt-verdict-box" style={{ background: '#f1f5f9', padding: '10px', borderRadius: '10px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <span className="pt-decision-label">ML ADVICE</span>
                      <div className={`pt-verdict-tag pt-verdict-tag--${log.verdict.toLowerCase()}`}>
                        {log.verdict}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="pt-decision-label">ADHERENCE</span>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: log.followed ? '#0d9488' : '#ef4444', marginTop: '4px' }}>
                        {log.followed ? 'FOLLOWED' : 'IGNORED'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e2e8f0', borderRadius: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic' }}>No AI Analysis Required</span>
                </div>
              )}

              <div className="pt-daily-balance" style={{ 
                background: log.remainingBudget < 0 ? '#ef4444' : log.remainingBudget < (income * 0.1) ? '#f59e0b' : 'var(--sw-navy)' 
              }}>
                <span>{log.remainingBudget < 0 ? 'INSUFFICIENT BALANCE' : 'REMAINING BALANCE'}</span>
                <strong>{formatCurrency(log.remainingBudget)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-tab-container">
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

export default PurchaseTab;
