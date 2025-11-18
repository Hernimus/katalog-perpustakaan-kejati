import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import BookDetailModal from "../../components/BookDetailModal.js";
import BookFormModal from "../../components/BookFormModal.js";
import Statistics from "./Statistics.js";
import ManageAdmins from "./ManageAdmins.js";
import "../../style/Admin/AdminPage.css";

import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as EditIcon } from "../../icons/pencil.svg";
import { ReactComponent as InfoIcon } from "../../icons/info.svg";


function AdminPage({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("catalog");
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [rakFilter, setRakFilter] = useState("");
  const [rakList, setRakList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [notification, setNotification] = useState({ show: false, variant: "", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const handleInfo = (row) => {
  // Open detail modal or show info
  console.log("Info clicked for:", row);
};

const handleEdit = (row) => {
  // Open edit form modal
  console.log("Edit clicked for:", row);
};

  
  const confirmDelete = (id) => {
    setDeleteBookId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteBookId !== null) {
      handleDelete(deleteBookId);
      setShowDeleteModal(false);
      setDeleteBookId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBookId(null);
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, variant: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);


  // Check authentication
  useEffect(() => {
    fetch("http://localhost:3000/api/check_session", { credentials: "include" })
      .then(res => {
        if (res.status === 401) {
          navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  // Fetch rak list
  useEffect(() => {
    fetch("http://localhost:3000/api/rak", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setRakList(json))
      .catch((err) => console.error("Error rak:", err));
  }, []);

  // Fetch katalog data
  useEffect(() => {
    let url = `http://localhost:3000/api/katalog?page=${page}&limit=${limit}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setTotalPages(json.total_pages);
      })
      .catch((err) => console.error("Error:", err));
  }, [query, rakFilter, page, limit]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);



  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/api/buku/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setNotification({ show: true, variant: "success", message: "Buku berhasil dihapus" });
        // Reload data
        let url = `http://localhost:3000/api/katalog?page=${page}&limit=${limit}`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;
        fetch(url, { credentials: "include" })
          .then((res) => res.json())
          .then((json) => {
            setData(json.data);
            setTotalPages(json.total_pages);
          });
      } else {
        setNotification({ show: true, variant: "danger", message: "Gagal menghapus buku" });
      }
    } catch (err) {
      setNotification({ show: true, variant: "danger", message: "Error: " + err });
    }
  };

  return (
    <div className="admin-page">
      {/* Notification */}
      {notification.show && (
        <div className={`alert alert-${notification.variant}`}>
          {notification.message}
        </div>
      )}

      <div className="data-table-card">
        <div className="data-table-header">

          <input
            type="text"
            className="data-table-search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="data-table-controls">
          <div>
            Show{" "}
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>{" "}
            entries
          </div>

          <div>
            <select
              value={rakFilter}
              onChange={(e) => setRakFilter(e.target.value)}
            >
              <option value="">Semua Rak</option>
              {rakList.map((rak, idx) => (
                <option key={idx} value={rak.value}>{rak.label}</option>
              ))}
            </select>
            <button
              className="btn-add"
              onClick={() => {
                setEditBook(null);
                setShowFormModal(true);
              }}
            >
              + Tambah Buku
            </button>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul Buku</th>
                <th>Pengarang</th>
                <th>Penerbit</th>
                <th>Tahun</th>
                <th>Rak</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.judul_buku}</td>
                    <td>{row.pengarang}</td>
                    <td>{row.penerbit}</td>
                    <td>{row.tahun}</td>
                    <td>{row.rak_buku || ""}</td>
                    <td className="action-buttons">
                      <div className="action-buttons">
                        <button className="btn-icon info" onClick={() => setSelectedBook(row)}>
                          <InfoIcon style={{ width: "18px", height: "18px" }} />
                        </button>

                        <button className="btn-icon edit" onClick={() => {
                          setEditBook(row);
                          setShowFormModal(true);
                        }}>
                          <EditIcon style={{ width: "18px", height: "18px" }} />
                        </button>

                        <button className="btn-icon delete" onClick={() => confirmDelete(row.id)}>
                          <TrashIcon style={{ width: "18px", height: "18px" }} />
                        </button>

                        
                      </div>


                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="data-table-footer">
          <span>
            Showing {Math.min((page - 1) * limit + 1, data.length)} to{" "}
            {Math.min(page * limit, data.length)} of {data.length} entries
          </span>
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="active">{page}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {showFormModal && (
        <BookFormModal
          book={editBook}
          onClose={() => {
            setShowFormModal(false);
            setEditBook(null);
          }}
          onSave={async (formData) => {
            const method = editBook ? "PUT" : "POST";
            const url = editBook
              ? `http://localhost:3000/admin/api/buku/${editBook.id}`
              : "http://localhost:3000/admin/api/buku";

            try {
              const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
              });

              if (res.ok) {
                setNotification({
                  show: true,
                  variant: "success",
                  message: editBook ? "Buku berhasil diperbarui" : "Buku berhasil ditambahkan",
                });
                setShowFormModal(false);
                setEditBook(null);

                // Refresh data after save
                let fetchUrl = `http://localhost:3000/api/katalog?page=${page}&limit=${limit}`;
                if (query) fetchUrl += `&q=${encodeURIComponent(query)}`;
                if (rakFilter) fetchUrl += `&rak=${encodeURIComponent(rakFilter)}`;
                fetch(fetchUrl, { credentials: "include" })
                  .then((res) => res.json())
                  .then((json) => {
                    setData(json.data);
                    setTotalPages(json.total_pages);
                  });
              } else {
                setNotification({ show: true, variant: "danger", message: "Gagal menyimpan buku" });
              }
            } catch (err) {
              setNotification({ show: true, variant: "danger", message: "Error: " + err });
            }
          }}
        />


      )}

      {showDeleteModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h3>Konfirmasi Hapus</h3>
            <p>Yakin ingin menghapus buku ini?</p>
            <div className="custom-modal-actions">
              <button onClick={handleCancelDelete}>Batal</button>
              <button className="danger" onClick={handleConfirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default AdminPage;

