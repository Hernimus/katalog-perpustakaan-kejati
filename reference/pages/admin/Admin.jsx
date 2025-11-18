import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form, Table, Card, Pagination, ButtonGroup, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../katalog/Katalog.css";

// Sort options for dropdown
const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'judul_buku', label: 'Judul Buku' },
  { value: 'pengarang', label: 'Pengarang' },
  { value: 'penerbit', label: 'Penerbit' },
  { value: 'tahun', label: 'Tahun' },
  { value: 'rak_buku', label: 'Rak' },
];
const orderOptions = [
  { value: 'asc', label: 'Asc' },
  { value: 'desc', label: 'Desc' },
];

import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form, Table, Card, Pagination, ButtonGroup, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../katalog/Katalog.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/check_session", { credentials: "include" })
      .then(res => {
        if (res.status === 401) {
          navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  // Helper to reload data
  const reloadData = () => {
    let url = `http://127.0.0.1:5000/api/katalog?page=${page}&limit=${limit}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;
    if (globalSortBy) url += `&sort=${globalSortBy}&order=${globalSortOrder}`;
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setTotalPages(json.total_pages);
      })
      .catch((err) => console.error("Error:", err));
  };
  // State for alerts
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [lastAction, setLastAction] = useState(''); // 'edit' or 'delete'
  // Local sort state for table header (client-side sort)
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Handler for table header sort
  const handleSort = (col) => {
    if (sortBy === col) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('asc'); // reset to default (no sort)
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  }

  // Global sort state
  const [globalSortBy, setGlobalSortBy] = useState('');
  const [globalSortOrder, setGlobalSortOrder] = useState('asc');
  const [data, setData] = useState([]);
  // Sorted data for table display (client-side sort)
  const sortedData = sortBy
    ? [...data].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';
        if (sortBy === 'tahun') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          if (sortOrder === 'asc') {
            return valA.localeCompare(valB, undefined, { sensitivity: 'base' });
          } else {
            return valA.localeCompare(valB, undefined, { sensitivity: 'base' }) * -1;
          }
        } else {
          if (sortOrder === 'asc') {
            if (valA < valB) return -1;
            if (valA > valB) return 1;
          } else {
            if (valA < valB) return 1;
            if (valA > valB) return -1;
          }
        }
        return 0;
      })
    : data;
  const [query, setQuery] = useState("");
  const [rakFilter, setRakFilter] = useState("");
  const [rakList, setRakList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/rak", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setRakList(json))
      .catch((err) => console.error("Error rak:", err));
  }, []);

  // (already declared above)

  useEffect(() => {
    let url = `http://127.0.0.1:5000/api/katalog?page=${page}&limit=${limit}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;
    if (globalSortBy) url += `&sort=${globalSortBy}&order=${globalSortOrder}`;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setTotalPages(json.total_pages);
      })
      .catch((err) => console.error("Error:", err));
  }, [query, rakFilter, page, limit, globalSortBy, globalSortOrder]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedBook]);

  const renderPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => setPage(1)} className="page-btn">
          1
        </button>
      );
      if (start > 2) pages.push(<span key="start-dots">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`page-btn ${i === page ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="end-dots">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className="page-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };


  // State untuk form tambah buku (semua field lengkap)
  const [newBook, setNewBook] = useState({
    judul_buku: "",
    pengarang: "",
    penerbit: "",
    tempat_terbit: "",
    tahun: "",
    isbn: "",
    jilid: "",
    edisi: "",
    cetakan: "",
    jumlah_halaman: "",
    rak_buku: "",
    jumlah_buku: "",
    tinggi_buku: "",
    nomor_panggil: "",
    inisial: "",
    perolehan: "",
    harga: "",
    keterangan: "",
    no_induk: ""
  });

  // State untuk edit buku
  const [editBook, setEditBook] = useState(null);

  // Handler tambah buku
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/admin/api/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
        credentials: "include"
      });
      if (res.ok) {
        setNewBook({
          judul_buku: "", pengarang: "", penerbit: "", tempat_terbit: "", tahun: "", isbn: "",
          jilid: "", edisi: "", cetakan: "", jumlah_halaman: "", rak_buku: "", jumlah_buku: "",
          tinggi_buku: "", nomor_panggil: "", inisial: "", perolehan: "", harga: "", keterangan: "", no_induk: ""
        });
        setPage(1);
        reloadData();
      } else {
        alert("Gagal tambah buku");
      }
    } catch (err) {
      alert("Error: " + err);
    }
  };

  // Handler edit buku
  const handleEdit = (row) => {
    setEditBook(row);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:5000/admin/api/buku/${editBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBook),
        credentials: "include"
      });
      if (res.ok) {
        setLastAction('edit');
        setShowSuccessAlert(true);
        setShowEditModal(false);
        setEditBook(null);
        setPage(1);
        reloadData();
      } else {
        setLastAction('edit');
        setShowErrorAlert(true);
      }
    } catch (err) {
      setLastAction('edit');
      setShowErrorAlert(true);
    }
    setTimeout(() => setShowSuccessAlert(false), 2500);
    setTimeout(() => setShowErrorAlert(false), 2500);
  };

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBook, setDeleteBook] = useState(null);

  // Show modal when Hapus is clicked
  const handleDelete = (row) => {
    setDeleteBook(row);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteBook) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/admin/api/buku/${deleteBook.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setLastAction('delete');
        setShowSuccessAlert(true);
        setPage(1);
        reloadData();
      } else {
        setLastAction('delete');
        setShowErrorAlert(true);
      }
    } catch (err) {
      setLastAction('delete');
      setShowErrorAlert(true);
    }
    setShowDeleteModal(false);
    setDeleteBook(null);
    setTimeout(() => setShowSuccessAlert(false), 2500);
    setTimeout(() => setShowErrorAlert(false), 2500);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBook(null);
  };

  return (
    <>
    {/* Floating Alerts */}
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1050,
      minWidth: 300,
      maxWidth: '90vw',
      pointerEvents: 'none'
    }}>
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible style={{ pointerEvents: 'auto' }}>
          {lastAction === 'edit' ? 'Buku berhasil diupdate' : 'Buku berhasil dihapus'}
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible style={{ pointerEvents: 'auto' }}>
          {lastAction === 'edit' ? 'Gagal update buku' : 'Gagal menghapus buku'}
        </Alert>
      )}
    </div>
    <Container className="py-4">
      <h2 className="mb-3">📚 Daftar Katalog Buku (Admin)</h2>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button href="/admin/tambah" variant="success">Tambah Buku Baru</Button>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => { setEditBook(null); setShowEditModal(false); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Buku: {editBook?.judul_buku}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editBook && (
            <Form onSubmit={handleEditSubmit}>
              {Object.keys(editBook).map((key) => (
                <Form.Group className="mb-2" key={key}>
                  <Form.Label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editBook[key]}
                    onChange={e => setEditBook({ ...editBook, [key]: e.target.value })}
                    required={key === "judul_buku" || key === "pengarang"}
                  />
                </Form.Group>
              ))}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="submit" variant="primary">Simpan</Button>
                <Button variant="secondary" onClick={() => { setEditBook(null); setShowEditModal(false); }}>Batal</Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Detail Modal */}
      <Modal show={selectedBook !== null} onHide={() => setSelectedBook(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedBook?.judul_buku}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <Card className="p-3">
              <p><b>Pengarang:</b> {selectedBook.pengarang}</p>
              <p><b>Penerbit:</b> {selectedBook.penerbit}</p>
              <p><b>Tempat Terbit:</b> {selectedBook.tempat_terbit}</p>
              <p><b>Tahun:</b> {selectedBook.tahun}</p>
              <p><b>ISBN:</b> {selectedBook.isbn}</p>
              <p><b>Jilid:</b> {selectedBook.jilid}</p>
              <p><b>Edisi:</b> {selectedBook.edisi}</p>
              <p><b>Cetakan:</b> {selectedBook.cetakan}</p>
              <p><b>Jumlah Halaman:</b> {selectedBook.jumlah_halaman}</p>
              <p><b>Rak Buku:</b> {selectedBook.rak_buku}</p>
              <p><b>Jumlah Buku:</b> {selectedBook.jumlah_buku}</p>
              <p><b>Tinggi Buku (cm):</b> {selectedBook.tinggi_buku}</p>
              <p><b>Nomor Panggil:</b> {selectedBook.nomor_panggil}</p>
              <p><b>Inisial:</b> {selectedBook.inisial}</p>
              <p><b>Perolehan:</b> {selectedBook.perolehan}</p>
              <p><b>Harga:</b> {selectedBook.harga}</p>
              <p><b>Keterangan:</b> {selectedBook.keterangan}</p>
              <p><b>No. Induk:</b> {selectedBook.no_induk}</p>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" onClick={() => setSelectedBook(null)}>Tutup</Button>
              </div>
            </Card>
          )}
        </Modal.Body>
      </Modal>

      {/* Filter Bar */}
      <Row className="mb-3 g-2">
        <Col xs={2}>
          <Form.Select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </Form.Select>
        </Col>
        <Col xs={3}>
          <Form.Select value={rakFilter} onChange={e => { setRakFilter(e.target.value); setPage(1); }}>
            <option value="">Semua Rak</option>
            {rakList.map((rak, idx) => (
              <option key={idx} value={rak.value}>{rak.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Select value={globalSortBy} onChange={e => { setGlobalSortBy(e.target.value); setPage(1); }}>
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Select value={globalSortOrder} onChange={e => { setGlobalSortOrder(e.target.value); setPage(1); }}>
            {orderOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={3}>
          <Form.Control type="text" placeholder="Cari judul, pengarang, atau ISBN..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('judul_buku')}>
              Judul Buku {sortBy === 'judul_buku' ? (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⏺') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('pengarang')}>
              Pengarang {sortBy === 'pengarang' ? (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⏺') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('penerbit')}>
              Penerbit {sortBy === 'penerbit' ? (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⏺') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('tahun')}>
              Tahun {sortBy === 'tahun' ? (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⏺') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('rak_buku')}>
              Rak {sortBy === 'rak_buku' ? (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⏺') : ''}
            </th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row) => (
              <tr key={row.id}>
                <td>{row.judul_buku}</td>
                <td>{row.pengarang}</td>
                <td>{row.penerbit}</td>
                <td>{row.tahun}</td>
                <td>{row.rak_buku}</td>
                <td>
                  <ButtonGroup>
                    <Button size="sm" variant="info" onClick={() => setSelectedBook(row)}>Detail</Button>
                    <Button size="sm" variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>Hapus</Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Card List removed, only table is shown */}

      {/* Pagination */}
      <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Pagination>
            <Pagination.Prev disabled={page <= 1} onClick={() => setPage(page - 1)} />
            {/* Always show first page */}
            <Pagination.Item onClick={() => setPage(1)} active={page === 1}>1</Pagination.Item>
            {/* Pages before input box */}
            {(() => {
              let items = [];
              let start = Math.max(2, page - 2);
              let end = page - 1;
              for (let i = start; i <= end; i++) {
                items.push(
                  <Pagination.Item key={i} onClick={() => setPage(i)}>{i}</Pagination.Item>
                );
              }
              return items;
            })()}
            {/* Center input box */}
            <span style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={e => {
                  let val = Number(e.target.value);
                  if (val >= 1 && val <= totalPages) setPage(val);
                }}
                onClick={e => e.target.select()}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    let val = Number(e.target.value);
                    if (val >= 1 && val <= totalPages) setPage(val);
                  }
                }}
                style={{
                  width: `${String(page).length + 1}ch`,
                  minWidth: '50px',
                  height: '38px',
                  fontSize: '1rem',
                  textAlign: 'center',
                  borderRadius: '0.375rem',
                  border: '1px solid #dee2e6',
                  background: '#fff',
                  boxShadow: 'none',
                  margin: '0 2px',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              />
            </span>
            {/* Pages after input box */}
            {(() => {
              let items = [];
              let start = page + 1;
              let end = Math.min(totalPages - 1, page + 2);
              for (let i = start; i <= end; i++) {
                items.push(
                  <Pagination.Item key={i} onClick={() => setPage(i)}>{i}</Pagination.Item>
                );
              }
              return items;
            })()}
            {/* Always show last page if not already shown */}
            {totalPages > 1 && page < totalPages - 2 && (
              <Pagination.Item onClick={() => setPage(totalPages)} active={page === totalPages}>{totalPages}</Pagination.Item>
            )}
            <Pagination.Next disabled={page >= totalPages} onClick={() => setPage(page + 1)} />
          </Pagination>
        </Col>
      </Row>
    </Container>
      {/* Delete Confirmation Modal */}
  <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Buku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteBook && (
            <span>
              Yakin ingin menghapus buku '<b>{deleteBook.judul_buku}</b>'?
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Admin;
