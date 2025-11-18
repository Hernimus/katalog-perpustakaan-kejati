import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BookDetailModal({ book, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!book) return null;

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
      onClick={onClose} 
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Detail Buku</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <table className="table table-bordered table-striped">
              <tbody>
                {Object.entries(book).map(([key, value]) => (
                  <tr key={key}>
                    <td className="fw-bold text-capitalize" style={{ width: "35%" }}>
                      {key.replace(/_/g, " ")}
                    </td>
                    <td>{value ? value.toString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default BookDetailModal;
