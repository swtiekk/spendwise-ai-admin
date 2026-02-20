import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/users", icon: "👥", label: "Users" },
  { to: "/ml-insights", icon: "🧠", label: "ML Insights" },
  { to: "/reports", icon: "📋", label: "Reports" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="3" />
            <path d="M16 11h.01" />
            <path d="M2 10V6a2 2 0 012-2h16a2 2 0 012 2v4" />
          </svg>
        </div>
        <div>
          <p className="sidebar-brand-name">SpendWise<span>AI</span></p>
          <p className="sidebar-brand-sub">Admin Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "sidebar-nav-item--active" : ""}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div>
            <p className="sidebar-user-name">Admin</p>
            <p className="sidebar-user-role">Super Admin</p>
          </div>
        </div>
        <NavLink to="/" className="sidebar-logout">⏻ Logout</NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;