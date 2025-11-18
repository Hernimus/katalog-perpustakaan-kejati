import React, { useEffect, useState, lazy, Suspense } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/Public/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


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

  const slides = [
    {
      title: "Perpustakaan Kejaksaan Tinggi Kalimantan Tengah",
      desc: "Sumber pengetahuan digital bagi pegawai",
      img: "/gambar/masthead.webp",
    },
    {
      title: "Berbagai Koleksi Buku",
      desc: "Temukan berbagai buku hukum dan literasi umum yang informatif.",
      img: "/gambar/masthead5.webp",
    },
    {
      title: "Akses Katalog Digital",
      desc: "Nikmati kemudahan mencari buku secara online kapan pun.",
      img: "/gambar/masthead4.webp",
    },
  ];

  const fasilitas = [
    {
      title: "Ruang Baca Nyaman",
      text: "Ruang baca bersih dan tenang dengan meja serta kursi yang tertata rapi, mendukung kegiatan membaca dan telaah dokumen hukum. Pengunjung dapat menikmati suasana yang hening untuk fokus dan meningkatkan produktivitas membaca.",
    },
    {
      title: "Ruang Ber-AC dan Kipas Angin",
      text: "Dilengkapi pendingin ruangan dan kipas angin agar suasana tetap sejuk dan kondusif bagi pengguna. Kenyamanan suhu ruangan membantu menjaga fokus selama beraktivitas di perpustakaan.",
    },
    {
      title: "Kamar Mandi Bersih",
      text: "Tersedia kamar mandi yang bersih dan nyaman untuk digunakan oleh pegawai dan pengunjung perpustakaan. Kebersihan dijaga secara rutin agar pengguna merasa aman dan nyaman.",
    },
    {
      title: "Akses Katalog Digital Mandiri",
      text: "Pegawai dapat mengakses katalog perpustakaan secara online melalui perangkat pribadi seperti laptop atau ponsel tanpa perlu komputer khusus. Hal ini mempermudah pencarian koleksi buku kapan saja dan di mana saja di lingkungan kantor.",
    },  
    {
      title: "Rak Koleksi Buku",
      text: "Rak koleksi tertata rapi berdasarkan kategori hukum, literatur umum, dan dokumentasi internal untuk memudahkan pencarian buku. Setiap rak dilengkapi label yang jelas agar pengguna dapat menemukan koleksi dengan cepat.",
    },

  ];

  return (
    <div>
      <Navbar />

      <section className="hero-carousel position-relative">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="hero-swiper"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="vh-100 d-flex align-items-center justify-content-center text-center text-white"
                style={{
                  backgroundImage: `url('${slide.img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                ></div>

                <div className="container position-relative">
                  <motion.h1
                    className="display-5 fw-bold text-warning"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    className="lead mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {slide.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Link
                      to="/katalog"
                      className="btn btn-warning btn-lg px-4 py-2 text-dark fw-semibold shadow"
                    >
                      Jelajahi Koleksi
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <Section delay={0.2}>
        <section className="fasilitas-section">
          <div className="container">
            <h2 className="fw-bold text-center mb-5 text-dark">
              Fasilitas Perpustakaan
            </h2>

            {fasilitas.map((item, index) => {
              // Variasi animasi: kiri-kanan bergantian
              const isEven = index % 2 === 0;
              const variants = {
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            };

              return (
                <motion.div
                  key={index}
                  className={`fasilitas-card row align-items-center ${
                    !isEven ? "flex-lg-row-reverse" : ""
                  }`}
                  variants={variants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Gambar */}
                  <div className="col-lg-4 mb-4 mb-lg-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="fasilitas-image-wrapper  overflow-hidden"
                    >
                      <img
                        src={`/gambar/masthead${index + 1}.webp`}
                        alt={item.title}
                        className="img-fluid fasilitas-image"
                      />
                    </motion.div>
                  </div>

                  {/* Teks */}
                  <div className="col-lg-8 fasilitas-text text-lg-start text-center">
                    <h4 className="fw-semibold mb-3">
                      {`${index + 1}. ${item.title}`}
                    </h4>
                    <p className="text-muted mb-0">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </Section>

      {/* FAQ */}
      <Section delay={0.3}>
        <div className="py-4 bg-light">
          <div className="container">
            <h2 className="fw-bold mb-2 text-center">
              Ada Pertanyaan? Lihat Jawaban di Sini!
            </h2>
            <p className="text-muted text-center mb-4">
              Temukan berbagai informasi umum seputar layanan dan sistem katalog
              digital perpustakaan.
            </p>

            <div className="row align-items-center">
              <div className="col-md-5 text-center d-none d-md-block">
                <img
                  src="/FAQ.png"
                  alt="FAQ Illustration"
                  style={{ maxHeight: "350px", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>

              <div className="col-md-7">
                <div className="accordion" id="faqAccordion">
                  {[
                    {
                      q: "Apa itu OPAC (Online Public Access Catalog)?",
                      a: (
                        <>
                          <strong>OPAC</strong> (Online Public Access Catalog) adalah
                          sistem katalog digital yang memudahkan pengguna untuk
                          menelusuri koleksi buku di perpustakaan secara online.
                          Melalui OPAC, pengguna dapat menelusuri koleksi perpustakaan
                          (seperti buku, jurnal, atau majalah) secara digital dengan
                          mudah dan cepat, tanpa harus mencari secara manual di rak.
                        </>
                      ),
                    },
                    {
                      q: "Apa keunggulan dari sistem katalog ini?",
                      a: (
                        <>
                          Sistem katalog perpustakaan ini memiliki beberapa keunggulan:
                          <ul className="mt-2 mb-0">
                            <li>
                              Akses katalog online dari mana saja, kapan saja.
                            </li>
                            <li>
                              Menampilkan informasi detail koleksi (pengarang,
                              penerbit, lokasi rak).
                            </li>
                            <li>
                              Pencarian koleksi lebih mudah dengan filter judul,
                              pengarang, atau ISBN.
                            </li>
                            <li>
                              Dapat melihat koleksi-koleksi terbaru yang baru
                              ditambahkan.
                            </li>
                          </ul>
                        </>
                      ),
                    },
                    {
                      q: "Bagaimana cara mengakses katalog buku?",
                      a: (
                        <>
                          Anda dapat mengakses katalog melalui menu{" "}
                          <strong>“Katalog”</strong> di bagian atas halaman, lalu
                          mencari berdasarkan judul atau pengarang.
                        </>
                      ),
                    },
                    {
                      q: "Apakah perpustakaan ini terbuka untuk umum?",
                      a: "Perpustakaan ini ditujukan untuk pegawai Kejaksaan, namun masyarakat dapat mengakses koleksi digital tertentu secara daring.",
                    },
                  ].map((item, i) => (
                    <div className="accordion-item" key={i}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            i === 0 ? "" : "collapsed"
                          } fw-semibold`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq${i}`}
                          aria-expanded={i === 0}
                        >
                          {item.q}
                        </button>
                      </h2>
                      <div
                        id={`faq${i}`}
                        className={`accordion-collapse collapse ${
                          i === 0 ? "show" : ""
                        }`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div
                          className="accordion-body"
                          style={{ textAlign: "justify" }}
                        >
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* LOKASI PERPUSTAKAAN */}
      <Section delay={0.3}>
        <section className="py-5 bg-white">
          <div className="container text-center">
            <h2 className="fw-semibold mb-4 text-dark">Lokasi Perpustakaan</h2>
            <p className="text-muted mb-4">
              Jl. Imam Bonjol No.10, Menteng, Jekan Raya, Palangka Raya
            </p>

            <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8400564247972!2d113.91695401085154!3d-2.2139595373350147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dfcb3928a2b5171%3A0x72d8b65313de2509!2sKejaksaan%20Tinggi%20Kalimantan%20Tengah!5e0!3m2!1sid!2sid!4v1760491391181!5m2!1sid!2sid"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Perpustakaan"
              ></iframe>
            </div>
          </div>
        </section>
      </Section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default Home;
