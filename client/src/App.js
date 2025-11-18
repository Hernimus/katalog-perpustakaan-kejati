import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Public/Home";
import About from "./pages/Public/About";
import PublicPage from "./pages/Public/PublicPage";
import LoginPage from "./pages/Admin/LoginPage";
import AdminPage from "./pages/Admin/AdminPage";
import RakMappingPage from "./pages/Admin/RakMappingPage";
import Statistics from "./pages/Admin/Statistics";
import ManageAdmins from "./pages/Admin/ManageAdmins";
import ManageGallery from "./pages/Admin/ManageGallery";
import AdminLayout from "./components/AdminLayout";
import SplashScreen from "./components/SplashScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Admin/AdminGlobal.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => setIsAuthenticated(res.status === 200))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (username, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<PublicPage />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AdminLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="mapping-rak" element={<RakMappingPage />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="gallery" element={<ManageGallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
