import { useEffect } from "react";
import "../style/components/RakModal.css";

function RakModal({ show, onHide, rakList, rakFilter, onSelect }) {
  
  // 🔒 Kunci scroll ketika modal terbuka
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="custom-modal-backdrop" onClick={onHide}>
      <div
        className="custom-modal-container rounded shadow"
        onClick={(e) => e.stopPropagation()} // cegah modal tertutup jika klik dalam box
      >
        {/* Header */}
        <div className="custom-modal-header bg-warning bg-opacity-20 p-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Pilih Rak Buku</h5>

          <button className="btn-close" onClick={onHide}></button>
        </div>

        {/* Body */}
        <div className="custom-modal-body rak-modal-body p-3">
          {rakList.length === 0 ? (
            <p className="text-center text-muted">Memuat data rak...</p>
          ) : (
            <ul className="list-group list-group-flush">

              {/* Semua Rak */}
              <li
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  rakFilter === "" ? "active" : ""
                }`}
                onClick={() => {
                  onSelect({ value: "" });
                  onHide();
                }}
              >
                Semua Rak
                {rakFilter === "" && <span className="text-success fw-bold">✔</span>}
              </li>

              {/* Daftar Rak */}
              {rakList.map((rak, index) => (
                <li
                  key={index}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    rak.value === rakFilter ? "active" : ""
                  }`}
                  onClick={() => {
                    onSelect(rak);
                    onHide();
                  }}
                >
                  {rak.label}
                  {rak.value === rakFilter && (
                    <span className="text-success fw-bold">✔</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RakModal;
