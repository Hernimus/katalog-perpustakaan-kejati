import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ImageModal from "../../components/ImageModal";
import WhatsAppButton from "../../components/WhatsAppButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/Public/About.css";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function About() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const [savedScroll, setSavedScroll] = useState(0);


  // ✅ Setiap kali halaman ini dibuka, selalu mulai dari atas
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 🔹 Ambil data galeri dari backend
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const images = data.map((item) =>
            item.filename ? `/uploads/${item.filename}` : item.image_path
          );
          setGalleryImages(images);
        } else {
          setGalleryImages([
            "/gambar/masthead1.webp",
            "/gambar/masthead2.webp",
            "/gambar/masthead3.webp",
          ]);
        }
      })
      .catch(() => {
        setGalleryImages([
          "/gambar/masthead1.webp",
          "/gambar/masthead2.webp",
          "/gambar/masthead3.webp",
        ]);
      });
  }, []);

const openModal = (index) => {
  setStartIndex(index);
  setSavedScroll(window.scrollY);        // simpan posisi scroll
  setModalOpen(true);
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  setModalOpen(false);
  document.body.style.overflow = "auto";

  setTimeout(() => {
    window.scrollTo({
      top: savedScroll,
      behavior: "instant", // atau "auto"
    });
  }, 10);
};

  // 🔹 Animasi tiap section
  const Section = ({ children, delay = 0 }) => (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );

  return (
    <div>
      <Navbar />

            {/* Header Section */}
      <section
        className="py-5 text-white text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/gambar/masthead1.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          <motion.h1
            className="display-5 fw-bold"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tentang Kami
          </motion.h1>
          <motion.p
            className="lead mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Mengenal lebih dekat sistem OPAC dan Perpustakaan Kejaksaan Tinggi
            Kalimantan Tengah
          </motion.p>
        </div>
      </section>

      {/* Profil Perpustakaan */}
      <Section>
        <section className="container mt-5 mb-5">
          <h2 className="fw-semibold mb-4 text-center">
            Profil Perpustakaan Kejaksaan Tinggi Kalimantan Tengah
          </h2>
          <p className="text-muted" style={{ textAlign: "justify" }}>
            Perpustakaan Kejaksaan Tinggi Kalimantan Tengah merupakan bagian
            dari Sub Bagian DASKRIMTI dan Perpustakaan pada Asisten Pembinaan.
            Pengelolaan perpustakaan ini mengacu pada Peraturan Jaksa Agung
            Republik Indonesia Nomor PERJA-009/A/JA/01/2011 tentang Tugas Bidang
            Pembinaan, dan Nomor PER-038/A/JA/2011 tentang Pengelolaan
            Perpustakaan Hukum dan Dokumentasi Peraturan Perundang-Undangan di
            Lingkungan Kejaksaan Republik Indonesia.
          </p>
          <p className="text-muted" style={{ textAlign: "justify" }}>
            Perpustakaan ini berfungsi sebagai sarana penunjang pelaksanaan
            tugas kedinasan dengan menyediakan berbagai bahan pustaka hukum,
            referensi, dan dokumentasi yang mendukung profesionalisme aparatur
            kejaksaan.
          </p>
          <p className="text-muted" style={{ textAlign: "justify" }}>
            Koleksi perpustakaan meliputi peraturan perundang-undangan,
            yurisprudensi, buku standar ilmu hukum, buku teks bidang ilmu lain,
            serta majalah dan dokumen pemerintahan. Sebagian koleksi diperoleh
            melalui sumbangan dari Kejaksaan Agung, para pegawai, dan instansi
            lain.
          </p>
        </section>
      </Section>

      {/* Visi dan Misi */}
      <Section delay={0.2}>
        <section className="bg-light py-3">
          <div className="container text-center">
            <h2 className="fw-semibold mb-4">Visi dan Misi Perpustakaan</h2>
            <div className="row g-3 justify-content-center">
              <div className="col-md-5">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Visi</h5>
                    <p className="card-text text-muted">
                      Terwujudnya Kejaksaan sebagai Lembaga Penegak Hukum yang
                      bersih, efektif, efisien, transparan dan akuntabel dalam
                      mewujudkan supremasi hukum.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Misi</h5>
                    <p className="card-text text-muted">
                      Menyediakan koleksi dan layanan yang mendukung pengembangan
                      profesionalisme aparatur kejaksaan serta meningkatkan
                      integritas dan responsivitas lembaga dalam merespons
                      perkembangan ilmu pengetahuan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* Layanan Perpustakaan */}
      <Section delay={0.3}>
        <section className="layanan-section">
          <div className="container text-center">
            <h2 className="fw-bold mb-3">Layanan Perpustakaan</h2>
            <p className="text-muted mb-5">
              Perpustakaan Kejaksaan Tinggi Kalimantan Tengah menyediakan
              layanan informasi dan referensi hukum untuk mendukung kegiatan
              literasi serta peningkatan kompetensi aparatur kejaksaan.
            </p>

            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="layanan-card h-100">
                  <h5>Layanan Referensi</h5>
                  <p>
                    Membantu pengguna menemukan sumber hukum, peraturan
                    perundang-undangan, dan bahan literatur sesuai kebutuhan
                    kajian atau penelitian hukum.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="layanan-card h-100">
                  <h5>Layanan Baca di Tempat</h5>
                  <p>
                    Menyediakan ruang baca yang nyaman dan kondusif bagi pegawai
                    untuk membaca, menulis, atau melakukan studi pustaka secara
                    langsung di lokasi perpustakaan.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="layanan-card h-100">
                  <h5>Layanan Digital / OPAC</h5>
                  <p>
                    Menyediakan sistem katalog digital (Online Public Access
                    Catalog) untuk pencarian koleksi buku, dokumen, dan
                    referensi hukum secara internal.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="layanan-card h-100">
                  <h5>Layanan Koleksi Khusus</h5>
                  <p>
                    Menyediakan akses terhadap koleksi khusus seperti dokumen
                    peraturan internal, literatur hukum klasik, dan arsip penting
                    lainnya dengan izin petugas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Section>

      {/* 🔹 Galeri */}
      <Section delay={0.3}>
        <section className="py-3">
          <div className="container text-center">
            <h2 className="fw-semibold mb-4">Galeri Kegiatan</h2>
            <p className="text-muted mb-5">
              Dokumentasi kegiatan dan fasilitas di lingkungan Perpustakaan
              Kejaksaan Tinggi Kalimantan Tengah.
            </p>

            {galleryImages.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                }}
              >
                {galleryImages.map((src, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      onClick={() => openModal(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={src}
                        alt={`Galeri ${index + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                        onError={(e) => (e.target.src = "/gambar/masthead1.webp")}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-muted">Belum ada gambar galeri.</p>
            )}
          </div>
        </section>
      </Section>

      {/* 🔹 Modal fullscreen */}
      {modalOpen && (
        <ImageModal
          images={galleryImages}
          startIndex={startIndex}
          onClose={closeModal}
        />
      )}

      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default About;
