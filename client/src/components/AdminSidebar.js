import { NavLink } from "react-router-dom";
import "../style/components/AdminSidebar.css";
import {
  LayoutDashboard,
  SwatchBook,
  BarChart2,
  Users,
  GalleryHorizontal,
  LogOut,
} from "lucide-react";

function AdminSidebar({ onLogout, isOpen, toggleSidebar }) {
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/admin" },
    { icon: <SwatchBook size={18} />, label: "Tema Rak", path: "/admin/mapping-rak" },
    { icon: <BarChart2 size={18} />, label: "Analytics", path: "/admin/stats" },
    { icon: <Users size={18} />, label: "Kelola Admin", path: "/admin/admins" },
    { icon: <GalleryHorizontal size={18} />, label: "Kelola Galeri", path: "/admin/gallery" },
  ];

  return (
    <>
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">Admin Panel</div>
          <button className="btn-close d-lg-none" onClick={toggleSidebar}></button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end // 👈 ensures "/admin" only matches exactly (not all /admin/*)
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => toggleSidebar(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button className="sidebar-link logout-btn" onClick={onLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default AdminSidebar;
