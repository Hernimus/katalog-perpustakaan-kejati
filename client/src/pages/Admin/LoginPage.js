import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowBigLeftDash, Eye, EyeOff } from "lucide-react"; // 👈 import icons
import "../../style/Admin/LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 visibility toggle state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(username, password);
    if (success) navigate("/admin");
    else setError("Invalid username or password");
  };

  return (
    <div className="login-page-wrapper login-page">
      <div className="login-left">
        <motion.div
          className="login-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back button */}
          <button className="back-home-btn" onClick={() => navigate("/")}>
            <ArrowBigLeftDash className="icon" />
            Back to Home
          </button>

          <h1 className="login-title">Login Admin</h1>
          <p className="login-subtitle">Masukan Username dan Password Anda.</p>

          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className="form-groups">
              <label htmlFor="username">
                Username<span>*</span>
              </label>
              <div className="password-input-wrapper">    
              <input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              </div>
              
            </div>

            {/* PASSWORD */}
            <div className="form-groups password-group">
              <label className="label-log" htmlFor="password">
                Password<span>*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // 👈 toggle type
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="toggle-icon" />
                  ) : (
                    <Eye className="toggle-icon" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right Side with Background Image */}
      <div
        className="login-right"
        style={{
          backgroundImage: "url('/gambar/masthead.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="right-content">
          <h2>Kejaksaan Tinggi Kalimantan Tengah</h2>
          <p>Katalog Perpustakaan</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
