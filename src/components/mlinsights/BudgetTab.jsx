import React, { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';

const BudgetTab = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Helper functions
  const parseCurrency = (str) => {
    if (!str) return 0;
    return Number(str.replace(/[^0-9.-]+/g, ""));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(val);

  const SR_ONLY_STYLE = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  };

  const ITEM_POOL = [
    { name: "Starbucks Latte", category: "Dining", icon: "☕" },
    { name: "Netflix Subscription", category: "Sub", icon: "🎬" },
    { name: "Shell Gasoline", category: "Transport", icon: "⛽" },
    { name: "Jollibee Meal", category: "Dining", icon: "🍗" },
    { name: "Shopee Item", category: "Shopping", icon: "📦" },
    { name: "Internet Bill", category: "Bills", icon: "🌐" },
    { name: "Uniqlo Wear", category: "Shopping", icon: "👕" },
    { name: "GrabFood", category: "Dining", icon: "🛵" },
    { name: "7-Eleven Snack", category: "Dining", icon: "🏪" },
    { name: "Lazada Delivery", category: "Shopping", icon: "🚚" },
    { name: "Spotify Premium", category: "Sub", icon: "🎵" },
    { name: "Cinema Ticket", category: "Entertainment", icon: "🎟️" }
  ];

  // Sub-component: DayCard
  const DayCard = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleItems = isExpanded ? log.transactions : log.transactions.slice(0, 2);
    const hasMore = log.transactions.length > 2;

    return (
      <article 
        className={`pt-daily-card ${!log.hasActivity ? 'pt-daily-card--inactive' : ''}`} 
        style={{ opacity: log.hasActivity ? 1 : 0.7, display: 'flex', flexDirection: 'column' }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="pt-day-badge" style={{ position: 'static', margin: 0 }}>DAY {log.day}</h3>
          {log.hasActivity && (
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--sw-indigo)', textTransform: 'uppercase' }}>
              {log.transactions.length} Items
            </span>
          )}
        </header>

        <section style={{ flex: 1 }}>
          {!log.hasActivity ? (
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e2e8f0', borderRadius: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic' }}>Zero Activity</span>
            </div>
          ) : (
            <>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', padding: 0, listStyle: 'none' }}>
                {visibleItems.map((tx) => (
                  <li key={tx.id} style={{ 
                    background: tx.isSaving ? '#f0fdfa' : '#f8fafc', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: tx.isSaving ? '1px solid #ccfbf1' : '1px solid #f1f5f9' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minWidth: 0 }}>
                        <span aria-hidden="true" style={{ fontSize: '1rem' }}>{tx.icon}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--sw-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.name}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        color: tx.isSaving ? '#0d9488' : 'var(--sw-indigo)', 
                        flexShrink: 0,
                        textDecoration: tx.isSaving ? 'line-through' : 'none',
                        opacity: tx.isSaving ? 0.6 : 1
                      }}>
                        {formatCurrency(tx.price)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className={`pt-verdict-tag pt-verdict-tag--${tx.verdict.toLowerCase()}`} style={{ fontSize: '0.5rem', padding: '1px 4px' }}>
                        AI: {tx.verdict}
                      </div>
                      <span style={{ fontSize: '0.55rem', fontWeight: 800, color: tx.followed ? '#0d9488' : '#ef4444' }}>
                        {tx.isSaving ? 'SAVED (FOLLOWED)' : tx.followed ? 'FOLLOWED' : 'IGNORED'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              
              {hasMore && (
                <button 
                  type="button" 
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
        </section>

        <footer style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>DAILY TOTAL</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sw-navy)' }}>{formatCurrency(log.dayTotal)}</span>
          </div>
          <div className="pt-daily-balance" style={{ 
            background: log.remainingBudget < 0 ? '#ef4444' : 'var(--sw-navy)',
            padding: '6px 10px',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.6rem' }}>{log.remainingBudget < 0 ? 'INSUFFICIENT BALANCE' : 'BALANCE'}</span>
            <strong style={{ fontSize: '0.75rem' }}>{formatCurrency(log.remainingBudget)}</strong>
          </div>
        </footer>
      </article>
    );
  };

  /**
   * Generates a 30-day log where spending only decrements the budget
   * if the user actually spent the money.
   * AI will say "NO" automatically if budget is insufficient.
   */
  const dailyLog = useMemo(() => {
    if (!selectedUser) return [];
    
    const monthlyBudget = parseCurrency(selectedUser.income);
    const totalActualSpent = parseCurrency(selectedUser.spent);
    const transactionDaysCount = Math.min(selectedUser.transactions || 20, 30);
    
    const dayIndices = Array.from({ length: 30 }, (_, i) => i);
    const dailyActualSpentAmounts = new Array(30).fill(0);
    
    // Shuffle indices to distribute totalActualSpent
    for (let i = dayIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dayIndices[i], dayIndices[j]] = [dayIndices[j], dayIndices[i]];
    }
    
    let remainingToDistribute = totalActualSpent;
    const activeDayIndices = dayIndices.slice(0, transactionDaysCount);
    activeDayIndices.sort((a, b) => a - b);
    const avgDailySpend = totalActualSpent / transactionDaysCount;

    activeDayIndices.forEach((idx, i) => {
      if (i === activeDayIndices.length - 1) {
        dailyActualSpentAmounts[idx] = remainingToDistribute;
      } else {
        const amount = Math.round(avgDailySpend * (0.6 + Math.random() * 0.8));
        const finalAmount = Math.min(amount, remainingToDistribute);
        dailyActualSpentAmounts[idx] = finalAmount;
        remainingToDistribute -= finalAmount;
      }
    });

    let runningSpent = 0;

    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const targetSpend = dailyActualSpentAmounts[i];
      const transactions = [];
      let dayActualTotal = 0;

      // 1. Generate Actual Spends
      if (targetSpend > 0) {
        const itemCount = Math.floor(Math.random() * 2) + 1;
        let remainingInDay = targetSpend;

        for (let j = 0; j < itemCount; j++) {
          const itemTemplate = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
          const price = (j === itemCount - 1) ? remainingInDay : Math.round((targetSpend / itemCount) * (0.8 + Math.random() * 0.4));
          remainingInDay -= price;

          // AI RULE: If budget is insufficient, always say NO
          const isInsufficient = (runningSpent + price) > monthlyBudget;
          let verdict = "YES";
          let followed = true;

          if (isInsufficient) {
            verdict = "NO";
            followed = false; // They spent it anyway (ignored AI)
          } else {
            const isNo = Math.random() > (selectedUser.spendingScore / 100) + 0.2;
            verdict = isNo ? "NO" : "YES";
            followed = !isNo;
          }

          transactions.push({
            id: `day${day}-spend-${j}`,
            ...itemTemplate,
            price,
            verdict,
            followed,
            isSaving: false
          });
          
          runningSpent += price;
          dayActualTotal += price;
        }
      }

      // 2. Generate "Potential Savings" (AI said NO and user followed)
      const savingsCount = Math.floor(Math.random() * 2); 
      for (let s = 0; s < savingsCount; s++) {
        const itemTemplate = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
        const price = Math.round(avgDailySpend * (0.3 + Math.random() * 0.7));

        // AI RULE: If budget is insufficient, always say NO
        const isInsufficient = (runningSpent + price) > monthlyBudget;
        const verdict = isInsufficient ? "NO" : (Math.random() > 0.5 ? "NO" : "YES");
        
        // Potential savings are only shown if AI says NO and user "follows"
        if (verdict === "NO") {
          transactions.push({
            id: `day${day}-save-${s}`,
            ...itemTemplate,
            price,
            verdict: "NO",
            followed: true,
            isSaving: true
          });
          // Budget does NOT decrement because user followed the "NO"
        }
      }

      transactions.sort(() => Math.random() - 0.5);

      return {
        day,
        hasActivity: transactions.length > 0,
        transactions,
        dayTotal: dayActualTotal,
        remainingBudget: monthlyBudget - runningSpent
      };
    });
  }, [selectedUser]);

  if (selectedUser) {
    const income = parseCurrency(selectedUser.income);
    const recordedSpent = parseCurrency(selectedUser.spent);

    return (
      <main className="pt-detail-view" aria-labelledby="detail-title">
        <header className="pt-detail-header">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button type="button" className="pt-back-btn" onClick={() => setSelectedUser(null)}>
              ← Back to Monitor
            </button>
            <div>
              <h2 id="detail-title" className="ml-chart-title" style={{ margin: 0 }}>Reviewing ID: {selectedUser.id}</h2>
              <p className="ml-chart-sub" style={{ margin: 0 }}>
                Budget: {formatCurrency(income)} | Total Outcome: {formatCurrency(income - recordedSpent)}
              </p>
            </div>
          </nav>
          <div className="pt-user-avatar" style={{ background: 'var(--sw-navy)', borderRadius: '8px', width: '40px', height: '40px' }} aria-hidden="true">
            {selectedUser.id}
          </div>
        </header>

        <section className="pt-daily-grid">
          <h2 style={SR_ONLY_STYLE}>Daily Activity History</h2>
          {dailyLog.map((log) => (
            <DayCard key={log.day} log={log} />
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="budget-tab-container">
      <h2 style={SR_ONLY_STYLE}>Budget Insights Summary</h2>
      
      <section className="pt-summary-cards" aria-label="Summary Statistics">
        <article className="pt-summary-card">
          <h3 className="ml-metric-label">Actual Total Budget</h3>
          <p className="ml-metric-value" style={{ color: '#2dd4bf' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + parseCurrency(u.income), 0))}
          </p>
        </article>
        <article className="pt-summary-card">
          <h3 className="ml-metric-label">Actual Total Spent</h3>
          <p className="ml-metric-value" style={{ color: '#ef4444' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + parseCurrency(u.spent), 0))}
          </p>
        </article>
        <article className="pt-summary-card">
          <h3 className="ml-metric-label">Verified Savings</h3>
          <p className="ml-metric-value" style={{ color: 'var(--sw-indigo)' }}>
            {formatCurrency(mockUsers.reduce((acc, u) => acc + (parseCurrency(u.income) - parseCurrency(u.spent)), 0))}
          </p>
        </article>
      </section>

      <section className="ml-chart-box" aria-labelledby="user-list-title">
        <header className="pt-user-list-header">
          <h2 id="user-list-title" style={SR_ONLY_STYLE}>User Monitoring List</h2>
          <div role="columnheader">USER</div>
          <div role="columnheader">HEALTH</div>
          <div role="columnheader">ACTUAL VS PREDICTION</div>
          <div role="columnheader">RISK STATUS</div>
          <div role="columnheader" style={{ textAlign: 'center' }}>ACTIONS</div>
        </header>

        <ul className="pt-user-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {mockUsers.map((user) => {
            const actual = parseCurrency(user.spent);
            const income = parseCurrency(user.income);
            const predicted = income * 0.90; 
            
            const actualPercent = (actual / income) * 100;
            const predictedPercent = (predicted / income) * 100;
            const isOverBudget = actual > predicted;

            return (
              <li key={user.id}>
                <article className="pt-user-row">
                  <div className="pt-user-info">
                    <div className="u-avatar" aria-hidden="true">
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
                    <div className="pt-comparison-track" role="progressbar" aria-valuenow={actualPercent} aria-valuemin="0" aria-valuemax="100">
                      <div className="pt-comparison-fill pt-comparison-fill--predicted" style={{ width: `${Math.min(predictedPercent, 100)}%` }} aria-hidden="true" />
                      <div className={`pt-comparison-fill pt-comparison-fill--actual ${isOverBudget ? 'pt-comparison-fill--over' : ''}`} style={{ width: `${Math.min(actualPercent, 100)}%` }} aria-hidden="true" />
                    </div>
                    <div className="pt-comparison-label-row">
                      <span>Act: {formatCurrency(actual)}</span>
                      <span>Pred: {formatCurrency(predicted)}</span>
                    </div>
                  </div>

                  <div>
                    <span className={`pt-status-badge pt-status-badge--${isOverBudget ? 'flagged' : user.status}`}>
                      {isOverBudget ? 'INSUFFICIENT BALANCE' : user.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="button" className="pt-action-btn" onClick={() => setSelectedUser(user)}>
                      Review ID: {user.id}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export default BudgetTab;