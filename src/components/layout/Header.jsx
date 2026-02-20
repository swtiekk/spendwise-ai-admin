function Header() {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-header-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search users, reports..." />
        </div>
      </div>
      <div className="admin-header-right">
        <button className="admin-header-notif">
          🔔
          <span className="admin-notif-dot" />
        </button>
        <div className="admin-header-avatar">A</div>
      </div>
    </header>
  );
}

export default Header;