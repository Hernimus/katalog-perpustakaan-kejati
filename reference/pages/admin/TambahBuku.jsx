import React, { useState } from "react";
import "../katalog/Katalog.css";

const initialBook = {
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
};

function TambahBuku() {
  const [newBook, setNewBook] = useState(initialBook);
  const [loading, setLoading] = useState(false);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/admin/api/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
        credentials: "include"
      });
      if (res.ok) {
        alert("Buku berhasil ditambahkan");
        setNewBook(initialBook);
      } else {
        alert("Gagal tambah buku");
      }
    } catch (err) {
      alert("Error: " + err);
    }
    setLoading(false);
  };

  return (
    <div className="content-container" style={{maxWidth: 900, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
      <h2 style={{marginBottom: 8}}>Tambah Buku Baru</h2>
      <hr />
      <form onSubmit={handleAddBook} className="row g-3">
        <div className="col-md-12">
          <label className="form-label">Judul Buku</label>
          <input type="text" className="form-control" value={newBook.judul_buku} onChange={e => setNewBook({...newBook, judul_buku: e.target.value})} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Pengarang</label>
          <input type="text" className="form-control" value={newBook.pengarang} onChange={e => setNewBook({...newBook, pengarang: e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Penerbit</label>
          <input type="text" className="form-control" value={newBook.penerbit} onChange={e => setNewBook({...newBook, penerbit: e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tempat Terbit</label>
          <input type="text" className="form-control" value={newBook.tempat_terbit} onChange={e => setNewBook({...newBook, tempat_terbit: e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tahun</label>
          <input type="text" className="form-control" value={newBook.tahun} onChange={e => setNewBook({...newBook, tahun: e.target.value})} />
        </div>
        <div className="col-12">
          <label className="form-label">ISBN</label>
          <input type="text" className="form-control" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Jilid</label>
          <input type="text" className="form-control" value={newBook.jilid} onChange={e => setNewBook({...newBook, jilid: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Edisi</label>
          <input type="text" className="form-control" value={newBook.edisi} onChange={e => setNewBook({...newBook, edisi: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Cetakan</label>
          <input type="text" className="form-control" value={newBook.cetakan} onChange={e => setNewBook({...newBook, cetakan: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Jumlah Halaman</label>
          <input type="text" className="form-control" value={newBook.jumlah_halaman} onChange={e => setNewBook({...newBook, jumlah_halaman: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Rak Buku</label>
          <input type="text" className="form-control" value={newBook.rak_buku} onChange={e => setNewBook({...newBook, rak_buku: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Jumlah Buku</label>
          <input type="text" className="form-control" value={newBook.jumlah_buku} onChange={e => setNewBook({...newBook, jumlah_buku: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tinggi Buku (cm)</label>
          <input type="text" className="form-control" value={newBook.tinggi_buku} onChange={e => setNewBook({...newBook, tinggi_buku: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nomor Panggil</label>
          <input type="text" className="form-control" value={newBook.nomor_panggil} onChange={e => setNewBook({...newBook, nomor_panggil: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Inisial</label>
          <input type="text" className="form-control" value={newBook.inisial} onChange={e => setNewBook({...newBook, inisial: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Perolehan</label>
          <input type="text" className="form-control" value={newBook.perolehan} onChange={e => setNewBook({...newBook, perolehan: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Harga</label>
          <input type="text" className="form-control" value={newBook.harga} onChange={e => setNewBook({...newBook, harga: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Keterangan</label>
          <input type="text" className="form-control" value={newBook.keterangan} onChange={e => setNewBook({...newBook, keterangan: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label className="form-label">No. Induk</label>
          <input type="text" className="form-control" value={newBook.no_induk} onChange={e => setNewBook({...newBook, no_induk: e.target.value})} />
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Buku"}</button>
          <a href="/admin/" className="btn btn-secondary" style={{marginLeft:8}}>Batal</a>
        </div>
      </form>
    </div>
  );
}

export default TambahBuku;
