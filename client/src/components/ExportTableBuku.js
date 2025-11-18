import React, { useState, useEffect } from "react";

function ExportTableBuku({ onClose }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kunci scroll halaman saat modal terbuka
    document.body.style.overflow = "hidden";

    // Hapus efek scroll lock saat modal ditutup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/admin/export-buku", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengekspor data buku");

      // buat file download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Data_Buku.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      onClose(); // Tutup modal setelah ekspor
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal d-block fade show"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose} // klik luar = tutup
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()} // klik dalam = tidak menutup
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Ekspor Data Buku</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <p>Apakah Anda ingin mengekspor semua data buku ke file Excel?</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? "Mengekspor..." : "Ekspor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportTableBuku;
