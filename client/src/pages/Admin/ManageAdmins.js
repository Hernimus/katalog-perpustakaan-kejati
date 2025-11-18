import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import "../../style/Admin/ManageAdmins.css";
import "../../style/components/RakModalGlobal.css";

function ManageAdmins() {
  const { query } = useOutletContext();
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, username: "" });

  // Alert system
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "info" }), 3000);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = admins.filter((admin) =>
        admin.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAdmins(filtered);
    } else {
      setFilteredAdmins(admins);
    }
  }, [query, admins]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/admin/api/admins", { credentials: "include" });
      if (!response.ok) throw new Error("Gagal mengambil data admin");
      const data = await response.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      showAlert("Gagal memuat daftar admin.", "error");
    }
  };

  const handleShowModal = (admin = null) => {
    setEditAdmin(admin);
    setFormData(admin ? { username: admin.username, password: "" } : { username: "", password: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditAdmin(null);
    setFormData({ username: "", password: "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.username.trim()) {
      showAlert("Username tidak boleh kosong!", "warning");
      return;
    }

    if (!editAdmin && !formData.password.trim()) {
      showAlert("Password wajib diisi untuk admin baru!", "warning");
      return;
    }

    setSaving(true);
    try {
      const method = editAdmin ? "PUT" : "POST";
      const url = editAdmin
        ? `/admin/api/admins/${editAdmin.id}`
        : "/admin/api/admins";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data admin");

      showAlert(editAdmin ? "Admin berhasil diperbarui." : "Admin baru berhasil ditambahkan.", "success");
      handleCloseModal();
      fetchAdmins();
    } catch (error) {
      console.error("Failed to save admin:", error);
      showAlert("Terjadi kesalahan saat menyimpan data admin.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, username) => {
    setDeleteModal({ show: true, id, username });
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/admin/api/admins/${deleteModal.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal menghapus admin");

      showAlert("Admin berhasil dihapus.", "success");
      setDeleteModal({ show: false, id: null, username: "" });
      fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin:", error);
      showAlert("Terjadi kesalahan saat menghapus admin.", "error");
    }
  };

  return (
    <div className="manage-admins admins-container">
      {/* Alert Toast */}
      {alert.show && (
        <div className={`rak-alert rak-alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Hero Section */}
      <section
        className="admins-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/masthead3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-hero">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Kelola Admin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Mengelola akun administrator sistem katalog perpustakaan.
          </motion.p>
        </div>
      </section>

      {/* Table Section */}
      <motion.section
        className="admins-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container">
          <button
            className="rak-btn rak-btn-green"
            onClick={() => handleShowModal()}
          >
            Tambah Admin
          </button>

          <div className="rak-table-wrapper">
            <table className="rak-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                      Tidak ada data admin.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.username}</td>
                      <td>
                        <button
                          className="rak-btn rak-btn-yellow"
                          onClick={() => handleShowModal(admin)}
                        >
                          Edit
                        </button>
                        <button
                          className="rak-btn rak-btn-red"
                          onClick={() => handleDelete(admin.id, admin.username)}
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
        </div>
      </motion.section>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="rak-modal-overlay" onClick={handleCloseModal}>
          <div className="rak-modal rak-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rak-modal-header">
              <h3>{editAdmin ? "Edit Admin" : "Tambah Admin"}</h3>
              <button className="rak-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="rak-modal-body">
              <div className="rak-form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className="rak-input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                />
              </div>

              <div className="rak-form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="rak-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={editAdmin ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                />
              </div>
            </div>

            <div className="rak-modal-footer">
              <button className="rak-btn rak-btn-gray" onClick={handleCloseModal}>
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

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="rak-modal-overlay" onClick={() => setDeleteModal({ show: false, id: null, username: "" })}>
          <div className="rak-modal rak-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rak-modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button className="rak-close" onClick={() => setDeleteModal({ show: false, id: null, username: "" })}>✕</button>
            </div>

            <div className="rak-modal-body">
              <p>
                Apakah Anda yakin ingin menghapus admin{" "}
                <strong>{deleteModal.username}</strong>?
              </p>
            </div>

            <div className="rak-modal-footer">
              <button
                className="rak-btn rak-btn-gray"
                onClick={() => setDeleteModal({ show: false, id: null, username: "" })}
              >
                Batal
              </button>
              <button className="rak-btn rak-btn-red" onClick={confirmDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAdmins;
