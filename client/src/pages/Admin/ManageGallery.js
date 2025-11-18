import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../style/Admin/ManageGallery.css";
import "../../style/components/RakModalGlobal.css";

function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // 🔔 Local alert state
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  // 🗑️ Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // Show alert toast for 3 seconds
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 3000);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 🔹 Ambil data gambar
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setGallery(data);
      } else {
        setGallery([]);
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      showAlert("Gagal memuat galeri.", "error");
    }
  };

  // 🔹 Upload / Edit gambar
  const handleSave = async () => {
    if (!imageFile && !editImage) {
      showAlert("Pilih gambar terlebih dahulu!", "warning");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(
        editImage ? `/api/gallery/${editImage.id}` : "/api/gallery",
        {
          method: editImage ? "PUT" : "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan gambar.");

      showAlert(
        editImage ? "Gambar berhasil diperbarui." : "Gambar berhasil ditambahkan.",
        "success"
      );
      handleClose();
      fetchGallery();
    } catch (err) {
      console.error("Failed to save image:", err);
      showAlert("Terjadi kesalahan saat menyimpan gambar.", "error");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Tampilkan modal hapus
  const confirmDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  // 🔹 Hapus gambar
  const handleDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal menghapus gambar.");

      showAlert("Gambar berhasil dihapus.", "success");
      fetchGallery();
    } catch (err) {
      console.error("Failed to delete image:", err);
      showAlert("Terjadi kesalahan saat menghapus gambar.", "error");
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  // 🔹 Modal control
  const handleShow = (img = null) => {
    setEditImage(img);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditImage(null);
    setImageFile(null);
  };

  return (
    <div className="rak-page">
      {/* 🔔 Alert Toast */}
      {alert.show && (
        <div className={`rak-alert rak-alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rak-title"
      >
        Kelola Galeri
      </motion.h2>

      <button className="rak-btn rak-btn-green" onClick={() => handleShow()}>
        Tambah Gambar
      </button>

      {/* Table */}
      <div className="rak-table-wrapper">
        <table className="rak-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pratinjau</th>
              <th>Nama File</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gallery.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                  Tidak ada gambar dalam galeri.
                </td>
              </tr>
            ) : (
              gallery.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img
                      src={`/uploads/${item.filename}`}
                      alt="galeri"
                      className="rak-image-thumb"
                    />
                  </td>
                  <td>{item.filename}</td>
                  <td>
                    <button
                      className="rak-btn rak-btn-yellow"
                      onClick={() => handleShow(item)}
                    >
                      Ganti
                    </button>
                    <button
                      className="rak-btn rak-btn-red"
                      onClick={() => confirmDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     {/*Delete Confirmation Modal */}
{deleteModal.show && (
  <div
    className="rak-modal-overlay"
    onClick={() => setDeleteModal({ show: false, id: null })}
  >
    <div
      className="rak-modal rak-delete-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rak-modal-header">
        <h3>Konfirmasi Hapus</h3>
        <button
          className="rak-close"
          onClick={() => setDeleteModal({ show: false, id: null })}
        >
          ✕
        </button>
      </div>

      <div className="rak-modal-body">
  <p>Apakah kamu yakin ingin menghapus gambar ini?</p>
  {deleteModal.id && (
    <img
      src={`/uploads/${gallery.find(g => g.id === deleteModal.id)?.filename}`}
      alt="Preview"
      className="rak-image-thumb"
      style={{ marginTop: "1rem", borderRadius: "8px" }}
    />
  )}
</div>


      <div className="rak-modal-footer">
        <button
          className="rak-btn rak-btn-gray"
          onClick={() => setDeleteModal({ show: false, id: null })}
        >
          Batal
        </button>
        <button className="rak-btn rak-btn-red" onClick={handleDelete}>
          Hapus
        </button>
      </div>
    </div>
  </div>
)}


      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="rak-modal-overlay" onClick={handleClose}>
          <div className="rak-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rak-modal-header">
              <h3>{editImage ? "Ganti Gambar" : "Tambah Gambar Baru"}</h3>
              <button className="rak-close" onClick={handleClose}>
                ×
              </button>
            </div>

            <div className="rak-modal-body">
              <div className="rak-form-group">
                <label>Pilih Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              {editImage && (
                <div className="rak-preview">
                  <img
                    src={`/uploads/${editImage.filename}`}
                    alt="preview"
                    className="rak-image-preview"
                  />
                </div>
              )}
            </div>

            <div className="rak-modal-footer">
              <button className="rak-btn rak-btn-gray" onClick={handleClose}>
                Batal
              </button>
              <button
                className="rak-btn rak-btn-blue"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageGallery;
