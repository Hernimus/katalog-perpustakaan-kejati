import { Menu, Search } from "lucide-react";
import { useEffect, useRef } from "react";

import "../style/components/AdminNavbar.css";

function AdminNavbar({ onToggleSidebar, isSidebarOpen, onQueryChange, pathname }) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          ref={searchInputRef}
          type="text"
          placeholder={
            pathname === "/admin/mapping-rak"
              ? "Rak Buku, Tema..."
              : pathname === "/admin/admins"
              ? "Username..."
              : "Judul, ISBN, Pengarang..."
          }
          onChange={(e) => onQueryChange(e.target.value)}
          className="search-input"
        />
      Ctrl + K 
      </div>
    </header>
  );
}

export default AdminNavbar;
