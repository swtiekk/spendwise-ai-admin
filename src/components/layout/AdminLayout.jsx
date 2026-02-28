import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/layout.css";

// FIX: children prop is explicitly destructured for clarity
function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        {/* FIX: <main> with aria-label for screen readers */}
        <main className="admin-content" aria-label="Main content area">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;