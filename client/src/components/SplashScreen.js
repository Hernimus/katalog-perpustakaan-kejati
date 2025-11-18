import React from "react";
import "../style/components/SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-wrapper d-flex flex-column justify-content-center align-items-center text-center vh-100">
      
      {/* Logo di tengah */}
      <img
        src="/gambar/KEJATI.webp"
        alt="Logo"
        className="splash-logo mb-4"
      />

      {/* Tulisan di bagian bawah */}
      <p className="splash-text-bottom mt-auto mb-3">
        Kejaksaan Tinggi Kalimantan Tengah
      </p>
    </div>
  );
}

export default SplashScreen;
