import { useEffect, useState, useRef } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { motion } from "framer-motion"; // ✅ Tambahkan ini
import BookDetailModal from "../../components/BookDetailModal";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";
import "../../style/Public/PublicPage.css";
import RakModal from "../../components/RakModal";
import LoadingIndicator from "../../components/LoadingIndicator";
import AngleLeft from "../../icons/angle-left.svg";
import AngleRight from "../../icons/angle-right.svg";
import ScrollToTopButton from "../../components/ScrollToTopButton";

function PublicPage() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [rakFilter, setRakFilter] = useState("");
  const [rakList, setRakList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showRakModal, setShowRakModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    const fetchRakData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/public/rak-mapping");

        if (!res.ok) throw new Error("Failed to fetch rak mapping data");

        const mappingData = await res.json();

        const sortedData = mappingData.sort((a, b) => {
          const aNum = parseInt(a.rak_buku) || 0;
          const bNum = parseInt(b.rak_buku) || 0;
          return aNum - bNum;
        });

        const rakOptions = sortedData.map((mapping) => ({
          value: mapping.rak_buku,
          label: `${mapping.rak_buku} - ${mapping.tema}`,
        }));

        setRakList(rakOptions);
      } catch (err) {
        console.error("Error fetching rak data:", err);
        setRakList([]);
      }
    };

    fetchRakData();
  }, []);

  useEffect(() => {
    setLoading(true); // ✅ mulai loading sebelum fetch
    let url = `http://localhost:3000/api/katalog?page=${page}&limit=${limit}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (rakFilter) url += `&rak=${encodeURIComponent(rakFilter)}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setTotalPages(json.total_pages);
        setLoading(false); // ✅ hentikan loading setelah data didapat
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false); // ✅ hentikan loading walau error
      });
  }, [query, rakFilter, page, limit]);


  // Saat rak dipilih dari modal
  const handleRakSelect = (rak) => {
    setRakFilter(rak.value);
    setShowRakModal(false);
    setPage(1);
  };

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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        // Jika dropdown tidak terlihat di layar, tutup otomatis
        if (!isVisible) {
          setShowDropdown(false);
        }
      }
    };

  window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div>
      <Navbar />
      {/* === BAGIAN HEADER + PENCARIAN === */}
      <motion.section
        className="py-5 text-white text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/gambar/masthead5.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          {/* Judul dengan animasi naik pelan */}
          <motion.h1
            className="display-5 fw-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Daftar Katalog Buku
          </motion.h1>

          {/* Deskripsi dengan delay sedikit */}
          <motion.p
            className="lead mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Jelajahi koleksi buku terbaik Perpustakaan Kejaksaan Tinggi Kalimantan Tengah.
          </motion.p>

          {/* === Pencarian Desktop === */}
          <motion.div
            className="d-none d-md-block mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
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
          </motion.div>

          {/* === Pencarian Mobile === */}
          <motion.div
            className="d-block d-md-none mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
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
          </motion.div>
        </div>
      </motion.section>

      <div className="public-page">
       {/* === FILTER BAR DESKTOP === */}
        <div className="filter-bar-desktop d-none d-md-flex justify-content-center flex-wrap gap-3 mb-3">
          {/* === Dropdown Tampilkan === */}
          <div className="d-flex align-items-center gap-2 bg-white p-2 px-3 rounded shadow-sm border">
            <label className="fw-semibold mb-0">Tampilkan</label>
            <select
              className="form-select form-select-sm"
              style={{ width: "80px" }}
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
            <label className="fw-semibold mb-0">Entry</label>
          </div>

          {/* === Dropdown Rak === */}
          <div className="d-flex align-items-center gap-2 bg-white p-2 px-3 rounded shadow-sm border">
            <label className="fw-semibold mb-0">Rak</label>
            <button
              type="button"
              className="form-select form-select-sm text-start"
              style={{ width: "220px" }}
              onClick={() => setShowRakModal(true)}
            >
              {rakList.find((r) => r.value === rakFilter)?.label || "Semua Rak"}
            </button>
          </div>
        </div>


        {/* ✅ ANIMASI PADA TABEL */}
        <motion.div
          className="table-responsive shadow-sm rounded"
          style={{ minHeight: "200px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {loading ? (
            <LoadingIndicator message="Memuat data buku..." color="warning" />
          ) : (
            <motion.table
              className="table table-striped table-hover align-middle mb-0"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <thead className="table-warning">
                <tr>
                  <th>Judul Buku</th>
                  <th>Pengarang</th>
                  <th>Penerbit</th>
                  <th>Tahun</th>
                  <th>Rak</th>
                  <th style={{ width: "100px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>{row.judul_buku}</td>
                      <td>{row.pengarang}</td>
                      <td>{row.penerbit}</td>
                      <td>{row.tahun}</td>
                      <td>{row.rak_buku || "-"}</td>
                      <td>
                        <button
                          onClick={() => setSelectedBook(row)}
                          className="btn btn-sm btn-warning"
                        >
                          Detail
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-3">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          )}
        </motion.div>

        <motion.div
          className="d-block d-md-none text-center my-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-center my-3">
            <motion.div
              className="d-flex justify-content-center gap-3 flex-wrap"
              style={{ flexWrap: "nowrap" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* === Dropdown Jumlah Entry === */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Dropdown
                  as={ButtonGroup}
                  className="fw-semibold text-center"
                  ref={dropdownRef}
                  show={showDropdown}
                  onToggle={(isOpen) => setShowDropdown(isOpen)}
                >
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-limit"
                    className="border border-success rounded-3"
                    style={{
                      width: "130px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "black",
                    }}
                  >
                    {limit} Entry
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    align="end"
                    className="shadow-sm"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {[10, 25, 50, 75, 100].map((n) => (
                      <Dropdown.Item
                        key={n}
                        active={limit === n}
                        onClick={() => {
                          setLimit(n);
                          setPage(1);
                        }}
                        className="fw-semibold"
                      >
                        {n} Entry
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </motion.div>

              {/* === Tombol Pilih Rak === */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fw-semibold text-center"
                style={{
                  width: "130px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  padding: "5px 25px",
                  backgroundColor: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onClick={() => setShowRakModal(true)}
              >
                Rak : {rakList.find((r) => r.value === rakFilter)?.label || "-"}
              </motion.button>
            </motion.div>
          </div>

          <motion.p
            className="text-success mt-2 fw-semibold"
            style={{ fontSize: "15px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Rak Buku :{" "}
            {rakList.find((r) => r.value === rakFilter)?.label || "Semua Rak"}
          </motion.p>
        </motion.div>

        <div className="mobile-view">
          {loading ? (
            <LoadingIndicator
              message="Memuat data buku..."
              size="2.5rem"
              color="warning"
            />
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <motion.div
                key={row.id}
                className="mobile-book-card"
                initial={{ opacity: 0, y: 30 }} // mulai dari bawah & transparan
                animate={{ opacity: 1, y: 0 }}  // muncul perlahan
                transition={{
                  duration: 0.4,
                  delay: index * 0.01, // animasi berurutan tiap item
                }}
                whileHover={{ scale: 1.03 }} // sedikit membesar saat hover
                whileTap={{ scale: 0.98 }} // mengecil sedikit saat diklik (mobile)
              >
                <div className="mobile-book-row">
                  <div className="mobile-rak">
                    <span>{row.rak_buku || "-"}</span>
                  </div>

                  <div className="mobile-book-info">
                    <div
                      className="mobile-book-title clickable"
                      onClick={() => setSelectedBook(row)}
                    >
                      {row.judul_buku}
                    </div>

                    <div className="mobile-book-meta">
                      | {row.pengarang} | {row.penerbit} | {row.tahun}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>Tidak ada data</p>
          )}
        </div>

        <RakModal
          show={showRakModal}
          onHide={() => setShowRakModal(false)}
          rakList={rakList}
          rakFilter={rakFilter}
          onSelect={handleRakSelect}
        />

        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`page-btn ${page <= 1 ? "btn-disabled" : ""}`}
          >
            <img src={AngleLeft} alt="Previous" className="page-icon" />
          </button>

          {renderPageNumbers()}

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`page-btn ${page >= totalPages ? "btn-disabled" : ""}`}
          >
            <img src={AngleRight} alt="Next" className="page-icon" />
          </button>
        </div>

        {selectedBook && (
          <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </div>

      <ScrollToTopButton />

      <WhatsAppButton />
      
      <Footer />
    </div>
  );
}

export default PublicPage;
