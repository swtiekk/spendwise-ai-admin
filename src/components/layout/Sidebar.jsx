import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard",   icon: "⊞", label: "Dashboard"  },
  { to: "/users",       icon: "👥", label: "Users"       },
  { to: "/ml-insights", icon: "🧠", label: "ML Insights" },
  { to: "/reports",     icon: "📋", label: "Reports"     },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar" aria-label="Admin sidebar navigation">

      <div className="sidebar-brand" aria-label="SpendWise AI">
        <div className="sidebar-brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

      {/* FIX: use <nav> semantic element with aria-label */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="sidebar-nav-label" aria-hidden="true">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "sidebar-nav-item--active" : ""}`
            }
            aria-label={item.label}
          >
            <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" aria-label="Logged in as Admin">
          <div className="sidebar-avatar" aria-hidden="true">A</div>
          <div>
            <p className="sidebar-user-name">Admin</p>
            <p className="sidebar-user-role">Super Admin</p>
          </div>
        </div>
        {/* FIX: type="button" added, navigate used instead of NavLink for logout */}
        <button
          type="button"
          className="sidebar-logout"
          onClick={() => navigate("/login")}
          aria-label="Logout"
        >
          ⏻ Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;