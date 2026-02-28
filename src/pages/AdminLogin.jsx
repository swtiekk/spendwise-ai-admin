import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";
import { adminAccount } from "../data/mockData";

function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [status, setStatus]     = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === adminAccount.email && password === adminAccount.password) {
      setStatus("success");
      setMessage("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setStatus("error");
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="login-container">
      {/* Background effects */}
      <div className="login-bg-mesh" aria-hidden="true" />
      <div className="login-bg-grid" aria-hidden="true" />
      <div className="login-orb login-orb--1" aria-hidden="true" />
      <div className="login-orb login-orb--2" aria-hidden="true" />

      <div className="login-page">

        {/* ── Left branding panel ── */}
        <aside className="login-panel-left" aria-label="SpendWise AI branding">
          <div>
            <div className="login-brand">
              <div className="login-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="3" />
                  <path d="M16 11h.01" />
                  <path d="M2 10V6a2 2 0 012-2h16a2 2 0 012 2v4" />
                  <path d="M18 3l-2 4" />
                </svg>
              </div>
              {/* FIX: h1 is correct top-level heading for page identity */}
              <h1 className="login-brand-title">
                Spend<span>Wise</span> AI
              </h1>
              <p className="login-brand-sub">Intelligent Financial Decision Support</p>
            </div>

            <ul className="login-features" aria-label="System features">
              <li className="login-feature-item">
                <div className="login-feature-dot login-feature-dot--teal" aria-hidden="true">🧠</div>
                <div>
                  <h2 className="login-feature-title">Behavioral Analysis</h2>
                  <p>AI learns spending patterns to give personalized advice</p>
                </div>
              </li>
              <li className="login-feature-item">
                <div className="login-feature-dot login-feature-dot--indigo" aria-hidden="true">📊</div>
                <div>
                  <h2 className="login-feature-title">Proactive Alerts</h2>
                  <p>Know before you overspend — not after</p>
                </div>
              </li>
              <li className="login-feature-item">
                <div className="login-feature-dot login-feature-dot--amber" aria-hidden="true">💡</div>
                <div>
                  <h2 className="login-feature-title">Smart Recommendations</h2>
                  <p>Decision support tailored to each income cycle</p>
                </div>
              </li>
            </ul>
          </div>

          <footer className="login-panel-footer">
            © 2025 SpendWise AI · Admin Portal v1.0
          </footer>
        </aside>

        {/* ── Right form panel ── */}
        <section className="login-panel-right" aria-label="Admin login form">
          <div className="login-form-header">
            <span className="login-tag">Admin Portal</span>
            {/* FIX: h2 is correct here — sits under h1 in the branding panel */}
            <h2>Welcome back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="login-form" noValidate aria-label="Login">
            <div className="login-form-group">
              {/* GOOD: label + htmlFor already correct */}
              <label htmlFor="email">Email address</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@spendwise.ai"
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* FIX: type="submit" explicitly set */}
            <button type="submit" className="login-btn">
              Sign in to Dashboard →
            </button>
          </form>

          {message && (
            <p
              className={`login-message login-message--${status}`}
              role="alert"
              aria-live="polite"
            >
              {status === "error" ? "⚠️" : "✓"} {message}
            </p>
          )}

          <div className="login-secure-note" aria-label="Security notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            256-bit TLS encrypted · SpendWise AI Admin
          </div>
        </section>

      </div>
    </main>
  );
}

export default AdminLogin;