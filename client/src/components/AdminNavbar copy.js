import { Menu, Search } from "lucide-react";

import "../style/components/AdminNavbar.css";

function AdminNavbar({ onToggleSidebar, isSidebarOpen, onQueryChange }) {
  return (
    <header className="admin-navbar-wrapper admin-navbar" style={{ marginLeft: isSidebarOpen ? "260px" : "0", transition: "margin-left 0.3s ease" }}>
      {/* Sidebar Toggle */}
      <button className="toggle-btn" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Judul, ISBN, Pengarang..."
          onChange={(e) => onQueryChange(e.target.value)}
          className="search-input"
        />
        
      </div>
    </header>
  );
}

export default AdminNavbar;
