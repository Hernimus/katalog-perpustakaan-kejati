// src/components/LoadingIndicator.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/components/LoadingIndicator.css";

function LoadingIndicator({ message = "Memuat data...", size = "3rem", color = "warning" }) {
  return (
    <div className="text-center py-5">
      <div
        className={`spinner-border text-${color}`}
        role="status"
        style={{ width: size, height: size }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 fw-semibold text-secondary">{message}</p>
    </div>
  );
}

export default LoadingIndicator;
