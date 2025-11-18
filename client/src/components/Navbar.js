import { Link, NavLink } from "react-router-dom";
import { FaHome, FaBook, FaInfoCircle, FaSignInAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../style/components/Navbar.css";

const logo = process.env.PUBLIC_URL + "/gambar/KEJATI.webp";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Efek scroll navbar berubah warna
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔒 Kunci scroll saat menu terbuka
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  // Tutup menu jika klik di luar (overlay)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(".mobile-menu");
      const toggle = document.querySelector(".navbar-toggler");
      if (
        menuOpen &&
        menu &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* ======= NAVBAR ======= */}
      <nav
        className={`navbar navbar-expand-lg fixed-top shadow-sm transition-all ${
          scrolled || menuOpen
            ? "background navbar-light"
            : "bg-transparent navbar-dark"
        }`}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link
            className="navbar-brand fw-bold d-flex align-items-center"
            to="/"
            onClick={closeMenu}
          >
            <img src={logo} alt="Logo Kejati" width="45" height="45" className="me-2" />
            <span className="d-none d-md-inline txt-clr">
              Perpustakaan Kejaksaan Tinggi <br />
              Kalimantan Tengah
            </span>
          </Link>

          {/* Tombol Hamburger */}
          <button className="navbar-toggler border-0" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu Desktop */}
          <div className="collapse navbar-collapse d-none d-lg-block">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/katalog" onClick={closeMenu}>
                  Katalog
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about" onClick={closeMenu}>
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login" onClick={closeMenu}>
                  Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ======= OVERLAY GELAP ======= */}
      <div className={`menu-overlay ${menuOpen ? "show" : ""}`} onClick={closeMenu}></div>

      {/* ======= MOBILE MENU ======= */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 marquee-wrapper">
            <span className="marquee-content">
              Perpustakaan Kejaksaan Tinggi Kalimantan Tengah&nbsp;&nbsp;
              Perpustakaan Kejaksaan Tinggi Kalimantan Tengah
            </span>
          </h5>
          <button className="close-btn" onClick={closeMenu}>
            &times;
          </button>
        </div>

        <ul className="mobile-menu-list list-unstyled mt-4">
          <li>
            <NavLink to="/" onClick={closeMenu} className="mobile-menu-item">
              <FaHome className="menu-icon" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/katalog" onClick={closeMenu} className="mobile-menu-item">
              <FaBook className="menu-icon" />
              <span>Katalog</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMenu} className="mobile-menu-item">
              <FaInfoCircle className="menu-icon" />
              <span>About</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" onClick={closeMenu} className="mobile-menu-item">
              <FaSignInAlt className="menu-icon" />
              <span>Admin</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
