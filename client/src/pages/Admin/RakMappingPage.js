import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../../style/Admin/RakMappingPage.css";
import "../../style/components/RakModalGlobal.css";

function RakMappingPage() {
  const { query } = useOutletContext();
  const [rakMappings, setRakMappings] = useState([]);
  const [filteredMappings, setFilteredMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rak_buku: "", tema: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const fetchMappings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/rak-mapping", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Sort by rak_buku numerically
        const sortedData = data.sort((a, b) => {
          const aNum = parseInt(a.rak_buku) || 0;
          const bNum = parseInt(b.rak_buku) || 0;
          return aNum - bNum;
        });
        setRakMappings(sortedData);
      } else {
        setRakMappings([]);
      }
    } catch (err) {
      console.error("Error fetching mappings:", err);
      setRakMappings([]);
      showAlert("error", "Gagal memuat data rak mapping.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = rakMappings.filter((mapping) =>
        (mapping.rak_buku && mapping.rak_buku.toLowerCase().includes(query.toLowerCase())) ||
        (mapping.tema && mapping.tema.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredMappings(filtered);
    } else {
      setFilteredMappings(rakMappings);
    }
  }, [query, rakMappings]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const openModal = (mapping = null) => {
    if (mapping) {
      setForm({ rak_buku: mapping.rak_buku || "", tema: mapping.tema || "" });
      setEditingId(mapping.rakmap_id);
    } else {
      setForm({ rak_buku: "", tema: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ rak_buku: "", tema: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.rak_buku.trim() || !form.tema.trim()) {
      showAlert("error", "Rak Buku dan Tema tidak boleh kosong!");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3000/api/rak-mapping/${editingId}`
        : "http://localhost:3000/api/rak-mapping";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      showAlert("success", editingId ? "Mapping berhasil diperbarui." : "Mapping berhasil ditambahkan.");
      closeModal();
      fetchMappings();
    } catch (err) {
      console.error(err);
      showAlert("error", "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (mapping) => {
    setSelectedDelete(mapping);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!selectedDelete) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/rak-mapping/${selectedDelete.rakmap_id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Gagal menghapus");

      showAlert("success", "Mapping berhasil dihapus.");
      fetchMappings();
    } catch (err) {
      console.error(err);
      showAlert("error", "Terjadi kesalahan saat menghapus data.");
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return <div className="rak-loading">Memuat data rak mapping...</div>;
  }

  return (
    <div className="rak-page">
      <h2>Rak Mapping</h2>

      <button className="rak-btn rak-btn-green" onClick={() => openModal()}>
        Tambah Mapping Baru
      </button>

      {filteredMappings.length === 0 ? (
        <div className="rak-empty">Tidak ada data mapping</div>
      ) : (
        <div className="rak-table-wrapper">
          <table className="rak-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rak Buku</th>
                <th>Tema</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((mapping) => (
                <tr key={mapping.rakmap_id}>
                  <td>{mapping.rakmap_id}</td>
                  <td>{mapping.rak_buku}</td>
                  <td>{mapping.tema}</td>
                  <td>
                    <button
                      className="rak-btn rak-btn-yellow"
                      onClick={() => openModal(mapping)}
                    >
                      Edit
                    </button>
                    <button
                      className="rak-btn rak-btn-red"
                      onClick={() => openDeleteModal(mapping)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="rak-modal-overlay" onClick={closeModal}>
          <div className="rak-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rak-modal-header">
              <h3>{editingId ? "Edit Mapping" : "Tambah Mapping"}</h3>
              <button className="rak-close" onClick={closeModal}>✕</button>
            </div>

            <div className="rak-modal-body">
              <div className="rak-form-group">
                <label>Rak Buku</label>
                <input
                  type="text"
                  name="rak_buku"
                  value={form.rak_buku}
                  onChange={handleChange}
                  placeholder="Masukkan kode rak buku"
                  disabled={editingId !== null}
                />
              </div>
              <div className="rak-form-group">
                <label>Tema</label>
                <input
                  type="text"
                  name="tema"
                  value={form.tema}
                  onChange={handleChange}
                  placeholder="Masukkan tema"
                />
              </div>
            </div>

            <div className="rak-modal-footer">
              <button className="rak-btn rak-btn-gray" onClick={closeModal}>
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
      {showDeleteModal && selectedDelete && (
        <div className="rak-modal-overlay" onClick={closeDeleteModal}>
          <div className="rak-modal rak-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rak-modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button className="rak-close" onClick={closeDeleteModal}>✕</button>
            </div>

            <div className="rak-modal-body">
              <p>
                Apakah Anda yakin ingin menghapus mapping untuk{" "}
                <strong>{selectedDelete.rak_buku}</strong>?
              </p>
            </div>

            <div className="rak-modal-footer">
              <button className="rak-btn rak-btn-gray" onClick={closeDeleteModal}>
                Batal
              </button>
              <button className="rak-btn rak-btn-red" onClick={confirmDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 Alert Toast */}
      {alert.show && (
        <div className={`rak-alert rak-alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
}

export default RakMappingPage;
