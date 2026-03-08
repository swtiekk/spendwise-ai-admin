import React from 'react';
import { useMLInsights } from '../../hooks/usemlinsight';

const BudgetTab = () => {
  const {
    mockUsers,
    selectedUser,
    setSelectedUser,
    expandedDays,
    toggleDayExpansion,
    parseCurrency,
    formatCurrency,
    dailyLog
  } = useMLInsights();

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

  // Sub-component: DayCard
  const DayCard = ({ log }) => {
    const isExpanded = !!expandedDays[log.day];
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
                  onClick={() => toggleDayExpansion(log.day)}
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