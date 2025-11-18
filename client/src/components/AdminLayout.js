import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "../style/components/AdminLayout.css";

function AdminLayout({ onLogout }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // start open
  const [query, setQuery] = useState("");

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  return (
    <div
      className="admin-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Sidebar */}
      <div
        className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isSidebarOpen ? "260px" : "0",
          transition: "width 0.3s ease",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: isSidebarOpen ? "2px 0 6px rgba(0,0,0,0.1)" : "none",
          zIndex: 1000,
        }}
      >
        <AdminSidebar
          onLogout={onLogout}
          isOpen={isSidebarOpen}
          toggleSidebar={handleToggleSidebar}
        />
      </div>

      {/* Main section */}
      <div
        className="admin-main"
        style={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
          marginLeft: isSidebarOpen ? "260px" : "0", // ✅ moves content with sidebar
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
          onQueryChange={handleQueryChange}
          pathname={location.pathname}
        />

        <div
          className="admin-content"
          style={{
            flexGrow: 1,
            padding: "10px 20px 60px",
            backgroundColor: "transparent",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Outlet context={{ query }} />
        </div>


      </div>
    </div>
  );
}

export default AdminLayout;
