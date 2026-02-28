function Header() {
  return (
    <header className="admin-header" role="banner">

      <div className="admin-header-left">
        {/* FIX: label added for search input accessibility */}
        <div className="admin-header-search" role="search">
          <label htmlFor="global-search" className="sr-only">Search</label>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="global-search"
            type="search"
            placeholder="Search users, reports..."
            aria-label="Search users and reports"
          />
        </div>
      </div>

      <div className="admin-header-right">
        {/* FIX: type="button" added, aria-label added */}
        <button
          type="button"
          className="admin-header-notif"
          aria-label="View notifications"
        >
          🔔
          <span className="admin-notif-dot" aria-hidden="true" />
        </button>
        <div className="admin-header-avatar" aria-label="Admin user" role="img">
          A
        </div>
      </div>

    </header>
  );
}

export default Header;