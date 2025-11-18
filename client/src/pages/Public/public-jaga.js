import { useEffect, useState } from "react";
import BookDetailModal from "../../components/BookDetailModal";
import Footer from "../../components/Footer";
import { Card, Button, Row, Col } from "react-bootstrap";
import "../../style/PublicPage.css"; // ✅ Import CSS



function PublicPage() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [rakFilter, setRakFilter] = useState("");
  const [rakList, setRakList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch rak list
  useEffect(() => {
    fetch("http://localhost:3000/api/rak")
      .then((res) => res.json())
      .then((json) => setRakList(json))
      .catch((err) => console.error("Error rak:", err));
  }, []);

  // Fetch katalog data
  useEffect(() => {
    let url = `http://localhost:3000/api/katalog?page=${page}&limit=${limit}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;

    fetch(url)
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

  return (
    <div>
    <div className="public-page">
      <section
        className="py-5 text-white text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/masthead3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Daftar Katalog Buku</h1>
          <p className="lead mt-3">
            Jelajahi koleksi buku terbaik Perpustakaan Kejaksaan Tinggi Kalimantan Tengah.
          </p>

          {/* === Pencarian Desktop === */}
          <div className="d-none d-md-block mt-4">
            <div className="d-flex justify-content-center">
              <div style={{ width: "400px", maxWidth: "100%" }}>
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Cari judul, pengarang, atau ISBN..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* === Pencarian Mobile === */}
          <div className="d-block d-md-none mt-4">
            <div className="row g-2 justify-content-center">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Cari judul, pengarang, atau ISBN..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <div className="form-group">
          <label className="form-label me-2">Tampilkan</label>
          <select
            className="form-select d-inline-block"
            style={{ width: "100px" }}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label me-2">Rak</label>
          <select
            className="form-select d-inline-block"
            style={{ width: "180px" }}
            value={rakFilter}
            onChange={(e) => {
              setRakFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Rak</option>
            {rakList.map((rak, idx) => (
              <option key={idx} value={rak.value}>
                {rak.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* === Tampilan Desktop === */}
      <div className="book-list d-none d-md-block mt-3">
        {data.length > 0 ? (
          data.map((row) => (
            <Row
              key={row.id}
              className="py-3 align-items-center"
              style={{ borderBottom: "4px solid #555" }}
            >
              {/* Gambar Buku */}
              <Col md={2} className="text-center mb-3 mb-md-0">
                <img
                  src="/Buku.png"
                  alt="Book Icon"
                  className="img-fluid"
                  style={{ maxWidth: "120px" }}
                />
              </Col>

              {/* Informasi Buku */}
              <Col md={9}>
                <h5 className="fw-bold text-dark mb-1">{row.judul_buku || "(Judul Buku)"}</h5>
                <p className="text-dark mb-0">
                  <strong>Pengarang :</strong> {row.pengarang || "(Nama Pengarang)"} <br />
                  <strong>Penerbit :</strong> {row.penerbit || "(Nama Penerbit)"} <br />
                  <strong>Tahun :</strong> {row.tahun || "(Tahun Terbit)"} <br />
                  <strong>Rak :</strong> {row.rak_buku || "(Rak Buku)"}
                </p>
              </Col>
            </Row>

          ))
        ) : (
          <p className="text-center py-4 text-muted">Tidak ada data</p>
        )}
      </div>

      {/* === Tampilan Mobile === */}
      <div className="mobile-view d-block d-md-none mt-3">
        <div className="text-center my-3">
          <h5 className="fw-bold">{data.length} Buku</h5>
        </div>

        <div className="container mb-3">
          <div className="row g-2">
            <div className="col-6">
              <select
                className="form-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10 / Hal</option>
                <option value={25}>25 / Hal</option>
                <option value={50}>50 / Hal</option>
                <option value={75}>75 / Hal</option>
                <option value={100}>100 / Hal</option>
              </select>
            </div>

            <div className="col-6">
              <select
                className="form-select"
                value={rakFilter}
                onChange={(e) => {
                  setRakFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Semua Rak</option>
                {rakList.map((rak, idx) => (
                  <option key={idx} value={rak.value}>
                    {rak.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {data.length > 0 ? (
          data.map((row) => (
            <div key={row.id} className="mobile-book-card border-top border-dark py-2">
              <div className="mobile-book-row d-flex align-items-start gap-2">
                <div className="mobile-rak fw-bold text-center" style={{ width: "40px" }}>
                  {row.rak_buku || "-"}
                </div>

                <div className="mobile-book-info flex-grow-1">
                  <div
                    className="mobile-book-title fw-semibold"
                    onClick={() => setSelectedBook(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.judul_buku}
                  </div>
                  <div className="mobile-book-meta text-muted small">
                    | {row.pengarang} | {row.penerbit} | {row.tahun}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Tidak ada data</p>
        )}
      </div>

      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`page-btn ${page <= 1 ? "btn-disabled" : ""}`}
        >
          ⬅
        </button>
        {renderPageNumbers()}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`page-btn ${page >= totalPages ? "btn-disabled" : ""}`}
        >
          ➡
        </button>
      </div>

      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
    <Footer />
    </div>
  );

}

export default PublicPage;
