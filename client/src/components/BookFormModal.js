import React, { useState, useEffect } from "react";
import "../style/components/BookFormModal.css";

function BookFormModal({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
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
    no_induk: "",
  });

  const [rakOptions, setRakOptions] = useState([]);

  useEffect(() => {
    const fetchRakOptions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/rak-mapping", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // Sort by rak_buku numerically
          const sortedData = data.sort((a, b) => {
            const aNum = parseInt(a.rak_buku) || 0;
            const bNum = parseInt(b.rak_buku) || 0;
            return aNum - bNum;
          });
          setRakOptions(
            sortedData.map((mapping) => ({
              value: mapping.rak_buku,
              label: `${mapping.rak_buku} - ${mapping.tema}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching rak options:", err);
      }
    };

    fetchRakOptions();
  }, []);

  useEffect(() => {
    if (book) {
      setFormData({
        judul_buku: book.judul_buku || "",
        pengarang: book.pengarang || "",
        penerbit: book.penerbit || "",
        tempat_terbit: book.tempat_terbit || "",
        tahun: book.tahun || "",
        isbn: book.isbn || "",
        jilid: book.jilid || "",
        edisi: book.edisi || "",
        cetakan: book.cetakan || "",
        jumlah_halaman: book.jumlah_halaman || "",
        rak_buku: book.rak_buku || "",
        jumlah_buku: book.jumlah_buku || "",
        tinggi_buku: book.tinggi_buku || "",
        nomor_panggil: book.nomor_panggil || "",
        inisial: book.inisial || "",
        perolehan: book.perolehan || "",
        harga: book.harga || "",
        keterangan: book.keterangan || "",
        no_induk: book.no_induk || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? "Edit Buku" : "Tambah Buku"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-scroll">
            {Object.keys(formData).map((key) => (
              <div className="form-groupbook" key={key}>
                <label>{key.replace(/_/g, " ")}</label>
                {key === "rak_buku" ? (
                  <select
                    className="rak-select"
                    size="0.5"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Rak Buku</option>
                    {rakOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="save-btn">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
